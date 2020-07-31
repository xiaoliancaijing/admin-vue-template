<!--
 * @Author: tianhao
 * @Date: 2020-06-16 16:25:07
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-15 11:26:40
 * @Descripttion: 
 已发货、已关闭、售后
 已关闭、售后需要传入参数:
 refund:true
-->
<template>
	<div class="order_detail">
		<el-steps :active="active" align-center finish-status="success">
			<el-step
				v-for="item in orderStatus"
				:title="item.title"
				:key="item.id"
				:description="parseTime(item.time)"
			></el-step>
		</el-steps>
		<div class="state">
			<div class="content">
				<div class="order_state">
					<p>当前订单状态</p>
					<div class="status_text">{{ status }}</div>
					<div v-if="status === '待付款'">
						<el-button size="small" @click="closeOrder" type="primary">
							关闭订单
						</el-button>
					</div>
					<div v-if="status === '待发货' && formInline.afterFlag === false">
						<el-button
							size="small"
							:disabled="!btuVisible"
							@click="sendExpressVisible = true"
							type="primary"
						>
							发货
						</el-button>
						<el-button
							size="small"
							:disabled="!btuVisible"
							@click="refundVisible = true"
							type="primary"
						>
							退款
						</el-button>
					</div>
				</div>
				<div class="btn">
					<el-button size="small" @click="dialogVisible = true" type="primary">
						订单追踪
					</el-button>
				</div>
			</div>
		</div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<div class="texts item">
				<el-form class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="订单编号:">{{ formInline.orderNum }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="交易流水号:" v-if="formInline.weChatTransactionId">
								{{ formInline.weChatTransactionId }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="会员昵称:">
								<router-link
									tag="a"
									:to="{
										path: '/user/userDetail',
										query: { userId: formInline.userId },
									}"
								>
									{{ formInline.userName }}
								</router-link>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="订单类型:">
								{{ orderType(formInline.type) }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="活动营销:" v-if="formInline.actType">
								{{ formInline.actType == 'TIME' ? '限时抢购' : '' }}
							</el-form-item>
						</el-col>
						<el-col :span="6" v-if="showSupplier">
							<el-form-item label="配送方式:">
								{{ formInline.expressCompany }}
							</el-form-item>
						</el-col>
						<el-col :span="6" v-if="showSupplier">
							<el-form-item label="物流单号:">
								{{ formInline.expressNumber }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>收货人信息</span>
			</div>
			<div class="texts item">
				<el-form class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="收货人:">
								{{ formInline.receiverName }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="手机号:">
								{{ formInline.receiverPhone }}
							</el-form-item>
						</el-col>

						<el-col :span="6">
							<el-form-item label="收货地址:">
								{{ formInline.receiverAddress }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card" v-if="showSupplier">
			<div slot="header" class="clearfix">
				<span>发货供应商信息</span>
			</div>
			<div class="texts item">
				<el-form class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="供应商名称:">
								{{ formInline.supplierName }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="发货人:">
								{{ formInline.supplierSenderName }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="手机号:">
								{{ formInline.supplierPhone }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="发货地址:">
								{{ formInline.supplierAddress }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品信息</span>
			</div>
			<div class="texts item">
				<div class="goodsInfo">
					<div class="info_item itemClick" @click="gotoGoodsDetail">
						<!-- <div class="demo-image">
							<div class="block">
								<el-image
									style="width: 100px; height: 100px;margin-right: 10px;"
									:src="formInline.orderDetail.itemCover"
									fit="fill"
								></el-image>
							</div>
						</div> -->
						<div class="goods_img">
							<img
								style="width: 100%; height: 100%"
								v-if="isShowImg"
								:src="formInline.orderDetail.itemCover"
								alt=""
							/>
							<span v-else>加载失败</span>
						</div>
						<div style="flex:1">
							<p>商品名称：{{ formInline.orderDetail.itemName }}</p>
							<p>规格：{{ formInline.orderDetail.skuName }}</p>
						</div>
					</div>
					<div class="info_item">
						<p>售价（元）：{{ formInline.orderDetail.price }}元</p>
					</div>
					<div class="info_item">
						<p>购买数量：{{ formInline.orderDetail.amount }}</p>
					</div>
					<div class="info_item" v-if="formInline.orderDetail.actPrice">
						<p>活动价格（元）：{{ formInline.orderDetail.actPrice }}元</p>
					</div>
					<div class="info_item">
						<p>小计：{{ formInline.orderDetail.totalPrice }}元</p>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>费用信息</span>
			</div>
			<div class="texts item">
				<el-form class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="商品合计:">
								{{ formInline.itemTotalPrice }}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="运费:" v-if="formInline.fare">
								{{ formInline.fare || 0 }}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="运费规则:">{{ formInline.fareRule }}</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="优惠券:" v-if="formInline.couponDeductAmount">
								{{ formInline.couponDeductAmount }}元
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="活动:" v-if="formInline.actType">
								{{ formInline.actType == 'TIME' ? '限时抢购' : '' }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="活动优惠:">
								{{
									formInline.type === 'PROMOTION'
										? `${formInline.orderDetail.price -
												formInline.orderDetail.actPrice}`
										: 0
								}}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="订单合计:">
								{{ formInline.orderTotalPrice }}元
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="实际支付金额:">
								{{ formInline.payPrice }}元
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card" v-if="formInline.orderRefund || formInline.orderReturn">
			<div slot="header" class="clearfix">
				<span>售后信息</span>
			</div>
			<div class="texts item" v-if="!formInline.orderReturn">
				<el-form class="demo-form-inline">
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="退款操作时间">
								{{ parseTime(formInline.orderRefund.createTime) }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="退款操作人">
								{{ formInline.orderRefund.handler }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="退款方式">
								{{
									formInline.orderRefund.linkType === 'ORDER_REFUND'
										? '系统手动退款'
										: ''
								}}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="确认退款金额">
								{{ formInline.orderRefund.actualRefundAmount }}元
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-form-item label="备注">
								{{ formInline.orderRefund.remark }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div class="texts item" v-else>
				<el-form class="demo-form-inline">
					<div class="content">
						<div class="orderReturn">
							<el-form-item label="售后编号:">
								<span class="orderReturn_num" @click="gotoPage">
									{{ formInline.orderReturn.num }}
								</span>
								<!-- <router-link
									tag="a"
									:to="{
										path: '/afterSalesManagement/refundDetail',
										query: { id: formInline.orderReturn.id },
									}"
								>
									{{ formInline.orderReturn.num }}
								</router-link> -->
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.handlingTime">
							<el-form-item label="售后处理时间:">
								{{ parseTime(formInline.orderReturn.handlingTime) }}
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.handler">
							<el-form-item label="售后处理人:">
								{{ formInline.orderReturn.handler }}
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.afterTypeName">
							<el-form-item label="退款方式:">
								{{ formInline.orderReturn.afterTypeName }}
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.afterReason">
							<el-form-item label="退款原因:">
								{{ formInline.orderReturn.afterReason }}
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.itemTotalPrice">
							<el-form-item label="申请退款金额:">
								{{ formInline.orderReturn.itemTotalPrice }}元
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.actualRefundAmount">
							<el-form-item label="确认退款金额:">
								{{ formInline.orderReturn.actualRefundAmount }}元
							</el-form-item>
						</div>
						<div class="orderReturn" v-if="formInline.orderReturn.remark">
							<el-form-item label="备注:">
								{{ formInline.orderReturn.remark }}
							</el-form-item>
						</div>
					</div>
				</el-form>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>操作记录</span>
			</div>
			<div class="texts item">
				<el-table :data="orderLogList" style="width: 100%">
					<el-table-column prop="operator" label="操作者"></el-table-column>
					<el-table-column prop="createTime" label="操作时间">
						<template slot-scope="scope">
							{{ parseTime(scope.row.createTime) }}
						</template>
					</el-table-column>
					<el-table-column prop="extra" label="操作内容">
						<template slot-scope="scope">
							{{ scope.row.title }}{{ scope.row.extra ? `(${scope.row.extra})` : '' }}
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-card>
		<el-dialog title="订单跟踪" :visible.sync="dialogVisible" width="30%">
			<el-timeline>
				<el-timeline-item
					v-for="item in formInline.orderLogList"
					:key="item.id"
					size="large"
				>
					<div>{{ parseTime(item.createTime) }}</div>
					<h4 style="margin: 10px 0">{{ item.title }}</h4>
					<div>{{ item.extra }}</div>
				</el-timeline-item>
			</el-timeline>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleClose">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 发货 -->
		<el-dialog title="发货" :visible.sync="sendExpressVisible" center width="30%">
			<el-form
				:model="sendExpressForm"
				label-position="top"
				:rules="rules"
				ref="sendExpressForm"
				class="demo-ruleForm sendExpressForm"
			>
				<el-form-item label="物流公司" prop="expressCompany">
					<el-select v-model.trim="sendExpressForm.expressCompany" placeholder="请选择">
						<el-option
							v-for="item in logistiCsompany"
							:key="item.code"
							:label="item.name"
							:value="item.name"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号" prop="expressNumber">
					<el-input
						v-model.trim="sendExpressForm.expressNumber"
						placeholder="请输入物流单号"
						maxlength="20"
					/>
				</el-form-item>
				<el-form-item label="发货供应商" style="padding:0">
					<p>{{ formInline.supplierName }}</p>
				</el-form-item>
				<el-form-item label="发货地址" style="padding:0">
					<p>发货人：{{ formInline.supplierSenderName }}</p>
					<p>联系方式：{{ formInline.supplierPhone }}</p>
					<p>发货地址：{{ formInline.supplierAddress }}</p>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="sendExpressBtu('sendExpressForm')">
					确认发货
				</el-button>
			</div>
		</el-dialog>
		<!-- 退款 -->
		<el-dialog title="退款" :visible.sync="refundVisible" center width="100px">
			<el-form
				:model="refundForm"
				:rules="refundRules"
				ref="refundForm"
				class="demo-ruleForm refundForm"
				label-position="left"
				style="padding:0 50px"
			>
				<el-form-item label="买家订单合计金额：">
					¥{{ refundForm.orderTotalPrice }}
				</el-form-item>
				<el-form-item label="金额组成：" label-width="100px">
					<p>运费：￥{{ refundForm.fare || 0 }}.00</p>
					<p>商品合计：￥{{ refundForm.itemTotalPrice || 0 }}.00</p>
					<p>优惠券：￥{{ refundForm.couponDeductAmount || 0 }}.00（满50减10）</p>
				</el-form-item>
				<el-form-item label="备注：" prop="remark">
					<el-input
						type="textarea"
						v-model.trim="refundForm.remark"
						placeholder="请输入备注"
						maxlength="500"
					/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="onClickRefundBtu('refundForm')">
					确认退款
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { orderDetail, orderClose, sendExpress, refund } from '@/api/order'
import { parseTime } from '@/utils'
import { logistiCsompany } from '@/utils/logisticsCompany'
import Table from '@/components/Table/index'
import { Message } from 'element-ui'
export default {
	components: {
		Table,
	},
	data() {
		const validatorExpressNumber = (rule, value, callback) => {
			if (!/^[A-Za-z0-9]{3,20}$/.test(value)) {
				return callback(new Error('请输入正确的物流单号'))
			} else if (this.sendExpressForm.expressNumber === '') {
				return callback(new Error('请输入物流单号'))
			} else {
				callback()
			}
		}
		return {
			showSupplier: false,
			dialogVisible: false,
			active: null,
			sendExpressVisible: false,
			sendExpressForm: {},
			logistiCsompany: logistiCsompany,
			refundVisible: false,
			refundForm: {
				id: null,
				remark: '', // 备注
				orderTotalPrice: null, // 订单合计金额
				fare: null, // 运费
				itemTotalPrice: null, // 商品总价
				couponDeductAmount: null, // 优惠券抵扣价
			},
			rules: {
				expressCompany: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
				expressNumber: [
					{ validator: validatorExpressNumber, required: true, trigger: 'blur' },
				],
			},
			refundRules: {
				remark: [{ required: true, trigger: 'blur', message: '请输入备注' }],
			},
			formInline: {
				orderDetail: {},
			},
			orderLogList: [],
			orderStatus: [
				{ id: 1, title: '提交订单', time: null, status: 'SUBMIT' },
				{ id: 2, title: '支付成功', time: null, status: 'PAY_SUCCESS' },
				{ id: 3, title: '平台发货', time: null, status: 'PLATFORM_SEND' },
				{ id: 4, title: '确认收货', time: null, status: 'CONFIRM_RECEIVE' },
				{ id: 5, title: '完成评价', time: null, status: '' },
			],
			id: this.$route.query.id || null,
			refund: false,
			showBuyTime: false,
			type: this.$route.query.type || null,
			column: [
				{ prop: 'operator', label: '操作者' },
				{
					prop: 'createTime',
					label: '操作时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{
					prop: 'title',
					label: '操作内容',
				},
			],
			isShowImg: false,
			btuVisible: false,
		}
	},
	computed: {
		status() {
			switch (this.formInline.status) {
				case 'UN_PAY':
					return '待付款'
					break
				case 'WAIT_SHIP':
					return '待发货'
					break
				case 'SHIPPED':
					return '已发货'
					break
				case 'DONE':
					return '已完成'
					break
				case 'CANCEL':
					return '已取消'
					break
				case 'CLOSE':
					return '已关闭'
					break
				case 'AFTER_SALE':
					return '售后处理'
				default:
					return ''
			}
		},
		// activeStep: function() {
		//   if (this.formInline.orderLogList && this.formInline.orderLogList.length) {
		//     this.formInline.orderLogList.forEach(item => {
		//       console.log(item.type);
		//     });
		//     return (this.active = 1);
		//   }
		// }
	},
	mounted() {
		if (this.type === '  ' && this.type === 'AFTER_SALE') {
			this.refund = true
		}
		this.getDetail()
	},
	methods: {
		// 关闭订单
		closeOrder() {
			this.$confirm('确定关闭该订单吗?', '提示', {
				type: 'warning',
			}).then(() => {
				orderClose({ id: this.id }).then(res => {
					if (res.success) {
						this.$message({
							type: 'success',
							message: '关闭成功!',
						})
						this.getDetail()
					}
				})
			})
		},
		// 发货
		sendExpressBtu(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)',
					})
					sendExpress({
						id: this.id,
						expressCompany: this.sendExpressForm.expressCompany,
						expressNumber: this.sendExpressForm.expressNumber,
					}).then(res => {
						if (res.success) {
							setTimeout(() => {
								loading.close()
								Message.success('发货成功！！')
								this.getDetail()
								this.sendExpressVisible = false
							}, 300)
						} else {
							setTimeout(() => {
								loading.close()
								Message.error(res.msg)
							}, 300)
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 退款
		onClickRefundBtu(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)',
					})
					refund({ id: this.refundForm.id, remark: this.refundForm.remark }).then(res => {
						if (res.success) {
							setTimeout(() => {
								loading.close()
								Message.success('退款成功！！！')
								this.refundVisible = false
								this.getDetail()
							}, 300)
						} else {
							setTimeout(() => {
								loading.close()
								Message.error(res.msg)
							}, 300)
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		handleClose() {
			this.dialogVisible = false
		},
		parseTime(time) {
			return parseTime(time)
		},
		orderType(type) {
			if (type === 'NORMAL') {
				return '普通'
			} else {
				return '活动订单'
			}
		},
		next() {
			if (this.active++ > 4) this.active = 0
		},

		getDetail() {
			orderDetail({ id: this.id }).then(res => {
				// console.log(res)
				if (res.success) {
					this.formInline = res.data
					this.refundForm = {
						id: res.data.id,
						orderTotalPrice: res.data.orderTotalPrice, // 订单合计金额
						fare: res.data.fare, // 运费
						itemTotalPrice: res.data.itemTotalPrice, // 商品总价
						couponDeductAmount: res.data.couponDeductAmount, // 优惠券抵扣价
					}
					const orderLogList = res.data.orderLogList.reverse()
					orderLogList.forEach((item, itemIndex) => {
						if (item.type === 'PLATFORM_SEND') {
							this.showSupplier = true
						}
						if (item.operator !== '用户') {
							this.orderLogList.push(item)
							this.orderLogList.reverse()
						}
						this.orderStatus.forEach((element, index) => {
							if (element.status === item.type) {
								element.time = item.createTime
								this.active = orderLogList.length
							} else if (item.type === 'CANCEL' && itemIndex === index) {
								element.title = item.title
								element.time = item.createTime
								this.active = orderLogList.length
							} else if (item.type === 'CLOSE' && itemIndex === index) {
								element.title = item.title
								element.time = item.createTime
								this.active = orderLogList.length
							}
						})
					})

					if (this.formInline.orderLogList && this.formInline.orderLogList.length) {
						this.formInline.orderLogList.reverse()
					}
					const images = res.data.orderDetail.itemCover.split('.')
					if (
						images[images.length - 1] === 'jpg' ||
						images[images.length - 1] === 'png'
					) {
						this.isShowImg = true
					}
					if (res.data.orderRefund === null) {
						this.btuVisible = true
					} else {
						this.btuVisible = false
					}
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		// 跳转到商品详情页面
		gotoGoodsDetail() {
			this.$router.push({
				path: '/goodsManage/goodsList/goodsDetail',
				query: { id: this.formInline.orderDetail.itemId },
			})
		},
		// 跳转到售后相关页面
		gotoPage() {
			if (this.formInline.orderReturn.status === 'WAIT_DISPOSE') {
				this.$router.push({
					path: '/afterSalesManagement/refundPage',
					query: { id: this.formInline.orderReturn.id },
				})
			} else {
				this.$router.push({
					path: '/afterSalesManagement/refundDetail',
					query: { id: this.formInline.orderReturn.id },
				})
			}
		},
	},
}
</script>

<style lang="scss">
.order_detail {
	padding: 20px;
}
.state {
	border: 1px solid #ccc;
	margin: 20px 0;
	padding: 10px 0;
	.content {
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.order_state {
			line-height: 35px;
			.status_text {
				font-size: 14px;
			}
		}
	}

	.btn {
		float: right;
	}
}
.texts {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}
.box-card {
	margin-bottom: 20px;
}
.demo-form-inline {
	width: 100%;
}
.track {
	min-height: 300px;
}
.goodsInfo {
	display: flex;
	align-items: center;
	// justify-content: space-around;
	flex-wrap: wrap;
	.info_item {
		flex: 1;
		margin-right: 10px;
		display: flex;
		.goods_img {
			width: 100px;
			height: 100px;
			text-align: center;
			line-height: 100px;
			background: #f5f7fa;
			color: #c0c4cc;
			margin-right: 10px;
		}
	}
	.itemClick {
		cursor: pointer;
		color: blue;
	}
	.itemClick:hover {
		color: red;
	}
}
.sendExpressForm {
	p {
		margin: 0;
	}
	.el-form-item__label {
		line-height: unset;
	}
}
.refundForm {
	p {
		margin: 0;
	}
}
a {
	color: blue;
}
a:hover {
	color: red;
}
.content {
	display: flex;
	flex-wrap: wrap;
	.orderReturn {
		width: 24%;
		margin-right: 10px;
		.el-form-item {
			display: flex;
			.orderReturn_num {
				cursor: pointer;
				color: blue;
			}
			.orderReturn_num:hover {
				color: red;
			}
		}
	}
}
</style>
