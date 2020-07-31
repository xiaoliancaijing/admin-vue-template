<!--
 * @Author: peng.wan
 * @Date: 2020-06-16 10:46:35
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-06-28 17:33:26
 * @Descripttion: 
-->
<!--
 * @Author: peng.wan
 * @Date: 2020-06-16 10:45:02
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-06-16 11:53:27
 * @Descripttion: 
-->
<template>
	<div class="parameterList">
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			添加
		</el-button>
		<Table :loadData="getCatSpec" ref="catSpecList" :params="id" :column="column" />
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="参数名称" prop="name">
					<el-input v-model.trim="ruleForm.name" maxlength="30" size="small"></el-input>
				</el-form-item>
				<el-form-item label="上级类目" prop="catName">
					<el-select v-model.trim="ruleForm.catName" size="small">
						<el-option
							v-for="item in options"
							:key="item.id"
							:label="item.name"
							:value="item.name"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="resetForm('ruleForm')">取消</el-button>
					<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getCatSpec, createCatSpec, editCatSpec, deleteCatSpec } from '@/api/catSpec'
import { getAllCat } from '@/api/cat'
import { Message } from 'element-ui'
export default {
	name: 'parameterList',
	components: {
		Table,
	},
	data() {
		return {
			dialogTitle: '', // 弹窗 title
			dialogFormVisible: false, // 弹窗显示
			id: { catId: this.$route.query.catId || null },
			parentId: this.$route.query.parentId || null,
			ruleForm: {
				catName: '',
				catId: '',
				name: '',
			},
			options: [],
			// 校检
			rules: {
				name: [
					{ required: true, message: '请输入属性名称', trigger: 'blur' },
					{ min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
				],
				catName: [{ required: true, message: '请选择上级类目', trigger: 'change' }],
			},
			// 表头
			column: [
				{ prop: 'name', label: '参数名称' },
				{ prop: 'catName', label: '上级类型' },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.dialogFormVisible = true
								this.ruleForm = { ...val }
								this.dialogTitle = '编辑参数'
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									deleteCatSpec({ ...val }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '删除成功!',
											})
											this.reset()
										}
									})
								})
							},
						},
					],
				},
			],
		}
	},
	created() {
		// this.getCatSpec();
	},
	computed: {
		getCatSpec() {
			return getCatSpec
		},
	},
	methods: {
		reset() {
			this.$refs.catSpecList.reset()
		},
		// 添加参数弹窗
		handleAdd() {
			this.dialogTitle = '添加参数'
			this.dialogFormVisible = true
			;(this.ruleForm = {
				catName: '',
				catId: '',
				name: '',
			}),
				this.getCatInfo()
		},
		// 获取上级类目列表
		getCatInfo() {
			getAllCat({ parentId: this.parentId }).then(
				res => {
					if (res.success) {
						this.options = res.data.list
						res.data.list.forEach(element => {
							if (element.id === this.id.catId) {
								this.ruleForm.catName = element.name
							}
						})
					}
				},
				err => {
					console.log(err)
				}
			)
		},
		// 确定添加
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.options.forEach(element => {
						if (element.name === this.ruleForm.catName) {
							this.ruleForm.catId = element.id
						}
					})
					if (this.dialogTitle === '添加参数') {
						createCatSpec({ ...this.ruleForm }).then(
							res => {
								if (res.success) {
									Message.success('创建成功！！')
									this.dialogFormVisible = false
									this.reset()
								}
							},
							err => {
								console.log(err)
							}
						)
					} else {
						editCatSpec({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success('创建成功！！')
								this.dialogFormVisible = false
								this.reset()
							}
						})
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 取消按钮
		resetForm(formName) {
			// this.$refs[formName].resetFields();
			this.dialogFormVisible = false
		},
	},
}
</script>

<style scoped>
.parameterList {
	padding: 20px;
}
</style>
