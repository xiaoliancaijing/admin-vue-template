<!--
 * @Author: peng.wan
 * @Date: 2020-06-18 18:56:09
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-13 18:31:04
 * @Descripttion: 
-->
<!--
 * @Author: peng.wan
 * @Date: 2020-06-18 18:52:13
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-06-22 16:02:18
 * @Descripttion: 
-->
<template>
	<div class="couponManage">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="优惠券名称" prop="name">
				<el-input
					v-model.trim="formInline.name"
					size="small"
					placeholder="优惠券名称"
				></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model.trim="formInline.status" placeholder="请选择状态" size="small">
					<el-option
						v-for="item in status"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<!-- <el-form-item label="领取方式">
				<el-select v-model.trim="formInline.banned" placeholder="领取方式" size="small">
					<el-option
						v-for="item in banneds"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
      </el-form-item>-->
			<el-form-item>
				<el-button size="small" type="primary" @click="onClickSearch">查询</el-button>
				<el-button size="small" type="primary" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			新建
		</el-button>
		<Table :loadData="getList" :column="column" ref="couponList" :params="{ status: 'ALL' }">
			<template v-slot:itemImg="{ scope }">
				<el-image
					:src="scope.itemImg"
					class="admin_avater"
					:preview-src-list="[scope.itemImg]"
				/>
			</template>
			<template v-slot:banned="{ scope }">
				<el-switch
					v-model.trim="scope.banned"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					:disabled="scope.endTime < new Date().getTime() ? true : false"
					@change="ban(scope.id)"
				></el-switch>
			</template>
		</Table>
		<el-dialog
			title="分享优惠券"
			:visible.sync="shareVisilbe"
			:before-close="() => (shareVisilbe = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle shareCoupon"
			width="500px"
		>
			<div>{{ baseUrl }}index/index?id={{ coupon }}</div>
			<el-button @click="copyShare" size="small" type="primary">复制链接</el-button>
			<div>
				复制该链接后，发送给微信好友，即可让其领取优惠券，建议在分享优惠券链接时，自行添加优惠券话术
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getCouponList, banState } from '@/api/coupon'
import { parseTime, copyToClip } from '@/utils'
import { Message } from 'element-ui'
export default {
	name: 'couponManage',
	components: {
		Table,
	},
	data() {
		return {
			baseUrl: process.env.VUE_APP_H5_API,
			shareVisilbe: false,
			coupon: '',
			formInline: {
				name: '',
				status: 'ALL',
				// banned: '',
			},
			disabledStatus: false,
			status: [
				{ value: 'ALL', label: '全部' },
				{ value: 'UN_START', label: '未开始' },
				{ value: 'ING', label: '进行中' },
				{ value: 'END', label: '已结束' },
			],
			banneds: [
				{ value: 1, label: '全部' },
				{ value: 2, label: '指定发放' },
				{ value: 3, label: '分享领取' },
			],
			column: [
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'name', label: '优惠券名称' },
				{
					prop: 'itemImg',
					label: '商品图片',
					render: true,
				},
				{ prop: 'itemName', label: '适用商品' },
				{
					prop: 'fullPrice',
					label: '内容',
					formatter: (row, column) => {
						return `满${row.fullPrice}减${row.subtractPrice}`
					},
				},
				{
					prop: 'startTime',
					label: '开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime)
					},
				},
				{
					prop: 'endTime',
					label: '到期时间',
					formatter: (row, column) => {
						return parseTime(row.endTime)
					},
				},
				{
					prop: 'lastAmount',
					label: '剩余数量',
					formatter: (row, column) => {
						return `${row.lastAmount}/${row.totalAmount}`
					},
				},
				{ prop: 'useAmount', label: '已使用量' },
				{ prop: 'holdUserAmount', label: '持有人数' },
				{
					prop: 'itemSkuId',
					label: '活动状态',
					formatter: (row, column) => {
						if (row.startTime > new Date().getTime()) {
							return '未开始'
						} else if (row.endTime < new Date().getTime()) {
							return '已结束'
							// this.disabledStatus = true
						} else {
							return '进行中'
						}
					},
				},
				{ prop: 'banned', label: '禁用', render: true },
				{ prop: 'creator', label: '创建人' },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '详情',
							method: val => {
								// console.log(val)
								this.$router.push({
									path: 'couponDetail',
									query: { id: val.id },
								})
							},
						},
						{
							name: val => {
								if (val.endTime > new Date().getTime()) {
									return '分享优惠券'
								} else {
									return false
								}
							},
							method: val => {
								this.coupon = val.id
								this.shareVisilbe = true
							},
						},
						{
							name: val => {
								if (
									val.startTime > new Date().getTime() &&
									val.holdUserAmount === 0
								) {
									return '编辑'
								} else {
									return false
								}
							},
							method: val => {
								this.$router.push({
									path: 'addCoupon',
									query: { id: val.id, title: '编辑' },
								})
							},
						},
					],
				},
			],
		}
	},
	beforeRouteLeave(to, from, next) {
		to.meta.title = to.query.title
		next()
	},
	computed: {
		getList() {
			return getCouponList
		},
	},
	methods: {
		// 添加活动
		handleAdd() {
			this.$router.push({ path: 'addCoupon', query: { title: '新建' } })
		},
		onSubmit() {
			console.log('submit!')
		},
		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			this.$refs.couponList.update({ ...this.formInline })
		},
		// 查询的重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields()
			console.log(this.formInline)
		},
		// 禁用状态切换
		ban(id) {
			banState({ id: id }).then(res => {
				if (res.success) {
					Message.success('操作成功！')
				}
			})
		},
		copyShare() {
			let url = `${this.baseUrl}index/index?id=${this.coupon}`
			copyToClip(url)
			this.shareVisilbe = false
		},
	},
}
</script>

<style lang="scss">
.couponManage {
	padding: 20px;
	.admin_avater {
		height: 50px;
		width: 80px;
	}
	.el-dialog__body {
		text-align: center;
		div {
			padding: 10px;
		}
	}
}
</style>
