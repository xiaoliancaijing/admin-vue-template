<!--
 * @Author: tianhao
 * @Date: 2020-06-16 15:22:52
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-08 18:22:31
 * @Descripttion: 
-->
<template>
	<div class="waitDelivered">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="搜索条件：">
				<el-input
					placeholder="请输入订单编号"
					size="small"
					prefix-icon="el-icon-search"
					v-model.trim="formInline.orderNum"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-input
					placeholder="请输入手机号"
					size="small"
					prefix-icon="el-icon-search"
					v-model.trim="formInline.phone"
				></el-input>
			</el-form-item>
			<el-form-item label="下单时间：">
				<el-date-picker
					v-model.trim="formInline.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					size="small"
				></el-date-picker>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" size="small" @click="search">查询</el-button>
				<div class="exportBtn" v-if="btn">
					<el-button type="primary" size="small" @click="exportInvoice">
						导入发货单
					</el-button>
					<el-button type="primary" size="small" @click="exportOrder">导出订单</el-button>
				</div>
			</el-form-item>
		</el-form>
		<Table
			:loadData="getList"
			:column="column"
			ref="orderList"
			:params="{ status: name }"
		></Table>
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
				<el-form-item label="发货供应商">
					<p>{{ sendExpressForm.supplierName }}</p>
				</el-form-item>
				<el-form-item label="发货地址">
					<p>发货人：{{ sendExpressForm.supplierSenderName }}</p>
					<p>联系方式：{{ sendExpressForm.supplierPhone }}</p>
					<p>发货地址：{{ sendExpressForm.supplierAddress }}</p>
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
		<!-- 导入发货单 -->
		<el-dialog
			title="导入发货单"
			:visible.sync="invoiceVisible"
			v-if="invoiceVisible"
			center
			width="100px"
		>
			<el-form
				ref="newUploadForm"
				:model="newUploadForm"
				:rules="formRules"
				label-width="140px"
				class="newUploadForm"
			>
				<el-form-item label="请上传文件" prop="fileName">
					<el-input
						v-model="newUploadForm.fileName"
						:readonly="true"
						style="width:300px"
						placeholder="文件名"
						size="small"
					></el-input>
					<template>
						<el-upload
							class="upload-demo"
							ref="upload"
							action="doUpload"
							:limit="1"
							:file-list="fileList"
							:before-upload="beforeUpload"
						>
							<el-button slot="trigger" type="primary" size="small">
								选取文件
							</el-button>
							<!-- <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过100MB</div>
              <div slot="tip" class="el-upload-list__item-name">{{fileName}}</div>-->
						</el-upload>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="onClickUploae('refundForm')">
					确认上传
				</el-button>
			</div>
		</el-dialog>
		<!-- 导入的发货单表格 -->
		<el-dialog title="导入的发货单" :visible.sync="tableVisible" center width="1500px">
			<p style="color:red;text-align: center;margin-bottom:20px">
				<span v-if="postResultInfo.failCount">
					共{{ postResultInfo.totalCount }}条数据，共计{{
						postResultInfo.failCount
					}}条信息有误或缺失，均以标红显示
				</span>
				<span v-else style="color:#70B603">
					无错误信息，已导入{{ postResultInfo.successCount }}条数据并发货
				</span>
			</p>
			<el-table
				:data="tableData"
				border
				style="width: 100%;height: 520px;overflow-y: auto;overflow-x: auto;"
			>
				<el-table-column
					v-for="item in invoiceColumn"
					:key="item.prop"
					:prop="item.prop"
					:label="item.label"
				></el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button
					v-if="postResultInfo.failCount"
					type="danger"
					@click="onClickBtu('refundForm')"
				>
					导出出错订单
				</el-button>
				<el-button v-else type="primary" @click="tableVisible == false">确定</el-button>
				<p
					v-if="postResultInfo.failCount"
					style="color:#70B603;text-align: center;margin-top:10px"
				>
					已导入{{ postResultInfo.successCount }}条数据
				</p>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'
import { logistiCsompany } from '@/utils/logisticsCompany'
import { startEndTime } from '@/core/directives/time'
import {
	getOrderList,
	orderClose,
	sendExpress,
	exportUnShippedOrder,
	importShipped,
	refund,
} from '@/api/order'
import { Message } from 'element-ui'
export default {
	components: {
		Table,
	},
	props: {
		btn: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
		},
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
			formInline: {
				phone: '',
				time: '',
				status: '',

				orderNum: '',
			},
			sendExpressVisible: false,
			refundVisible: false,
			sendExpressForm: {},
			rules: {
				expressCompany: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
				expressNumber: [
					{ validator: validatorExpressNumber, required: true, trigger: 'blur' },
				],
			},
			refundRules: {
				remark: [{ required: true, trigger: 'blur', message: '请输入备注' }],
			},
			formRules: {
				fileName: [{ required: true, trigger: 'blur', message: '请选择上传文件' }],
			},
			logistiCsompany: logistiCsompany,
			optionSupplier: [],
			column: [
				{
					prop: 'createTime',
					label: '下单时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'orderNum', label: '订单编号' },
				{ prop: 'receiverName', label: '收货人' },
				{ prop: 'receiverPhone', label: '收货人手机号' },
				{
					prop: 'itemPrice',
					label: '商品售价',
					formatter: (row, column) => {
						return `${row.itemPrice}元`
					},
				},
				{ prop: 'amount', label: '数量' },
				{
					prop: 'payPrice',
					label: '实付',
					formatter: (row, column) => {
						return `${row.payPrice}元`
					},
				},
				{
					prop: 'status',
					label: '订单状态',
					formatter: (row, column) => {
						switch (row.status) {
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
				},

				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: '详情',
							method: val => {
								this.$router.push({
									path: '/order/detail',
									query: { id: val.id, type: val.status },
								})
							},
						},
						{
							name: val => {
								if (val.status === 'UN_PAY') {
									return '关闭订单'
								}
							},
							method: val => {
								this.$confirm('确定关闭该订单吗?', '提示', {
									type: 'warning',
								}).then(() => {
									orderClose({ id: val.id }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '关闭成功!',
											})
											this.reset()
										}
									})
								})
							},
						},
						{
							name: val => {
								if (!val.afterFlag && val.status === 'WAIT_SHIP') {
									return '发货'
								}
							},
							method: val => {
								this.sendExpressVisible = true
								this.sendExpressForm = { ...val }
							},
						},
						{
							name: val => {
								if (!val.afterFlag && val.status === 'WAIT_SHIP') {
									return '退款'
								}
							},
							method: val => {
								this.refundVisible = true
								this.refundForm = { ...val }
							},
						},
					],
				},
			],
			refundForm: { id: null, remark: '' },
			invoiceVisible: false,
			newUploadForm: { fileName: '' },
			fileList: [],
			fileName: '',
			tableVisible: false,
			invoiceColumn: [
				{
					prop: 'createTime',
					label: '下单时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'orderNum', label: '订单编号' },
				{ prop: 'userName', label: '收货人' },
				{ prop: 'receiverPhone', label: '收货人手机号' },
				{ prop: 'receiverAddress', label: '收货人地址' },
				{ prop: 'supplierName', label: '供应商' },
				{ prop: 'itemName', label: '商品名称' },
				{ prop: 'amount', label: '购买数量' },
				{ prop: 'price', label: '商品售价' },
				{ prop: 'supplierName', label: '优惠金额' },
				{ prop: 'itemTotalPrice', label: '商品合计' },
				{ prop: 'fare', label: '运费' },
				{ prop: 'orderTotalPrice', label: '订单合计' },
				{ prop: 'expressCompany', label: '物流公司' },
				{ prop: 'expressNumber', label: '快递单号' },
			],
			tableData: [],
			files: null,
			postResultInfo: {},
		}
	},
	created() {
		console.log('收到的name', this.name)
		if (!this.name) {
			this.formInline.status = ''
		}
		this.formInline.status = this.name
	},
	computed: {
		getList() {
			return getOrderList
		},
	},
	methods: {
		getSupplierInfo() {
			this.getList()
		},
		reset() {
			this.$refs.orderList.reset()
		},
		// 查询
		search() {
			let timeArray = startEndTime(this.formInline.time)
			if (timeArray && timeArray.length) {
				this.formInline.createTimeStart = timeArray[0]
				this.formInline.createTimeEnd = timeArray[1]
			}
			delete this.formInline.time
			this.$refs.orderList.update({ ...this.formInline })
		},
		onSubmit() {
			console.log('submit!')
		},
		// 发货
		sendExpressBtu(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					sendExpress({
						id: this.sendExpressForm.id,
						expressCompany: this.sendExpressForm.expressCompany,
						expressNumber: this.sendExpressForm.expressNumber,
					}).then(res => {
						if (res.success) {
							Message.success('发货成功！！')
							this.reset()
							this.sendExpressVisible = false
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
					refund({ id: this.refundForm.id, remark: this.refundForm.remark }).then(res => {
						if (res.success) {
							Message.success('退款成功！！！')
							this.refundVisible = false
							this.reset()
						}
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 上传前 文件校验
		beforeUpload(file) {
			this.files = file
			const extension = file.name.split('.')[1] === 'xls'
			const extension2 = file.name.split('.')[1] === 'xlsx'
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!extension && !extension2) {
				this.$message.warning('上传文件只能是 xls、xlsx格式!')
				return
			}
			// if (!isLt2M) {
			// 	this.$message.warning('上传文件大小不能超过 2MB!')
			// 	return
			// }
			this.newUploadForm.fileName = file.name
			console.log(this.newUploadForm.fileName)
			return false // 返回false不会自动上传
		},
		// 确认上传
		onClickUploae(formName) {
			this.$refs['newUploadForm'].validate(valid => {
				// 是否通过 表单验证
				console.log(this.newUploadForm.fileName)
				console.log(valid)

				if (valid) {
					if (this.newUploadForm.fileName == '') {
						this.$message({
							message: '请选择要上传的文件！',
							type: 'warning',
							showClose: true,
						})
						return false
					}

					let fileFormData = new FormData()
					fileFormData.append('file', this.files, this.newUploadForm.fileName) // 上传的文件
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)',
					})

					importShipped(fileFormData).then(res => {
						// 上传请求
						if (res.success) {
							setTimeout(() => {
								loading.close()
								Message.success(res.msg)
								this.invoiceVisible = false
								this.tableVisible = true
								this.tableData = res.data.failList
								this.postResultInfo = res.data
							}, 300)
						} else {
							setTimeout(() => {
								loading.close()
								Message.error(res.msg)
							}, 300)
						}
					})
					// .catch(err => {
					// 	this.newUploadForm.fileName = ''
					// 	console.log('err')
					// })
				} else {
					this.$message({
						type: 'warning',
						message: '新增条件有误！',
						showClose: true,
					})
				}
			})
		},
		// 导出发货单
		exportOrder() {
			let url = `${process.env.VUE_APP_BASE_API}/adminApi/order/export/unShipped`
			window.open(url)
		},
		exportInvoice() {
			this.invoiceVisible = true
		},
		// 导出错误订单
		onClickBtu() {
			console.log('导出错误订单')
			let url = `${process.env.VUE_APP_BASE_API}/adminApi/order/export/unShipped`
			window.open(url)
			this.tableVisible = false
		},
	},
}
</script>

<style lang="scss" scoped>
.exportBtn {
	display: inline;
	margin-left: 8px;
}
p {
	margin: 0;
}
.el-form--label-top .el-form-item__label {
	padding: 0;
}
.upload-demo {
	margin-left: 10px;
}
.newUploadForm {
	text-align: center;
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
</style>
