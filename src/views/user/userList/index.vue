<!--
 * @Author: tianhao
 * @Date: 2020-06-17 11:55:33
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-09 16:58:42
 * @Descripttion: 
-->
<template>
	<div class="userList">
		<el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
			<el-form-item label="搜索条件:" prop="nickName">
				<el-input
					placeholder="请输入用户昵称"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.nickName"
					size="small"
				></el-input>
			</el-form-item>
			<!-- <el-form-item prop="name">
				<el-input
					placeholder="请输入真实姓名"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.name"
					size="small"
				></el-input>
			</el-form-item> -->
			<el-form-item prop="phone">
				<el-input
					placeholder="请输入手机号码"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.phone"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="注册时间:" prop="regDate">
				<el-date-picker
					@change="onChange"
					v-model.trim="ruleForm.regDate"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<!-- <el-form-item label="等级:">
        <el-select v-model.trim="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
			<!-- <el-form-item label="状态:" prop="enable">
				<el-select v-model.trim="ruleForm.enable" placeholder="请选择" size="small">
					<el-option
						v-for="item in states"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('ruleForm')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<Table :loadData="getList" :column="column" ref="userList">
			<template v-slot:enable="{ scope }">
				<el-switch
					v-model.trim="scope.enable"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="true"
					:inactive-value="false"
					@change="ban(scope.id)"
				></el-switch>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'
import { getUserList, banState } from '@/api/user'
import { Message } from 'element-ui'
import { startEndTime } from '@/core/directives/time'
export default {
	components: {
		Table,
	},
	data() {
		return {
			ruleForm: {
				enable: null,
				endTime: null,
				startTime: null,
				phone: null,
				name: null,
				nickName: null,
			},
			// options: [
			//   { value: "", label: "注册用户" },
			//   { value: "", label: "一级经销商" },
			//   { value: "", label: "二级经销商" }
			// ],
			states: [
				{ value: true, label: '正常' },
				{ value: false, label: '禁用' },
				{ value: '', label: '全部' },
			],
			column: [
				{
					prop: 'createTime',
					label: '注册时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'id', label: '用户ID' },
				{ prop: 'nickName', label: '用户昵称' },
				// { prop: 'name', label: '真实姓名' },
				{ prop: 'phone', label: '手机号' },
				// {
				// 	prop: 'sex',
				// 	label: '性别',
				// 	formatter: (row, column) => {
				// 		if (row.sex === 'MAN') {
				// 			return '男'
				// 		} else if (row.sex === 'WOMAN') {
				// 			return '女'
				// 		} else {
				// 			return '未知'
				// 		}
				// 	},
				// },

				// { prop: 'enable', label: '禁用', render: true },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '详情',
							method: val => {
								this.$router.push({
									path: 'userDetail',
									query: { userId: val.id },
								})
							},
						},
					],
				},
			],
		}
	},
	computed: {
		getList() {
			return getUserList
		},
	},
	methods: {
		onChange(value) {
			this.ruleForm.startTime = value[0]
			this.ruleForm.endTime = value[1]
		},
		onClickSearch() {
			// let timeArray = startEndTime(this.ruleForm.regDate)
			// if (timeArray && timeArray.length) {
			// 	this.ruleForm.startTime = timeArray[0]
			// 	this.ruleForm.endTime = timeArray[1]
			// }
			// delete this.ruleForm.regDate
			this.$refs.userList.update({ ...this.ruleForm })
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.ruleForm.startTime = null
			this.ruleForm.endTime = null
			// this.$refs.userList.reset()
			// this.$refs[formName].resetFields();
		},
		// 禁用状态切换
		ban(id) {
			banState({ userId: id }).then(res => {
				if (res.success) {
					Message.success('操作成功！')
				}
			})
		},
	},
}
</script>

<style>
.userList {
	padding: 20px;
}
</style>
