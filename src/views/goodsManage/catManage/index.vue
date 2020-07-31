<!--
 * @Author: 刘家辰
 * @Date: 2020-06-12 15:11:11
 * @LastEditTime: 2020-07-30 18:48:28
 * @LastEditors: peng.wan
 * @Description: 系统账号管理
-->
<template>
	<el-card :body-style="{ padding: '20px' }">
		<el-row>
			<el-col :span="12">
				<el-button
					@click="
						addVisible = true
						parentId = 0
					"
					type="primary"
					size="small"
				>
					+添加一级类目
				</el-button>
			</el-col>
		</el-row>
		<xtable :loadData="getAllCat" :column="column" ref="adminList" :childrenData="getAllCat">
			<template v-slot:banned="{ scope }">
				<el-switch
					v-model.trim="scope.banned"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					@change="ban(scope.id)"
				></el-switch>
			</template>
		</xtable>
		<!-- 添加模态窗 -->
		<el-dialog
			:title="parentId == 0 ? '新增一级类目' : '新增二级类目'"
			:visible.sync="addVisible"
			:before-close="() => (addVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			destroy-on-close
			width="300px"
		>
			<el-form
				:model="adminForm"
				:rules="rules"
				label-width="100px"
				class="demo-ruleForm"
				ref="adminForm"
			>
				<el-row>
					<el-col>
						<el-form-item label="类型名称" prop="name" required>
							<el-input
								v-model.trim="adminForm.name"
								:maxlength="parentId == 0 ? 20 : 20"
								placeholder="请输入类型名称"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="顺序" prop="sortIndex" required>
							<el-input
								v-model.number="adminForm.sortIndex"
								maxlength="3"
								placeholder="请输入展示顺序"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCancelBtu('adminForm')">取 消</el-button>
				<el-button type="primary" @click="create">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑模态框 -->
		<el-dialog
			:title="parentId == 0 ? '编辑一级类目' : '编辑二级类目'"
			:visible.sync="editVisible"
			:before-close="() => (editVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="300px"
		>
			<el-form
				:model="editForm"
				:rules="rules"
				label-width="100px"
				class="demo-ruleForm"
				ref="editForm"
			>
				<el-row>
					<el-col>
						<el-form-item label="类型名称" prop="name" required>
							<el-input
								v-model.trim="editForm.name"
								:maxlength="parentId == 0 ? 20 : 20"
								placeholder="请输入类型名称"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col>
						<el-form-item label="顺序" prop="sortIndex" required>
							<el-input
								v-model.number="editForm.sortIndex"
								maxlength="3"
								placeholder="请输入展示顺序"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editCancelBtu('editForm')">取 消</el-button>
				<el-button type="primary" @click="edit">确 定</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
import xtable from '@/components/Table'
import { getAllCat, createCat, editCat, deleteCat, banCat } from '@/api/cat'
import { Message } from 'element-ui'
export default {
	components: {
		xtable,
	},
	data() {
		return {
			column: [
				{
					prop: 'name',
					label: '类目名称',
				},
				{
					prop: 'banned',
					label: '导航栏显示',
					render: true,
				},
				{
					prop: 'itemCount',
					label: '关联商品数量',
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.editVisible = true
								this.editForm = { ...val }
								this.parentId = val.parentId
							},
						},
						{
							name: '删除',
							method: val => {
								console.log(val)
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() => {
									deleteCat({ ...val }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '删除成功!',
											})
											this.reset()
											if (val.parentId) {
												window.location.reload()
											}
										}
									})
								})
							},
						},
						{
							name: val => {
								if (val.parentId !== 0) {
									return false
								} else {
									return '添加二级类目'
								}
							},
							method: val => {
								this.addVisible = true
								this.parentId = val.id
							},
						},
						// 以下两个操作为二级类目操作
						{
							name: val => {
								if (val.parentId !== 0) {
									return 'SKU列表'
								} else {
									return false
								}
							},
							method: val => {
								this.$router.push({
									path: '/goodsManage/catManage/attributeList',
									query: { id: val.id, parentId: val.parentId },
								})
							},
						},
						{
							name: val => {
								if (val.parentId !== 0) {
									return '参数列表'
								} else {
									return false
								}
							},
							method: val => {
								this.$router.push({
									path: '/goodsManage/catManage/parameterList',
									query: { catId: val.id, parentId: val.parentId },
								})
							},
						},
					],
				},
			],
			addVisible: false,
			editVisible: false,
			adminForm: {
				name: '',
				sortIndex: '',
			},
			editForm: {
				name: '',
				sortIndex: '',
			},
			parentId: 0,
			rules: {
				name: { type: 'string', required: true, message: '类目名称不能为空' },
				sortIndex: {
					required: true,
					message: '请输入正确的展示顺序',
					pattern: /^[0-9]{1,5}$/,
				},
			},
		}
	},
	computed: {
		getAllCat() {
			return getAllCat
		},
	},
	methods: {
		reset() {
			this.$refs.adminList.reset()
		},
		// 编辑模态窗取消
		editCancelBtu(formName) {
			// this.$refs[formName].resetFields();
			this.editVisible = false
		},
		// 添加模态窗取消
		addCancelBtu(formName) {
			this.addVisible = false
			this.$refs[formName].resetFields()
		},
		//创建
		create() {
			this.$refs.adminForm.validate(valid => {
				if (valid) {
					createCat({ ...this.adminForm, parentId: this.parentId }).then(res => {
						if (res.success) {
							Message.success('创建成功！')
							this.addVisible = false
							this.$refs.adminForm.resetFields()
							this.reset()
							if (this.parentId) {
								window.location.reload()
							}
						}
					})
				}
			})
		},
		//编辑
		edit() {
			this.$refs.editForm.validate(valid => {
				if (valid) {
					editCat(this.editForm).then(res => {
						if (res.success) {
							Message.success('修改成功！')
							this.editVisible = false
							this.reset()
							if (this.parentId) {
								window.location.reload()
							}
						}
					})
				}
			})
		},
		// 禁用
		ban(id) {
			banCat({ id }).then(res => {
				if (res.success) {
					Message.success('操作成功！')
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.admin_avater {
	height: 40px;
	width: 40px;
}
</style>
