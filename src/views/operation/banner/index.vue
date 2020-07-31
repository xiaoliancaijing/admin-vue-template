<!--
 * @Author: tianhao
 * @Date: 2020-06-17 16:02:02
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-27 12:44:33
 * @Descripttion: 
-->
<template>
	<div class="banner">
		<!-- 头部查询 -->
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="状态:" prop="banned">
				<el-select v-model="formInline.banned" placeholder="请选择" size="small">
					<el-option
						v-for="item in states"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型:" prop="bannerType">
				<el-select v-model="formInline.bannerType" placeholder="请选择" size="small">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="search">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('formInline')">
					重置
				</el-button>
				<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
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
			<!-- <template v-slot:color="{ scope }">
				<el-color-picker :disabled="true" v-model="scope.color"></el-color-picker>
			</template> -->
			<template v-slot:banned="{ scope }">
				<el-switch
					v-model="scope.banned"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="false"
					:inactive-value="true"
					@change="ban(scope.id)"
				></el-switch>
			</template>
		</Table>
		<!-- 新增/编辑 -->
		<el-dialog
			@close="handleClose"
			:title="isAdd ? '新增' : '编辑'"
			:visible.sync="dialogVisible"
			width="600px"
			custom-class="dialog_content"
		>
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<el-form-item label="类型" prop="bannerType">
					<el-radio-group @change="changeBannerType" v-model="ruleForm.bannerType">
						<el-radio label="INDEX">首页BANNER</el-radio>
						<el-radio label="INSERT">商品插播BANNER</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="轮播图" prop="src">
					<CropperImg :ratio="ratio" v-model="ruleForm.src" :key="ratio"></CropperImg>
				</el-form-item>
				<!-- <el-form-item label="背景色数值" prop="color">
          <el-color-picker v-model="ruleForm.color"></el-color-picker>
        </el-form-item> -->
				<el-form-item label="顺序" prop="sortIndex" v-if="ruleForm.bannerType === 'INDEX'">
					<el-input-number
						maxlength="3"
						v-model.number="ruleForm.sortIndex"
						controls-position="right"
						:min="1"
						:max="999"
					></el-input-number>
				</el-form-item>
				<el-form-item label>
					<el-checkbox v-model="checked">设置时间</el-checkbox>
				</el-form-item>
				<div v-if="checked">
					<el-form-item label="选择时间" prop="time">
						<el-date-picker
							v-model="ruleForm.time"
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
				</div>
				<el-form-item label="关联类型" prop="relationType">
					<el-radio-group @change="changeRadio" v-model="ruleForm.relationType">
						<el-radio label="NONE">无</el-radio>
						<el-radio label="ITEM">商品</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- 点击商品后显示按钮 -->
				<div v-if="showShopBtn">
					<el-form-item label>
						<el-button @click="chooseShop" type="primary">选择商品</el-button>
					</el-form-item>
					<el-form-item v-if="ruleForm.relationValue">
						<div class="goods abreast">
							<img class="chooseImg" v-bind:src="ruleForm.itemImg" alt />
							<div class="goods_content">
								<div class="good_detail">
									<div class="good_title" v-html="ruleForm.itemName"></div>
									<i @click="deleteChoose" class="el-icon-delete icon"></i>
								</div>
								<p class="price">￥{{ ruleForm.itemPrice }}</p>
							</div>
						</div>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleOK('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 选择商品 -->
		<el-dialog
			title="选择商品"
			@close="shopClose"
			:visible.sync="shopDialogVisible"
			width="50%"
		>
			<el-form :inline="true" :model="chooseForm" class="demo-form-inline" ref="chooseForm">
				<el-form-item label="商品名称">
					<el-input
						v-model.trim="chooseForm.name"
						prefix-icon="el-icon-search"
						size="small"
						placeholder="请输入商品名称"
					></el-input>
				</el-form-item>
				<el-form-item label="品类">
					<el-cascader
						:props="catProps"
						v-model="chooseForm.catName"
						clearable
						@change="onChangeValue"
						size="small"
					></el-cascader>
				</el-form-item>
				<el-form-item label="活动">
					<el-select
						v-model="chooseForm.actType"
						placeholder="活动名称"
						size="small"
						@change="onChangeActType"
					>
						<el-option
							v-for="item in actTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-checkbox @change="changeCheckbox" v-model="chooseForm.newFlag">
						上新
					</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchGoods" size="small">查询</el-button>
				</el-form-item>
			</el-form>
			<Table
				:select="getChoose"
				:loadData="getGoodsList"
				ref="goodsTable"
				:column="goodsColumn"
				:single="true"
				style="height: 450px; overflow-y: auto;"
			></Table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="shopClose">取 消</el-button>
				<el-button type="primary" @click="chooseShopOK">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
// import LTNQupload from "@/components/upload/index";
import CropperImg from '@/components/cropperImg/index'
import { startEndTime } from '@/core/directives/time'
import { parseTime } from '@/utils'
import { isEmpty } from '@/core/directives/empty'
import { getList, AddBanner, deleteBanner, banPick, edit, bannerDetail } from '@/api/banner'
import { getGoods } from '@/api/goods'
import { getAllCat } from '@/api/cat'
import { Divider } from 'element-ui'
export default {
	components: {
		Table,
		// LTNQupload,
		CropperImg,
	},
	data() {
		var checkAge = (rule, value, callback) => {
			if (isEmpty(value)) {
				return callback(new Error('顺序值不能为空'))
			}
			if (!Number.isInteger(value)) {
				callback(new Error('请输入数字值'))
			} else {
				if (value > 99999) {
					callback(new Error('最小值为99999'))
				} else if (value < 0) {
					callback(new Error('最大值为0'))
				} else {
					callback()
				}
			}
		}

		return {
			actTypeList: [
				{ label: '限时抢购', value: 'TIME' },
				{ label: '甄选优品', value: 'RECOMMEND' },
			],
			catProps: {
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node
					if (!node.data) {
						getAllCat().then(res => {
							const nodes = Array.from(res.data.list).map(item => {
								return {
									value: item.id,
									label: item.name,
									leaf: level >= 1,
								}
							})
							resolve(nodes)
						})
					} else {
						getAllCat({ parentId: node.data.value }).then(res => {
							const nodes = Array.from(res.data.list).map(item => {
								return {
									value: item.id,
									label: item.name,
									leaf: level >= 1,
								}
							})
							resolve(nodes)
						})
					}
				},
			},
			firstId: '',
			shopDialogVisible: false,
			dialogVisible: false,
			shop: {},
			formInline: {
				banned: null,
				bannerType: '',
			},
			checked: false,
			ruleForm: {
				relationType: 'NONE',
				relationValue: '',
				bannerType: 'INDEX',
				itemName: '',
				itemPrice: '',
				itemImg: '',
				time: [],
				sortIndex: '',
			},
			isShowTime: false,
			showShopBtn: false,
			isAdd: false,
			chooseForm: {
				newFlag: false,
			},
			first: [], //一级类目
			second: [], //二级类目
			states: [
				{ label: '全部', value: '' },
				{ label: '正常', value: false },
				{ label: '下架', value: true },
			],
			options: [
				{ label: '全部', value: '' },
				{ label: '首页BANNER', value: 'INDEX' },
				{ label: '商品插播BANNER', value: 'INSERT' },
			],
			column: [
				{
					prop: 'src',
					label: '图片',
					render: true,
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
					label: '结束时间',
					formatter: (row, column) => {
						return parseTime(row.endTime)
					},
				},
				{
					prop: 'bannerType',
					label: '类型',
					formatter: (row, column) => {
						if (row.bannerType === 'INDEX') {
							return '首页BANNER'
						} else if (row.bannerType === 'INSERT') {
							return '商品插播BANNER'
						} else {
							return ''
						}
					},
				},
				// { prop: 'color', label: '背景色数值', render: true },
				{ prop: 'creator', label: '添加操作人' },
				{ prop: 'sortIndex', label: '顺序' },
				{
					prop: 'banned',
					label: '上/下架',
					render: true,
				},
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: '修改',
							method: val => {
								// this.ruleForm = { ...val };
								bannerDetail(val.id).then(res => {
									if (res.code === 200) {
										this.ruleForm = { ...res.data, time: '' } //time必须初始化才能绑定成功
										this.changeRadio()
										if (val.startTime && val.endTime) {
											this.checked = true
											let startTime = new Date(val.startTime)
											let endTime = new Date(val.endTime)
											this.ruleForm.time = [startTime, endTime]
										} else {
											this.ruleForm.time = []
										}
										this.isAdd = false
										this.dialogVisible = true
									} else {
										this.$message.error(res.msg)
									}
								})

								// this.$refs.table.reset();
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('确定删除?', '提示', {
									type: 'warning',
								}).then(() =>
									deleteBanner(val).then(res => {
										if (res.code === 200) {
											this.$message.success('操作成功')
											this.$refs.table.reset()
										} else {
											this.$message.error(res.msg)
										}
									})
								)
							},
						},
					],
				},
			],
			goodsColumn: [
				{
					prop: 'name',
					label: '商品名称',
				},
				{
					prop: 'defaultPrice',
					label: '价格',
				},
				{
					prop: 'cover',
					label: '商品图片',
					formatter: (row, column) => {
						return <img class="chooseImg" src={row.cover} />
					},
				},
			],
			rules: {
				color: [{ required: true, message: '请选择颜色', trigger: 'change' }],
				src: [{ required: true, message: '请上传Banner', trigger: 'change' }],
				sortIndex: [{ validator: checkAge, trigger: 'change' }],
				bannerType: [{ required: true, message: '请选择类型', trigger: 'change' }],
				relationType: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
			},
			ratio: 1 / 2.4,
			goodsList: [],
			chooseVal: {},
		}
	},
	computed: {
		getList() {
			return getList
		},
		getGoodsList() {
			return getGoods
		},
	},
	methods: {
		// 是否上新 checkbox
		changeCheckbox(val) {
			if (!val) {
				this.$refs.goodsTable.update()
			}
		},
		onChangeActType(val) {
			console.log(val)
		},
		// 获取二级类目ID
		onChangeValue(val) {
			this.chooseForm.catId = val[1]
		},
		searchGoods() {
			this.$refs.goodsTable.update(this.chooseForm)
		},
		getChoose(val) {
			this.chooseVal = val[0]
		},
		shopClose() {
			this.shopDialogVisible = false
			if (!this.chooseVal) {
				this.ruleForm.itemName = ''
				this.ruleForm.itemPrice = ''
				this.ruleForm.itemImg = ''
			}
		},
		chooseShopOK() {
			if (this.chooseVal) {
				this.ruleForm.relationValue = this.chooseVal.id
				this.ruleForm.itemName = this.chooseVal.name
				this.ruleForm.itemPrice = this.chooseVal.defaultPrice
				this.ruleForm.itemImg = this.chooseVal.cover
			}
			this.$refs.goodsTable.clearSelect()
			this.shopDialogVisible = false
		},
		chooseShop() {
			this.shopDialogVisible = true
		},
		changeBannerType() {
			this.ruleForm.src = ''
			if (this.ruleForm.bannerType === 'INDEX') {
				this.ratio = 1 / 2.4
			} else {
				this.ratio = 1 / 4.3
			}
		},
		changeRadio() {
			if (this.ruleForm.relationType === 'ITEM') {
				this.showShopBtn = true
			} else {
				this.showShopBtn = false
			}
		},
		// getList() {
		//   // return getList;
		// },
		handleClose() {
			this.dialogVisible = false
			this.ruleForm.relationValue = ''
			this.checked = false
			this.resetForm('ruleForm')
			this.ruleForm = {
				relationType: 'NONE',
				relationValue: '',
				bannerType: 'INDEX',
				itemName: '',
				itemPrice: '',
				itemImg: '',
				time: [],
				sortIndex: '',
			}
		},
		search() {
			this.$refs.table.update({ ...this.formInline })
		},
		handleOK(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.checked) {
						if (!this.ruleForm.time) {
							this.$message.error('请设置时间')
							return
						}
					}
					if (this.ruleForm.time) {
						this.ruleForm.startTime = new Date(this.ruleForm.time[0]).getTime()
						this.ruleForm.endTime = new Date(this.ruleForm.time[1]).getTime()
					}
					if (this.ruleForm.relationType == 'ITEM' && !this.ruleForm.itemName) {
						this.$message.error('请选择商品')
					}
					if (this.isAdd) {
						// 新增
						AddBanner(this.ruleForm).then(res => {
							if (res.code === 200) {
								this.handleClose()
								this.$message.success('操作成功')
							} else {
								this.$message.error(res.msg)
							}
						})
					} else {
						// 编辑
						edit(this.ruleForm).then(res => {
							if (res.code === 200) {
								this.handleClose()
								this.$message.success('操作成功')
							} else {
								this.$message.error(res.msg)
							}
						})
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		onSubmit() {},
		// getUpLoadImgUrl(url) {
		//   this.ruleForm.src = url;
		// },
		handleAdd() {
			this.isAdd = true
			this.dialogVisible = true
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.search()
		},
		deleteChoose() {
			this.ruleForm.relationValue = ''
		},
		ban(id) {
			banPick({ id }).then(res => {
				if (res.code === 200) {
					this.$message.success('操作成功')
				} else {
					this.$message.error(res.msg)
				}
			})
		},
	},
}
</script>

<style>
.banner {
	padding: 20px;
}
.banner_img {
	width: 100px;
	height: 100px;
}
.radioStyle {
	padding-top: 10px;
}
.chooseImg {
	width: 100px;
	height: 100px;
}
.abreast {
	display: flex;
}
.goods {
	height: 100px;
	width: 70%;
	position: relative;
	border: 1px solid #ccc;
}
.icon {
	margin-top: 14px;
	position: absolute;
	right: 5px;
	top: -4px;
}
.price {
	color: red;
	margin: 0;
}
.goods_content {
	padding-left: 5px;
}
.good_detail {
	padding-right: 20px;
	width: 100%;
}
.good_title {
	padding-top: 6px;
	line-height: 24px;
}
.dialog_content {
}
</style>
