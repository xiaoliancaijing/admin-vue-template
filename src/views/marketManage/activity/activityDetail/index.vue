<!--
 * @Author: peng.wan
 * @Date: 2020-06-19 16:11:32
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-28 11:46:05
 * @Descripttion: 
-->
<template>
	<div class="activityDetail">
		<h4>活动信息</h4>
		<el-row :gutter="12">
			<el-col :span="8">
				<el-card shadow="hover">
					<h3>活动标题：{{ activityInfo.title }}</h3>
					<div>
						<el-tooltip
							class="item itemName"
							effect="dark"
							:content="activityInfo.description"
							placement="top"
						>
							<p>活动描述：{{ activityInfo.description }}</p>
						</el-tooltip>
						<p>活动类型：{{ `限时抢购` }}</p>
						<p>活动时间：{{ rushBeginTime }} 至 {{ rushEndTime }}</p>
					</div>
				</el-card>
			</el-col>

			<el-col :span="16">
				<el-card shadow="hover">
					<h3>统计</h3>
					<div class="data_info">
						<p>商品销售量：￥{{ statisticsInfo.saleAmount }}</p>
						<p>活动参与人数：{{ statisticsInfo.purchaseNum }}</p>
						<p>订单量：{{ statisticsInfo.orderNum }}单</p>
						<p>活动订单合计金额：￥{{ statisticsInfo.actuallyAmount }}</p>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="商品活动明细" name="item">
				<Table :column="column" :loadData="getItemList" :params="{ id: id }">
					<template v-slot:itemSkuImage="{ scope }">
						<el-image
							:src="scope.itemSkuImage"
							class="admin_avater"
							:preview-src-list="[scope.itemSkuImage]"
						/>
					</template>
				</Table>
			</el-tab-pane>

			<el-tab-pane label="订单明细" name="order">
				<el-form
					:inline="true"
					:model="formInline"
					ref="formInline"
					class="demo-form-inline"
				>
					<el-form-item label prop="orderNum">
						<el-input
							v-model.trim="formInline.orderNum"
							placeholder="请输入订单编号"
							size="small"
							prefix-icon="el-icon-search"
						></el-input>
					</el-form-item>
					<el-form-item label prop="phone">
						<el-input
							v-model.trim="formInline.phone"
							placeholder="请输入手机号"
							size="small"
							prefix-icon="el-icon-search"
						></el-input>
					</el-form-item>
					<el-form-item label="下单时间" prop="dateValue">
						<el-date-picker
							v-model.trim="formInline.dateValue"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							@change="onChangeTime"
							:default-time="['00:00:00', '23:59:59']"
							value-format="timestamp"
							size="small"
						></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="onClickSearch">
							查询
						</el-button>
						<el-button type="primary" size="small" @click="resetForm('formInline')">
							重置
						</el-button>
					</el-form-item>
				</el-form>
				<Table
					:column="columnOrder"
					:loadData="getOrderList"
					:params="{ id: id }"
					ref="refOrderList"
				/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getActivityInfo, getStatistics, getOrders, getItems } from '@/api/activity'
import { parseTime } from '@/utils'
export default {
	name: 'activityDetail',
	components: {
		Table,
	},
	data() {
		return {
			activeName: 'item',
			formInline: {
				search: null,
				startTime: null,
				endTime: null,
			},
			column: [
				{
					prop: 'itemSkuImage',
					label: '商品规格展示图',
					render: true,
				},
				{ prop: 'itemSkuName', label: '商品名称' },
				{ prop: 'properties', label: '规格' },
				{ prop: 'skuRushPrice', label: '抢购价' },
				{ prop: 'skuPrice', label: '未划线价' },
				{
					prop: 'inventoryActNum',
					label: '活动库存',
					formatter: row => {
						return `${row.inventoryNum}/${row.inventoryActNum}`
					},
				},
				{
					prop: 'limitNum',
					label: '每人限购数量',
					formatter: row => {
						if (row.limitNum === -1) {
							return '不限购'
						} else {
							return row.limitNum
						}
					},
				},
				{ prop: 'orderCount', label: '订单量' },
				{
					prop: 'purchaseNum',
					label: '实际购买人数',
				},
				{
					prop: 'saleAmount',
					label: '累计销售额（实付）',
					formatter: row => {
						return `￥${row.saleAmount}`
					},
				},
			],
			columnOrder: [
				{
					prop: 'createTime',
					label: '下单时间',
					formatter: row => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'orderNum', label: '订单编号' },
				{ prop: 'nickName', label: '会员昵称' },
				{ prop: 'receiverName', label: '收货人' },
				{ prop: 'receiverPhone', label: '收货人手机号' },
				{ prop: 'itemName', label: '商品名称' },
				{
					prop: 'itemPrice',
					label: '商品售价',
					formatter: row => {
						return `￥${row.itemPrice}`
					},
				},
				{ prop: 'itemNum', label: '数量' },
				{
					prop: 'itemTotalPrice',
					label: '商品合计',
					formatter: row => {
						return `￥${row.itemTotalPrice}`
					},
				},
				{
					prop: 'totalDeductAmount',
					label: '优惠金额',
					formatter: row => {
						return `￥${row.totalDeductAmount}`
					},
				},
				{
					prop: 'fare',
					label: '运费',
					formatter: row => {
						return `￥${row.fare}`
					},
				},
				{
					prop: 'orderTotalPrice',
					label: '订单合计',
					formatter: row => {
						return `￥${row.orderTotalPrice}`
					},
				},
				{
					prop: 'payPrice',
					label: '实际支付金额',
					formatter: row => {
						return `￥${row.payPrice}`
					},
				},
				{
					prop: 'source',
					label: '订单来源',
					formatter: row => {
						if (row.source === 'MINI') {
							return '小程序'
						} else {
							return 'APP'
						}
					},
				},
			],
			id: this.$route.query.id || null,
			activityInfo: {},
			statisticsInfo: {},
			rushBeginTime: '',
			rushEndTime: '',
			limitNum: '',
		}
	},
	computed: {
		getOrderList() {
			return getOrders
		},
		getItemList() {
			return getItems
		},
	},
	mounted() {
		if (this.id) {
			getActivityInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.activityInfo = res.data
					this.rushBeginTime = parseTime(res.data.rushBeginTime)
					this.rushEndTime = parseTime(res.data.rushEndTime)
					if (res.data.limitNum != -1) {
						this.limitNum = res.data.limitNum
					} else {
						this.limitNum = '不限制'
					}
				}
			})
			getStatistics({ id: this.id }).then(res => {
				if (res.success) {
					this.statisticsInfo = res.data
				}
			})
		}
	},
	methods: {
		onChangeTime(value) {
			console.log(value)
			if (value) {
				this.formInline.startTime = value[0]
				this.formInline.endTime = value[1]
			} else {
				this.formInline.startTime = null
				this.formInline.endTime = null
			}
		},
		handleClick(val) {
			console.log(val)
		},
		// 查询
		onClickSearch() {
			this.$refs.refOrderList.update({ ...this.formInline })
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.$refs.refOrderList.reset()
		},
	},
}
</script>

<style lang="scss" scoped>
.activityDetail {
	padding: 20px;
	.admin_avater {
		height: 50px;
		width: 80px;
	}
}

.demo-form-inline {
	margin-top: 20px;
}

.itemName {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
</style>
