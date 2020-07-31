<!--
 * @Author: peng.wan
 * @Date: 2020-06-30 15:13:21
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-07 16:18:06
 * @Descripttion: 
-->
<template>
	<div class="refundList">
		<el-card :body-style="{ padding: '20px' }">
			<el-tabs v-model.trim="activeName" @tab-click="handleClick">
				<el-tab-pane label="未发货" name="WAIT_SHIP">
					<Table
						:column="column"
						name="WAIT_SHIP"
						:handleStates="unShippedStates"
						:isShowAfterType="false"
						v-if="activeName == 'WAIT_SHIP'"
					/>
				</el-tab-pane>
				<el-tab-pane label="已发货" name="SHIPPED">
					<Table
						:column="shippedColumn"
						:handleStates="states"
						name="SHIPPED"
						:isShowAfterType="true"
						v-if="activeName == 'SHIPPED'"
					/>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import Table from './refundTable'
import { Message } from 'element-ui'
import { parseTime } from '@/utils'
export default {
	name: 'refundList',
	components: {
		Table,
	},
	data() {
		return {
			activeName: 'WAIT_SHIP',
			states: [
				{ value: 'WAIT_DISPOSE', label: '待处理' },
				{ value: 'FINISHED', label: '售后完成' },
				{ value: 'REJECT', label: '售后驳回' },
				{ value: 'USER_PROCESSED', label: '已填写物流信息' },
				{ value: 'WAIT_USER_DISPOSE', label: '等待用户填写物流信息' },
				{ value: 'CANCEL', label: '已取消' },
			],
			unShippedStates: [
				{ label: '待处理', value: 'WAIT_DISPOSE' },
				{ label: '售后完成', value: 'FINISHED' },
				{ label: '售后驳回', value: 'REJECT' },
				{ label: '已取消', value: 'CANCEL' },
			],
			column: [
				{
					prop: 'createTime',
					label: '申请时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'orderNum', label: '订单编号' },
				{ prop: 'nickName', label: '会员昵称' },
				{ prop: 'itemTotalPrice', label: '退款金额' },
				{ prop: 'fare', label: '运费' },
				{ prop: 'afterReason', label: '退款原因' },
				{
					prop: 'handlingTime',
					label: '处理时间',
					formatter: (row, column) => {
						return parseTime(row.handlingTime)
					},
				},
				{ prop: 'num', label: '售后编号' },
				{
					prop: 'statusName',
					label: '处理状态',
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.status != 'WAIT_DISPOSE') {
									return '详情'
								}
							},
							method: val => {
								this.$router.push({ path: 'refundDetail', query: { id: val.id } })
							},
						},
						{
							name: val => {
								if (val.status === 'WAIT_DISPOSE') {
									return '去处理'
								}
							},
							method: val => {
								this.$router.push({ path: 'refundPage', query: { id: val.id } })
							},
						},
					],
				},
			],
			shippedColumn: [
				{
					prop: 'createTime',
					label: '申请时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'orderNum', label: '订单编号' },
				{ prop: 'nickName', label: '会员昵称' },
				{ prop: 'itemTotalPrice', label: '退款金额' },
				{ prop: 'fare', label: '运费' },
				{
					prop: 'afterTypeName',
					label: '退款方式',
				},
				{ prop: 'afterReason', label: '退款原因' },
				{
					prop: 'handlingTime',
					label: '处理时间',
					formatter: (row, column) => {
						return parseTime(row.handlingTime)
					},
				},
				{ prop: 'num', label: '售后编号' },
				{
					prop: 'statusName',
					label: '处理状态',
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: val => {
								if (
									val.status != 'WAIT_DISPOSE' &&
									val.status !== 'USER_PROCESSED'
								) {
									return '详情'
								}
							},
							method: val => {
								this.$router.push({ path: 'refundDetail', query: { id: val.id } })
							},
						},
						{
							name: val => {
								if (
									val.status === 'WAIT_DISPOSE' ||
									val.status === 'USER_PROCESSED'
								) {
									return '去处理'
								}
							},
							method: val => {
								this.$router.push({ path: 'refundPage', query: { id: val.id } })
							},
						},
					],
				},
			],
		}
	},
	methods: {
		handleClick() {},
	},
}
</script>

<style lang="scss" scoped></style>
