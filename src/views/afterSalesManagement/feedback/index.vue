<!--
 * @Author: tianhao
 * @Date: 2020-06-18 19:56:18
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-14 12:30:23
 * @Descripttion: 
-->
<template>
	<div class="feedback">
		<el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
			<el-form-item label="搜索" prop="userName">
				<el-input
					placeholder="请输入用户昵称"
					prefix-icon="el-icon-search"
					v-model.trim="formInline.userName"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-form-item label="建议标题" prop="feedbackType">
					<el-select
						v-model.trim="formInline.feedbackType"
						placeholder="请选择"
						size="small"
					>
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" size="small" @click="onSubmit">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('formInline')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->
		<Table :loadData="getList" ref="table" :column="column">
			<template v-slot:src="{ scope }">
				<el-image
					class="banner_img"
					v-bind:src="scope.src"
					:preview-src-list="[scope.src]"
				/>
			</template>
			<template v-slot:content="{ scope }">
				<el-tooltip class="tip_item" effect="dark" :content="scope.content" placement="top">
					<span>{{ scope.content }}</span>
				</el-tooltip>
			</template>
		</Table>
		<el-dialog :visible.sync="dialogVisible" title="意见反馈图片">
			<div class="demo-image__preview">
				<el-image
					style="width: 100px; height: 120px;margin-right:10px"
					v-for="item in srcs"
					:key="'img_' + item"
					:src="item"
					:preview-src-list="srcs"
				></el-image>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'
import { getList } from '@/api/feedback'
import { Message } from 'element-ui'
export default {
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				userName: '',
				feedbackType: '',
			},
			dialogVisible: false,
			srcs: [],
			options: [
				{ label: '使用体验', value: 'USE' },
				{ label: '购物流程体验', value: 'SHOPPING' },
				{ label: '其他建议', value: 'OTHER' },
			],
			column: [
				{
					prop: 'createTime',
					label: '反馈时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{
					prop: 'userName',
					label: '用户昵称',
				},
				{ prop: 'title', label: '建议标题' },
				{
					prop: 'content',
					label: '建议详情',
					render: true,
				},
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.src === '') {
									return false
								} else {
									return '查看图片'
								}
							},
							method: val => {
								if (val.src) {
									let arr = []
									arr = val.src.split(',')
									if (arr.length > 1) {
										arr.splice(arr.length - 1, 1)
									}
									this.srcs = arr
									this.dialogVisible = true
								} else {
									Message.error('用户未上传图片')
								}
							},
						},
					],
				},
			],
		}
	},
	computed: {
		getList() {
			return getList
		},
	},
	methods: {
		onSubmit() {
			// this.getList()
			this.$refs.table.update({ ...this.formInline })
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields()
			// this.$refs.table.reset()
		},
	},
}
</script>

<style lang="scss">
.feedback {
	padding: 20px;
	.imgSrc {
		height: 100px;
		width: 100px;
	}
	.imgSrc + .imgSrc {
		margin-left: 10px;
	}
}
.banner_img {
	width: 100px;
	height: 100px;
}
.tip_item {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.el-tooltip__popper {
	max-width: 500px;
}
</style>
