<!--
 * @Author: peng.wan
 * @Date: 2020-06-16 10:45:02
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-06-28 18:11:55
 * @Descripttion: 
-->
<template>
	<div class="attributeList">
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			添加
		</el-button>
		<Table :loadData="getCatSkus" ref="catSkusList" :params="id" :column="column" />
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="SKU名称" prop="name">
					<el-input
						v-model.trim="ruleForm.name"
						placeholder="请输入SKU名称"
						@input="SKUInput"
						maxlength="30"
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item label="上级类目" prop="catName">
					<el-select
						v-model.trim="ruleForm.catName"
						placeholder="请选择活动区域"
						size="small"
					>
						<el-option
							v-for="item in options"
							:key="item.id"
							:label="item.name"
							:value="item.name"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="允许参与活动" prop="actFlag">
					<el-radio-group v-model.trim="ruleForm.actFlag">
						<el-radio :label="false">不允许</el-radio>
						<el-radio :label="true">允许</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="允许运营推荐" prop="recommendFlag">
					<el-radio-group v-model.trim="ruleForm.recommendFlag">
						<el-radio :label="false">不允许</el-radio>
						<el-radio :label="true">允许</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="允许手动录入" prop="addFlag">
					<el-radio-group v-model.trim="ruleForm.addFlag">
						<el-radio :label="false">不允许</el-radio>
						<el-radio :label="true">允许</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="SKU列表" prop="value">
					<!-- <el-input type="textarea" placeholder="以逗号为间隔" v-model.trim="ruleForm.value"  /> -->
					<el-tag
						:key="tag"
						v-for="tag in inputValue"
						closable
						:disable-transitions="false"
						@close="handleClose(tag)"
					>
						{{ tag }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible"
						v-model.trim="ruleForm.value"
						ref="saveTagInput"
						size="small"
						maxlength="30"
						@input="onInput"
						@keyup.enter.native="handleInputConfirm"
						@blur="handleInputConfirm"
					></el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						icon="el-icon-plus"
						@click="showInput"
					>
						添加SKU
					</el-button>
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
import { getCatSkus, createCatSkus, deleteCatSkus, editCatSkus } from '@/api/catSpec'
import { getAllCat } from '@/api/cat'
import { Message } from 'element-ui'
export default {
	name: 'attributeList',
	components: {
		Table,
	},
	data() {
		return {
			dialogTitle: '',
			dialogFormVisible: false,
			id: { catId: this.$route.query.id || null },
			parentId: this.$route.query.parentId || null,
			options: [],
			inputVisible: false,
			inputValue: [],
			ruleForm: {
				name: '',
				catId: '',
				actFlag: true,
				recommendFlag: true,
				addFlag: true,
				value: '',
				catName: '',
			},
			rules: {
				name: [
					{ required: true, message: '请输入SKU名称', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
				],
				catName: [{ required: true, message: '请选择上级类目', trigger: 'change' }],
				actFlag: [{ required: true, message: '请选择参与活动', trigger: 'change' }],
				recommendFlag: [{ required: true, message: '请选择运营推荐', trigger: 'change' }],
				addFlag: [{ required: true, message: '请选择录入方式', trigger: 'change' }],
				value: [
					{ required: false, message: '请添加SKU列表', trigger: 'blur' },
					{
						min: 1,
						max: 500,
						message: '长度在 1 到 500 个字符',
						trigger: 'blur',
					},
				],
			},
			column: [
				{ prop: 'name', label: 'SKU名称' },
				{ prop: 'catName', label: '上级类型' },
				{ prop: 'value', label: '可选值列表' },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.dialogFormVisible = true
								this.ruleForm = { ...val }
								this.dialogTitle = '编辑SKU'
								this.inputValue = val.value.split(',')
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									deleteCatSkus({ ...val }).then(res => {
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
	computed: {
		getCatSkus() {
			return getCatSkus
		},
	},
	methods: {
		reset() {
			this.$refs.catSkusList.reset()
		},
		// 添加SKU弹窗
		handleAdd() {
			this.ruleForm = {
				name: '',
				catId: '',
				actFlag: true,
				recommendFlag: true,
				addFlag: true,
				value: '',
				catName: '',
			}
			this.inputValue = []
			this.dialogTitle = '添加SKU'
			this.dialogFormVisible = true
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
					this.ruleForm.value = this.inputValue.toString()
					if (this.dialogTitle === '添加SKU') {
						if (this.inputValue.length > 0) {
							createCatSkus({ ...this.ruleForm }).then(
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
							Message.error('请添加SKU！！')
						}
					} else if (this.ruleForm.value) {
						editCatSkus({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success('修改成功！！')
								this.dialogFormVisible = false
								this.reset()
							}
						})
					} else {
						Message.error('请添加SKU！！')
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 取消按钮
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.dialogFormVisible = false
		},
		//  删除SKU
		handleClose(tag) {
			this.inputValue.splice(this.inputValue.indexOf(tag), 1)
		},
		SKUInput(val) {
			if (val.length >= 30) {
				Message.error('SKU名称最多只能添加30个字符！！')
			}
		},
		// 输入框限制长度
		onInput(val) {
			if (val.length >= 30) {
				Message.error('最多只能输入30个字符！！')
			}
		},
		showInput() {
			if (this.inputValue.length < 20) {
				this.inputVisible = true
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus()
				})
			} else {
				Message.error('最多只能添加20个SKU！！')
			}
		},
		handleInputConfirm() {
			let inputValue = this.ruleForm.value
			if (inputValue) {
				this.inputValue.push(inputValue)
			}
			this.inputVisible = false
			this.ruleForm.value = ''
		},
	},
}
</script>

<style scoped>
.attributeList {
	padding: 20px;
}
.el-tag {
	margin-right: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
