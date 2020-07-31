<!--
 * @Author: peng.wan
 * @Date: 2020-06-18 18:52:13
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-27 12:41:54
 * @Descripttion: 
-->
<template>
	<div class="activity">
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="活动标题" prop="title">
				<el-input
					v-model.trim="formInline.title"
					size="small"
					placeholder="活动标题"
				></el-input>
			</el-form-item>
			<el-form-item label="活动状态" prop="status">
				<el-select v-model.trim="formInline.status" placeholder="活动状态" size="small">
					<el-option
						v-for="item in status"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="banned">
				<el-select v-model.trim="formInline.banned" placeholder="状态" size="small">
					<el-option
						v-for="item in banneds"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			添加活动
		</el-button>
		<Table :loadData="getList" :column="column" ref="activityList">
			<template v-slot:description="{ scope }">
				<el-tooltip
					class="item itemName"
					effect="dark"
					:content="scope.description"
					placement="top"
				>
					<p>{{ scope.description }}</p>
				</el-tooltip>
			</template>
			<template v-slot:banned="{ scope }">
				<el-switch
					v-model.trim="scope.banned"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					:disabled="scope.rushEndTime < new Date().getTime() ? true : false"
					@change="ban(scope.id)"
				></el-switch>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getActivityList, banState } from '@/api/activity'
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
export default {
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				title: '',
				status: '',
				banned: '',
			},
			disabledStatus: false,
			status: [
				{ value: '', label: '全部' },
				{ value: 'NOT_STARTED', label: '未开始' },
				{ value: 'UNDERWAY', label: '进行中' },
				{ value: 'FINISHED', label: '已结束' },
			],
			banneds: [
				{ value: '', label: '全部' },
				{ value: true, label: '禁用' },
				{ value: false, label: '启用' },
			],
			column: [
				{
					prop: 'rushBeginTime',
					label: '活动开始时间',
					formatter: (row, column) => {
						return parseTime(row.rushBeginTime)
					},
				},
				{
					prop: 'rushEndTime',
					label: '活动结束时间',
					formatter: (row, column) => {
						return parseTime(row.rushEndTime)
					},
				},
				{ prop: 'title', label: '活动标题' },
				{ prop: 'description', label: '活动描述', render: true },

				{
					prop: 'itemCount',
					label: '参加活动商品数',
				},
				{ prop: 'purchaseNum', label: '抢购人数' },
				{ prop: 'banned', label: '启用/禁用', render: true },
				{
					prop: 'itemSkuId',
					label: '活动状态',
					formatter: (row, column) => {
						if (row.rushBeginTime > new Date().getTime()) {
							return '未开始'
						} else if (row.rushEndTime < new Date().getTime()) {
							return '已结束'
							this.disabledStatus = true
						} else {
							return '进行中'
						}
					},
				},
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.rushBeginTime > new Date().getTime()) {
									return false
								} else {
									return '活动明细'
								}
							},
							method: val => {
								// console.log(val)
								this.$router.push({
									path: 'activityDetail',
									query: { id: val.id },
								})
							},
						},
						{
							name: val => {
								if (val.rushBeginTime > new Date().getTime()) {
									return '编辑'
								} else {
									return false
								}
							},
							method: val => {
								this.$router.push({
									path: 'addActivity',
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
			return getActivityList
		},
	},
	methods: {
		// 添加活动
		handleAdd() {
			this.$router.push({ path: 'addActivity', query: { title: '添加' } })
		},
		onSubmit() {
			console.log('submit!')
		},
		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			this.$refs.activityList.update({ ...this.formInline })
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.$refs.activityList.reset()
		},
		// 禁用状态切换
		ban(id) {
			banState({ id: id }).then(res => {
				if (res.success) {
					Message.success('操作成功！')
				}
			})
		},
	},
}
</script>

<style scoped>
.activity {
	padding: 20px;
}
.admin_avater {
	height: 50px;
	width: 80px;
}
.itemName {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
