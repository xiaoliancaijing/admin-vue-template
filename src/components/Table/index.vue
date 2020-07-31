<template>
	<div style="margin-top: 20px">
		<el-table
			:class="single ? 'single' : null"
			ref="multipleTable"
			:data="tableData"
			style="width: 100%"
			border
			:default-sort="{ prop: 'date', order: 'descending' }"
			row-key="id"
			lazy
			:load="childrenLoad"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			:indent="30"
			@selection-change="handleSelectionChange"
			@select="handleSelect"
			@select-all="allSelect"
		>
			<el-table-column
				v-if="select"
				type="selection"
				width="55"
				:reserve-selection="true"
			></el-table-column>
			<template v-for="item in column">
				<el-table-column
					:prop="item.prop ? item.prop : null"
					:label="item.label ? item.label : null"
					align="center"
					:width="item.width ? item.width : null"
					:formatter="item.formatter ? item.formatter : null"
					:key="item.prop"
				>
					<template v-if="item.render" v-slot="scope">
						<slot :scope="scope.row" :name="item.prop"></slot>
					</template>
					<template v-else-if="item.actives" v-slot="scope">
						<template v-for="active in item.actives">
							<template
								v-if="
									typeof active.name === 'function'
										? active.name(scope.row)
											? active.name
											: false
										: active.name
								"
							>
								<el-button
									@click="active.method(scope.row)"
									type="text"
									size="small"
									:key="'' + active.name"
								>
									{{
										typeof active.name === 'function'
											? active.name(scope.row)
											: active.name
									}}
								</el-button>
							</template>
						</template>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div :class="{ hidden: hidden }">
			<el-pagination
				:current-page.sync="listQuery.pageIndex"
				:page-size.sync="listQuery.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="pageSizes"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script>
/**
 * @name:
 * @description: 表格二次封装
 * loadData       fun     一级数据接口函数  二级数据所需id默认会在此获取
 * childrenData   fun     二级数据接口函数  添加此函数默认开启数形结构 并且所有一级数据都会带上childen属性
 * params  obj 初始化的时候需要带的参数
 * column    array   表头数据   ==>
 *   表头参数如下：{
 *     props: string 表头key值
 *     label:string 表头名字
 *     width: number 表头该列的宽度
 *     formatter: fun 自定义格式 Function(row, column, cellValue, index)  row:整条数据实例  column:表头实例  cellValue:该条参数值  index:index
 *     actives: array  操作   {method 事件函数  name 操作名称 }  
 *            ==>method：val=>{} val为返回的该行的值  
 *            ==>name:string /function  当传入为回调函数时 回调参数返回为该行的值 当返回为false时 该操作按钮默认不显示
 *   }
 * render    boolean  是否需要自定义插槽 父组件插槽：    v-slot:prop值="{scope}" scope为该行值 
 * eg:
 * <template v-slot:avatar="{scope}">
        <img :src="scope.avatar" class="admin_avater" />
    </template>

 * select    function 开启多选框  传递函数 返回value  绑定函数需要在method中声明  value为选中数组 single为true 多选变成单选
 * hidden    boolean  是否显示分页器 不传则默认显示
 * single    boolean  是否开启单选
 * 
 * ==================
 * 方法 通过this.$refs.表格名.方法名  调用  eg:this.$refs.table.update({...searchParams}) //搜索并更新表格 searchParams为搜索参数对象
 * reset重置表格  update更新表格  clearSelect清空单选/多选
 * @return:
 */
/*分页器
 * total         number   总条目数
 * current-page.sync      number   当前页数
 * page-size.sync         number   每页限制条数
 * pageSizes     array    每页显示条目个数，支持 .sync 修饰符
 * layout        string   组件布局，子组件名用逗号分隔
 * hidden        boolean  是否隐藏
 */

export default {
	name: 'xtable',
	props: {
		loadData: {
			type: Function,
			required: true,
		},
		childrenData: {
			type: Function,
		},
		column: {
			type: Array,
		},
		hidden: {
			type: Boolean,
			default: false,
		},
		params: {
			type: Object,
		},
		select: {
			type: Function,
		},
		single: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			total: 0,
			listQuery: {
				pageIndex: 1,
				pageSize: 20,
			},
			tableData: [],
			pageSizes: [10, 20, 30, 50],
			searchParams: {}, //搜索参数,
			activeRow: {}, //选择当前行
			parentId: 0,
			cutId: '',
		}
	},
	created() {
		this.getData({ ...this.params, ...this.listQuery })
	},
	mounted() {},
	methods: {
		getData(params) {
			this.loadData({ ...params }).then(
				res => {
					if (res.success) {
						let list = []
						if (this.childrenData) {
							list = res.data.list.map(item => {
								item.hasChildren = true
								return item
							})
						} else {
							list = res.data.list
						}
						this.total = res.data.totalElements
						this.tableData = res.data.list
					}
				},
				err => {
					console.log(err)
				}
			)
		},
		// 修改每页展示条数
		handleSizeChange(val) {
			this.getData({
				pageIndex: this.listQuery.pageIndex,
				pageSize: val,
				...this.searchParams,
				...this.params,
			})
		},
		// 页数
		handleCurrentChange(val) {
			console.log(val)
			this.getData({
				pageIndex: val,
				pageSize: this.listQuery.pageSize,
				...this.searchParams,
				...this.params,
			})
		},
		// 通过this.$refs.表格名  调用的方法==============
		// 重置表格 刷新
		reset() {
			this.getData({ ...this.params, ...this.listQuery })
		},
		// 更新表格
		update(params) {
			this.searchParams = params
			this.getData({ ...this.listQuery, ...this.params, ...params })
		},
		// 清空选项
		clearSelect() {
			this.$refs.multipleTable.clearSelection()
		},
		//================================================
		// 二级类目
		childrenLoad(row, treeNode, resolve) {
			this.childrenData({ parentId: row.id, pageSize: 100 }).then(res => {
				if (res.success) {
					resolve(res.data.list)
				}
			})
		},
		handleSelect(val, row) {
			if (this.single) {
				if (val.length > 1) {
					this.$refs.multipleTable.clearSelection() // 清空所有选择
					val.shift()
					this.$refs.multipleTable.toggleRowSelection(row) //  选中当前选择
				}

				let selected = val.length && val.indexOf(row) !== -1
				// true就是选中，0或者false是取消选中
			}
			this.select(val)
		},
		handleSelectionChange(val) {
			if (this.single) {
				let posy = val
				let pos = []
				posy.forEach(item => {
					pos.push(item.id)
					this.cutId = pos.join(',') //把选中的id已字符串传递出去  例如：'1,3,4,5'
				})
			}
		},
		// 全选按钮
		allSelect(val) {
			this.select(val)
		},
	},
}
</script>

<style lang="scss">
.el-pagination {
	text-align: right;
	padding: 10px 10px;
}
.el-table th {
	background-color: #fafafa;
}
.single thead tr .el-checkbox__input {
	display: none;
}
// .el-table .cell.el-tooltip {
// 	white-space: pre-wrap;
// 	overflow: hidden;
// 	text-overflow: ellipsis;
// 	display: -webkit-box;
// 	-webkit-line-clamp: 2;
// 	line-clamp: 2;
// 	-webkit-box-orient: vertical;
// }
// .el-tooltip__popper {
// 	max-width: 500px;
// 	// left: 230px;
// }
</style>
