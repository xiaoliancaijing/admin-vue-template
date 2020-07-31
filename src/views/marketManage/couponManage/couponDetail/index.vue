<!--
 * @Author: peng.wan
 * @Date: 2020-06-29 20:01:34
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-07 17:00:54
 * @Descripttion: 
-->

<template>
	<div class="couponDetail">
		<h4>活动信息</h4>
		<el-row :gutter="12">
			<el-col :span="10">
				<el-card shadow="hover" class="box-card">
					<div slot="header" class="clearfix">
						<span>优惠券名称：{{ couponInfo.name }}</span>
						<span style="float: right">状态：{{ status }}</span>
					</div>
					<div>
						<p>
							<span>开始时间：{{ couponInfo.startTime }}</span>
							<span style="margin-left:20px">结束时间：{{ couponInfo.endTime }}</span>
						</p>
						<p>适用商品：{{ couponInfo.itemName }}</p>
						<!-- <p>类型：{{}}</p> -->
						<p>内容：{{ `满${couponInfo.fullPrice}减${couponInfo.subtractPrice}` }}</p>
						<!-- <p>领取方式：{{}}</p> -->
					</div>
				</el-card>
			</el-col>
			<el-col :span="14">
				<el-card shadow="hover" class="box-card">
					<div slot="header" class="clearfix">
						<span>统计</span>
					</div>
					<div>
						<p class="card_item">
							<span>剩余数量：{{ couponInfo.lastAmount }}</span>
							<span>已使用量：{{ statisticsInfo.useCount || 0 }}</span>
							<span>
								使用率：{{
									statisticsInfo.useCount / statisticsInfo.receiveCount || 0
								}}
							</span>
						</p>
						<p class="card_item">
							<span>持有人数：{{ statisticsInfo.holdUserCount || 0 }}</span>
							<!-- <span>活动订单合计金额：{{}}</span> -->
							<span>已优惠总额：{{ statisticsInfo.useTotalMoney || 0 }}</span>
						</p>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<!-- <el-form-item label prop="orderNum">
				<el-input
					v-model.trim="formInline.orderNum"
					placeholder="请输入优惠券编号"
					size="small"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item> -->
			<el-form-item label prop="nickName">
				<el-input
					v-model.trim="formInline.nickName"
					placeholder="请输入用户昵称"
					size="small"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<!-- <el-form-item label="状态" prop="status">
				<el-select v-model="formInline.status" placeholder="请选择状态">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<Table :column="column" :loadData="getList" :params="{ id: id }" ref="refOrderList" />
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getCouponInfo, getHoldDetailInfo, getStatisticsInfo } from '@/api/coupon'
import { parseTime } from '@/utils'
export default {
	name: 'couponDetail',
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				nickName: null,
				startTime: null,
				endTime: null,
			},
			options: [
				{ value: 1, label: '全部' },
				{ value: 2, label: '已使用' },
				{ value: 3, label: '已过期' },
				{ value: 4, label: '未使用' },
			],
			column: [
				{ prop: 'id', label: '序号' },
				{
					prop: 'createTime',
					label: '领取日期',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'userNickName', label: '领取会员昵称' },
				// { prop: 'nickName', label: '会员昵称' },
				{
					prop: 'status',
					label: '是否使用',
					formatter: (row, column) => {
						switch (row.status) {
							case 'UN_USE':
								return '未使用'
								break
							case 'USED':
								return '已使用'
								break
							case 'EXPIRED ':
								return '已过期 '
								break
							default:
								return ''
						}
					},
				},
				{ prop: 'orderId', label: '关联订单编号' },
			],
			id: this.$route.query.id || null,
			couponInfo: {},
			status: '',
			statisticsInfo: {},
		}
	},
	computed: {
		getList() {
			return getHoldDetailInfo
		},
	},
	mounted() {
		if (this.id) {
			// 获取优惠券信息
			getCouponInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.couponInfo = res.data
					if (res.data.startTime > new Date().getTime()) {
						this.status = '未开始'
					} else if (res.data.endTime < new Date().getTime()) {
						this.status = '已失效'
					} else {
						this.status = '进行中'
					}
					this.couponInfo.startTime = parseTime(res.data.startTime, '{y}-{m}-{d}')
					this.couponInfo.endTime = parseTime(res.data.endTime, '{y}-{m}-{d}')
				}
			})
			// 获取统计信息
			getStatisticsInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.statisticsInfo = res.data
				}
			})
		}
	},
	methods: {
		onChangeTime(value) {
			console.log(value)
			this.formInline.startTime = value[0]
			this.formInline.endTime = value[1]
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
.couponDetail {
	padding: 20px;
}
.text {
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
	width: 100%;
	height: 270px;
}
.card_item {
	display: flex;
	justify-content: space-between;
	span {
		flex: 1;
	}
}
</style>
