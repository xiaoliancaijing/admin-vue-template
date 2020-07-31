<!--
 * @Author: peng.wan
 * @Date: 2020-06-30 16:11:03
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-13 16:41:15
 * @Descripttion: 
-->
<template>
	<div class="refundPage">
		<!-- 售后状态 -->
		<el-card class="box-card">
			<h3>售后状态</h3>
			<p>
				<span class="status_item">售后编号：{{ orderInfo.num }}</span>
				<span class="status_item">状态：{{ orderInfo.statusName }}</span>
				<!-- <span class="status_item">上次售后处理人：{{ orderInfo.handler }}</span> -->
			</p>
		</el-card>
		<!-- 售后信息 -->
		<el-card class="box-card">
			<h3>售后信息</h3>
			<p>
				订单编号：{{ orderInfo.orderNum }}
				<el-button type="primary" size="mini" @click="onClickOrder">
					查看订单
				</el-button>
			</p>
			<p>会员昵称：{{ orderInfo.userReceiverName }}</p>
			<p>售后方式：{{ orderInfo.afterTypeName }}</p>
			<p>售后原因：{{ orderInfo.afterReason }}</p>
			<p>
				<span class="status_item">
					申请售后金额：￥{{ orderInfo.payPrice - orderInfo.fare }}
				</span>
				<span class="status_item">运费：￥{{ orderInfo.fare }}</span>
			</p>
			<p>订单合计：￥{{ orderInfo.payPrice }}</p>
		</el-card>
		<!-- 物流信息 -->
		<el-card class="box-card" v-if="orderInfo.status === 'USER_PROCESSED'">
			<h3>物流信息</h3>
			<p>售后物流：{{ orderInfo.orderReturnExpress.receiverCompany }}</p>
			<p>售后物流单号：{{ orderInfo.orderReturnExpress.receiverNum }}</p>
		</el-card>
		<!-- 售后明细 -->
		<el-card class="box-card">
			<h3>售后明细</h3>
			<p>售后描述</p>
			<p style="text-indent: 32px;">{{ orderInfo.afterDescription || '' }}</p>
			<p v-if="isShowImage">附件图片</p>
			<div class="demo-image__preview" v-if="isShowImage">
				<el-image
					style="width: 100px; height: 100px;margin-right:10px"
					v-for="(item, index) in orderInfo.images"
					:key="'images' + index"
					:src="item"
					:preview-src-list="orderInfo.images"
				></el-image>
			</div>
		</el-card>
		<!-- 售后操作 -->
		<el-card class="box-card">
			<h3>售后操作</h3>
			<el-form
				:model="ruleForm"
				ref="ruleForm"
				:rules="rules"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item v-if="!isShowSupplierInfo" label="确认售后金额：" prop="refundAmount">
					<el-input
						v-model.trim="ruleForm.refundAmount"
						placeholder="请输入售后金额"
						size="small"
						maxlength="10"
					></el-input>
				</el-form-item>
				<el-form-item label="发货供应商：" v-if="isShowSupplierInfo">
					<span>{{ ruleForm.supplierName }}</span>
					<h4>发货地址</h4>
					<p>收货人：{{ ruleForm.supplierSenderName }}</p>
					<p>联系方式：{{ ruleForm.supplierPhone }}</p>
					<p>收货地址：{{ ruleForm.supplierAddress }}</p>
				</el-form-item>
				<el-form-item
					label="物流名称："
					prop="expressCompany"
					v-if="
						orderInfo.afterType === 'EXCHANGE_GOODS' &&
							orderInfo.status === 'USER_PROCESSED'
					"
				>
					<el-select
						v-model.trim="ruleForm.expressCompany"
						placeholder="请选择"
						size="small"
					>
						<el-option
							v-for="item in logistiCsompany"
							:key="item.code"
							:label="item.name"
							:value="item.name"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="物流单号："
					prop="expressNumber"
					v-if="
						orderInfo.afterType === 'EXCHANGE_GOODS' &&
							orderInfo.status === 'USER_PROCESSED'
					"
				>
					<el-input
						v-model.trim="ruleForm.expressNumber"
						placeholder="请输入物流单号"
						maxlength="20"
						size="small"
					/>
				</el-form-item>
				<el-form-item
					label="收货人信息："
					v-if="
						orderInfo.afterType === 'EXCHANGE_GOODS' &&
							orderInfo.status === 'USER_PROCESSED'
					"
				>
					<span>{{ orderInfo.userReceiverName }}</span>
					|
					<span>{{ orderInfo.userReceiverPhone }}</span>
					|
					<span>{{ orderInfo.userReceiverAddress }}</span>
				</el-form-item>
				<el-form-item
					label="备注"
					prop="remark"
					:rules="[{ required: true, message: '请输入备注', trigger: 'blur' }]"
				>
					<el-input
						v-model.trim="ruleForm.remark"
						type="textarea"
						maxlength="500"
						show-word-limit
						placeholder="请输入备注"
					></el-input>
				</el-form-item>

				<el-form-item>
					<el-button @click="resetForm('ruleForm')">驳回</el-button>
					<el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { logistiCsompany } from '@/utils/logisticsCompany'
import { Message } from 'element-ui'
import { parseTime } from '@/utils'
import { getAfterServiceInfo, applyForPass, applyForReject } from '@/api/orderAfterService'
export default {
	name: 'refundPage',
	data() {
		// 物流单号校检
		const validatorExpressNumber = (rule, value, callback) => {
			if (!/^[A-Za-z0-9]{3,20}$/.test(value)) {
				return callback(new Error('请输入正确的物流单号'))
			} else if (!value) {
				return callback(new Error('请输入物流单号'))
			} else {
				callback()
			}
		}
		// 售后金额校检
		const validatorRefundAmount = (rule, value, callback) => {
			const totalPrice = this.orderInfo.payPrice
			if (value === '') {
				return callback(new Error('退款金额不能为空'))
			} else if (!/^[0-9]+(.[0-9]{2})?$/.test(value)) {
				return callback(new Error('最多输入2位小数'))
			} else if (value === '0') {
				callback(new Error('退款金额不能为0'))
			} else if (value > totalPrice) {
				callback(new Error('退款金额不得大于订单合计金额'))
			} else {
				callback()
			}
		}
		return {
			// id: this.$route.query.id || null,
			ruleForm: {
				refundAmount: null, // 确认退款金额
				supplierName: null, // 供应商名称
				supplierSenderName: null, // 收货人（供应商收货人）
				supplierPhone: null, // 收货电话（供应商收货电话）
				supplierAddress: null, // 收货地址（供应商收货地址）
				expressCompany: null, // 快递公司
				expressNumber: null, // 快递单号
				remark: null, // 备注
				id: this.$route.query.id || null,
			},
			rules: {
				expressCompany: [{ required: true, trigger: 'blur', message: '请选择物流公司' }],
				expressNumber: [
					{
						validator: validatorExpressNumber,
						required: true,
						trigger: 'blur',
					},
				],
				refundAmount: [
					{
						validator: validatorRefundAmount,
						required: true,
						trigger: 'blur',
					},
				],
			},
			logistiCsompany: logistiCsompany,
			orderInfo: { orderReturnExpress: {}, images: [] },
			isShowSupplierInfo: false,
			isShowImage: false,
		}
	},
	mounted() {
		if (this.ruleForm.id) {
			getAfterServiceInfo({ id: this.ruleForm.id }).then(res => {
				if (res.success) {
					this.orderInfo = res.data
					this.orderInfo.images = res.data.images.split(',')
					console.log(this.orderInfo.images)
					if (this.orderInfo.images[0]) {
						this.isShowImage = true
					}
					this.orderReturnExpress = res.data.orderReturnExpress
					this.ruleForm.refundAmount = res.data.payPrice - res.data.fare
					if (res.data.afterType !== 'REFUND' && res.data.status === 'WAIT_DISPOSE') {
						this.isShowSupplierInfo = true
					}
					if (
						res.data.afterType === 'EXCHANGE_GOODS' &&
						res.data.status === 'USER_PROCESSED'
					) {
						this.isShowSupplierInfo = true
					}
					if (res.data.orderReturnExpress) {
						this.ruleForm.supplierAddress = res.data.orderReturnExpress.supplierAddress
						this.ruleForm.supplierName = res.data.orderReturnExpress.supplierName
						this.ruleForm.supplierPhone = res.data.orderReturnExpress.supplierPhone
						this.ruleForm.supplierSenderName =
							res.data.orderReturnExpress.supplierSenderName
					}
				}
			})
		}
	},
	methods: {
		// 查看订单
		onClickOrder() {
			this.$router.push({ path: '/order/detail', query: { id: this.orderInfo.orderId } })
		},
		// 确认
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					applyForPass({ ...this.ruleForm }).then(res => {
						if (res.success) {
							Message.success('操作成功！！')
							this.$router.go(-1)
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 驳回
		resetForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					applyForReject({ ...this.ruleForm }).then(res => {
						if (res.success) {
							Message.success('操作成功！！')
							this.$router.go(-1)
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.box-card {
	margin-bottom: 10px;
}
.el-textarea {
	width: 400px;
}
.el-form-item__content {
	h4,
	p {
		margin: 0;
		line-height: 20px;
	}
}
.status_item {
	margin-right: 20px;
}
</style>
