<!--
 * @Author: hao.tian
 * @Date: 2020-08-01 14:42:40
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-01 16:48:41
 * @Descripttion: 
-->
<template>
	<div class="tree">
		<el-tree
			ref="demoTree"
			:data="data2"
			:default-checked-keys="defaultCheckedKeys"
			:default-expanded-keys="defaultExpendedKeys"
			:expand-on-click-node="false"
			:filter-node-method="filterNode"
			:highlight-current="true"
			:props="defaultProps"
			class="vab-filter-tree"
			node-key="id"
			show-checkbox
			@check="checkNode"
			@node-click="nodeClick"
			@node-collapse="nodeCollapse"
			@node-expand="nodeExpand"
		>
			<span slot-scope="{ node, data }" class="vab-custom-tree-node">
				<span class="vab-tree-item">
					<i v-if="node.data.rank == 4" class="el-icon-s-custom"></i>
					{{ node.label }}
				</span>
				<span class="vab-tree-options">
					<a
						v-if="node.data.rank !== 4"
						class="vab-tree-btn"
						title="添加"
						@click="() => append(node, data, 0)"
					>
						<i class="el-icon-plus"></i>
					</a>
					<a class="vab-tree-btn" title="编辑" @click="() => edit(node, data, 1)">
						<i class="el-icon-edit"></i>
					</a>
					<a
						v-if="node.data.rank !== 1"
						class="vab-tree-btn"
						title="刪除"
						@click="() => remove(node, data)"
					>
						<i class="el-icon-delete"></i>
					</a>
				</span>
			</span>
		</el-tree>
		<!--添加/编辑节点弹框-------------------start-->
		<el-dialog
			:title="dialogTitle"
			:visible.sync="treeDialogVisible"
			class="tree-operate-dialog"
			width="400px"
			@close="treeDialogVisible = false"
		>
			<el-form ref="treeForm" :model="treeForm">
				<el-form-item label="节点名称" required>
					<el-input v-model="treeForm.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="treeDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveTree">确 定</el-button>
			</div>
		</el-dialog>
		<!--添加/编辑节点弹框-------------------end-->
	</div>
</template>

<script>
export default {
	data() {
		return {
			data2: [
				{
					label: '一级 1',
					children: [
						{
							label: '二级 1-1',
							children: [
								{
									label: '三级 1-1-1',
								},
							],
						},
					],
				},
				{
					label: '一级 2',
					children: [
						{
							label: '二级 2-1',
							children: [
								{
									label: '三级 2-1-1',
								},
							],
						},
						{
							label: '二级 2-2',
							children: [
								{
									label: '三级 2-2-1',
								},
							],
						},
					],
				},
			],
			treeFlag: 0,
			defaultCheckedKeys: [],
			defaultExpendedKeys: [],
			defaultProps: {
				children: 'children',
				label: 'label',
			},
			treeForm: {
				id: '',
				name: '',
			},
			dialogTitle: '添加节点',
			treeDialogVisible: false,
		}
	},
	methods: {
		// 树level小于n级展开方法
		openTree(treeData, n) {
			const each = data => {
				data.forEach(e => {
					if (e.rank <= n) {
						this.defaultExpendedKeys.push(e.id)
					}
					if (e.children.length > 0) {
						each(e.children)
					}
				})
			}
			each(treeData)
		},
		async getTreeListFuc(flag) {
			const { data } = await getTreeList()
			this.data2 = data
			if (flag) {
				this.openTree(this.data2, 2)
			}
		},
		// 节点展开操作
		nodeExpand(data, node, el) {
			this.defaultExpendedKeys.push(data.id)
		},
		nodeCollapse(data, node, el) {
			this.defaultExpendedKeys.splice(
				this.defaultExpendedKeys.findIndex(item => item.id === data.id),
				1
			)
		},
		// 节点过滤操作
		filterNode(value, data) {
			if (!value) return true
			return data.name.indexOf(value) !== -1
		},
		// 节点选中操作
		checkNode(data, node, el) {
			this.checkNodeKeys = node.checkedKeys
		},
		// 点击叶子节点
		nodeClick(data, node, el) {},
		// 节点关闭操作
		nodeCollapse(data, node, el) {
			this.defaultExpendedKeys.splice(
				this.defaultExpendedKeys.findIndex(item => item.id === data.id),
				1
			)
		},
		// 节点展开操作
		nodeExpand(data, node, el) {
			this.defaultExpendedKeys.push(data.id)
		},
		// 添加节点操作
		append(node, data, flag) {
			this.treeFlag = flag
			this.dialogTitle = '添加节点'
			this.treeForm = {
				id: '',
				name: '',
			}
			this.treeDialogVisible = true
		},
		// 编辑节点操作
		edit(node, data, flag) {
			console.log(flag)
			console.log(node)
			console.log(data)
			this.treeFlag = flag
			this.dialogTitle = '编辑节点'
			this.treeForm = {
				id: data.id,
				name: data.name,
			}
			this.treeDialogVisible = true
		},
		// 删除节点操作
		remove(node, data) {
			this.$baseConfirm('你确定要删除该节点?', null, async () => {
				const { msg } = getTreeList()
				this.$baseMessage(msg, 'success')
				this.getTreeListFuc(0)
			})
		},
		// 保存添加和编辑
		saveTree() {
			this.$refs.treeForm.validate(async valid => {
				if (valid) {
					console.log(this.data2[this.treeFlag])
					console.log(this.treeForm)
					this.data2[this.treeFlag].label = this.treeForm.name
					this.treeDialogVisible = false
				}
			})
		},
	},
}
</script>

<style scoped>
.tree {
	padding: 20px;
}
</style>
