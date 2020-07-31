<!--
 * @Author: peng.wan
 * @Date: 2020-06-19 10:11:14
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-30 18:10:15
 * @Descripttion: 
-->
<template>
	<div class="addActivity">
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="150px"
			class="demo-ruleForm"
		>
			<el-form-item label="活动标题" prop="limitPromotion.title">
				<el-input
					v-model.trim="ruleForm.limitPromotion.title"
					maxlength="40"
					placeholder="请输入活动标题"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="活动描述" prop="limitPromotion.description">
				<el-input
					type="textarea"
					v-model.trim="ruleForm.limitPromotion.description"
					maxlength="200"
					placeholder="请输入活动描述"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="活动开始时间" prop="limitPromotion.rushBeginTime">
				<el-date-picker
					v-model.trim="ruleForm.limitPromotion.rushBeginTime"
					type="datetime"
					placeholder="选择日期时间"
					value-format="timestamp"
					:picker-options="begPickerOptions"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="活动结束时间" prop="limitPromotion.rushEndTime">
				<el-date-picker
					v-model.trim="ruleForm.limitPromotion.rushEndTime"
					type="datetime"
					placeholder="选择日期时间"
					value-format="timestamp"
					:picker-options="endPickerOptions"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="抢购人数倍数(虚拟)" prop="limitPromotion.crowdMulti">
				<el-input
					type="text"
					v-model.trim="ruleForm.limitPromotion.crowdMulti"
					size="small"
					maxlength="4"
					placeholder="请输入抢购人数倍数"
				>
					<template slot="append">
						/倍
					</template>
				</el-input>
			</el-form-item>

			<el-form-item label="活动商品" prop="items">
				<el-button type="primary" size="mini" @click="onClickDialog">添加商品</el-button>
				<div>
					<span>请添加需参加活动的SPU商品</span>
					<div v-for="(itemTemp, index) in ruleForm.items" :key="index">
						<el-card class="box-card" shadow="hover" v-if="goodsInfo">
							<div class="clearfix">
								<div class="block">
									<el-image
										style="width: 100%; height: 100%"
										:src="itemTemp.itemCover ? itemTemp.itemCover : null"
									></el-image>
								</div>
								<div class="goods_info" style="margin-right:20px">
									<el-tooltip
										class="spuName"
										effect="dark"
										:content="itemTemp.itemName"
										placement="top"
									>
										<span>商品名称：{{ itemTemp.itemName }}</span>
									</el-tooltip>

									<el-tooltip
										class="item_tip"
										effect="dark"
										:content="itemTemp.summary"
										placement="top"
									>
										<span>商品描述：{{ itemTemp.summary }}</span>
									</el-tooltip>
								</div>
								<div>
									<el-button
										type="primary"
										size="mini"
										@click="deleteClick(index)"
									>
										<i class="el-icon-delete"></i>
									</el-button>
								</div>
								<div class="editBtu">
									<el-button
										type="primary"
										size="mini"
										@click="editClick(itemTemp, index)"
									>
										修改
									</el-button>
								</div>
							</div>
						</el-card>
						<el-table
							v-if="goodsInfo"
							:data="itemTemp.itemSkuList"
							border
							style="width: 100%;margin:20px 0"
						>
							<el-table-column align="center" prop="itemSkuImage" label="规格展示图">
								<template slot-scope="scope">
									<img
										:src="scope.row.itemSkuImage"
										alt=""
										style="width:60px;height:60px"
									/>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="itemSkuName"
								label="规格名称"
							></el-table-column>
							<el-table-column
								align="center"
								prop="skuRushPrice"
								label="抢购价"
							></el-table-column>
							<el-table-column
								align="center"
								prop="skuOriginalPrice"
								label="划线价"
							></el-table-column>
							<el-table-column
								align="center"
								prop="skuPrice"
								label="未划线价"
							></el-table-column>
							<el-table-column
								align="center"
								prop="inventoryActNum"
								label="活动库存"
							></el-table-column>
							<el-table-column
								align="center"
								prop="stock"
								label="实际剩余库存"
							></el-table-column>
							<el-table-column align="center" prop="limitNum" label="每人限购数量">
								<template slot-scope="scope">
									<span>
										{{
											scope.row.limitNum === -1
												? '不限制'
												: scope.row.limitNum
										}}
									</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="操作">
								<template slot-scope="scope">
									<el-button
										@click="handleClick(scope.row, scope.$index)"
										type="text"
										size="small"
									>
										编辑
									</el-button>

									<el-button
										type="text"
										size="small"
										@click.native.prevent="
											deleteSku(
												scope.$index,
												itemTemp.itemSkuList,
												ruleForm.items
											)
										"
									>
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="全场商品是否包邮：" prop="fareConfig.freeShip">
				<el-radio-group v-model.trim="ruleForm.fareConfig.freeShip">
					<el-radio :label="true">包邮</el-radio>
					<el-radio :label="false">不包邮</el-radio>
				</el-radio-group>
			</el-form-item>
			<div v-if="!ruleForm.fareConfig.freeShip">
				<el-form-item label="默认运费：" prop="fareConfig.fare">
					<el-input
						placeholder
						v-model.trim="ruleForm.fareConfig.fare"
						maxlength="3"
						size="small"
					>
						<template slot="append">
							/元
						</template>
					</el-input>
				</el-form-item>
				<div class="parallel">
					<el-form-item label="商品合计价格满：" prop="fareConfig.priceAchieve">
						<el-input
							placeholder
							v-model.trim="ruleForm.fareConfig.priceAchieve"
							maxlength="10"
							size="small"
						>
							<template slot="append">
								/元
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label-width="90px" label="运费为：" prop="fareConfig.farePrice">
						<el-input
							placeholder
							v-model.trim="ruleForm.fareConfig.farePrice"
							maxlength="3"
							size="small"
						>
							<template slot="append">
								/元
							</template>
						</el-input>
					</el-form-item>
				</div>
			</div>
			<el-form-item label="不包邮地区">
				<span>不支持包邮地区规则为独立计算，请谨慎添加</span>
			</el-form-item>
			<el-form-item label prop="fareConfig.notFreeShipInfoList">
				<template>
					<el-table :data="ruleForm.fareConfig.notFreeShipInfoList" style="width: 60%">
						<el-table-column label="地区名称（省）" prop="name" align="center">
							<template slot-scope="scope">
								<el-select
									v-model.trim="scope.row.name"
									placeholder="请选择省"
									@change="getcity()"
									size="small"
								>
									<el-option
										v-for="item in provinces"
										:key="item.n"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="运费" align="center" prop="fare">
							<template slot-scope="scope">
								<el-input
									placeholder="请输入内容"
									v-model.number="scope.row.fare"
									size="small"
									maxlength="3"
								>
									<template slot="append">
										/元
									</template>
								</el-input>
							</template>
						</el-table-column>
						<el-table-column align="center">
							<template slot="header">
								<el-button
									type="primary"
									size="mini"
									class="addBtu"
									@click="handleAdd()"
								>
									加一行
								</el-button>
							</template>
							<template slot-scope="scope">
								<el-button
									size="mini"
									type="danger"
									@click.native.prevent="deleteRow(scope.$index)"
								>
									删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
			</el-form-item>
		</el-form>
		<!-- 选择商品弹窗 -->
		<el-dialog
			center
			title="选择商品"
			:visible.sync="dialogTableVisible"
			width="1150px"
			destroy-on-close
		>
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="商品名称">
					<el-input
						v-model.trim="formInline.name"
						size="small"
						placeholder="请输入商品名称"
					></el-input>
				</el-form-item>
				<el-form-item label="类目">
					<el-cascader
						:props="catProps"
						v-model.trim="formInline.catName"
						clearable
						@change="onChangeValue"
						size="small"
					></el-cascader>
				</el-form-item>
				<el-form-item label="品牌">
					<el-select
						v-model.trim="formInline.brandId"
						placeholder="品牌名称"
						size="small"
					>
						<el-option
							v-for="item in brands"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				</el-form-item>
			</el-form>
			<div style="display: flex; justify-content: center;">
				<h4>请选择SPU（单选）</h4>
				<h4><span v-if="isShow">请选择SKU（可多选）</span></h4>
			</div>
			<el-row :gutter="12">
				<el-col :span="12">
					<Table
						:loadData="getList"
						:column="column"
						ref="goodsList"
						:select="fun"
						:single="true"
					>
						<template v-slot:cover="{ scope }">
							<el-image
								:src="scope.cover"
								class="admin_avater"
								:preview-src-list="[scope.cover]"
							/>
						</template>
					</Table>
				</el-col>
				<el-col :span="12" v-if="isShow" style="margin-top:20px">
					<el-card shadow="never" class="card" v-for="item in skuData" :key="item.id">
						<el-checkbox-group v-model="checkList" @change="onChangeVal">
							<el-checkbox :label="item.id">
								<div class="clearfix">
									<div class="block">
										<el-image
											style="width: 100%; height: 100%"
											:src="item.img ? item.img : ''"
										></el-image>
									</div>
									<div class="goods_info">
										<span>规格名称：{{ item.name }}</span>
										<p>
											<span>剩余库存： {{ item.stock }}</span>
										</p>
										<div>
											<span class="new_price">
												<span class="price_size">¥{{ item.price }}.</span>
												00
											</span>
											<span class="old_price">
												¥{{ item.originPrice }}.00
											</span>
										</div>
									</div>
								</div>
							</el-checkbox>
						</el-checkbox-group>
					</el-card>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取 消</el-button>
				<el-button type="primary" @click="onClickSkuBtu">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 修改 SPU 商品的 SKU 信息 -->
		<el-dialog
			center
			title="选择SKU商品"
			:visible.sync="SKUVisible"
			width="600px"
			destroy-on-close
		>
			<div style="max-height: 500px; overflow-y: auto;">
				<el-card shadow="never" class="card" v-for="item in skuData" :key="item.id">
					<el-checkbox-group v-model="checkList" @change="onChangeVal">
						<el-checkbox :label="item.id">
							<div class="clearfix">
								<div class="block">
									<el-image
										style="width: 100%; height: 100%"
										:src="item.img ? item.img : ''"
									></el-image>
								</div>
								<div class="goods_info">
									<span>规格名称：{{ item.name }}</span>
									<p>
										<span>剩余库存： {{ item.stock }}</span>
									</p>
									<div>
										<span class="new_price">
											<span class="price_size">¥{{ item.price }}.</span>
											00
										</span>
										<span class="old_price">¥{{ item.originPrice }}.00</span>
									</div>
								</div>
							</div>
						</el-checkbox>
					</el-checkbox-group>
				</el-card>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="SKUVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSkuClick">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 编辑SKU模态窗 -->
		<el-dialog
			center
			title="选择商品"
			:visible.sync="dialogSKUVisible"
			destroy-on-close
			width="500px"
		>
			<el-form
				:inline="true"
				:model="SkuForm"
				status-icon
				:rules="skuRules"
				ref="SkuForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="抢购价" prop="skuRushPrice">
					<el-input
						size="small"
						v-model.trim="SkuForm.skuRushPrice"
						maxlength="10"
					></el-input>
				</el-form-item>
				<el-form-item label="活动库存" prop="inventoryActNum">
					<el-input
						v-model.number="SkuForm.inventoryActNum"
						maxlength="10"
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item label="每人限购数量" prop="limitNum">
					<div>
						<el-switch
							v-model="checked"
							active-color="#13ce66"
							inactive-color="#ff4949"
							style="margin-bottom:10px"
						></el-switch>
					</div>
					<el-input
						placeholder="请输入每人限购数量"
						v-model.number="SkuForm.limitNum"
						size="small"
						maxlength="3"
						v-if="checked"
					>
						<template slot="append">
							/个
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetSkuForm('SkuForm')">取消</el-button>
				<el-button type="primary" @click="submitSkuForm('SkuForm')">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getGoods, getGoodsInfo } from '@/api/goods'
import { getAllCat } from '@/api/cat'
import { getBrand } from '@/api/brand'
import { getAllActivityInfo, addActivity, editActivityInfo } from '@/api/activity'
import { Message } from 'element-ui'
import { startEndTime } from '@/core/directives/time'
export default {
	name: 'addActivity',
	components: {
		Table,
	},
	data() {
		// 运费校检
		const checkAge = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入数值'))
			} else if (!/^[1-9]\d*|0$/.test(value)) {
				return callback(new Error('请输入大于等于零的整数'))
			} else {
				callback()
			}
		}
		const validatorPriceAchieve = (rule, value, callback) => {
			if (!/^([1-9][0-9]*)+(.[0-9]{1,2})?$/.test(value)) {
				return callback(new Error('最多允许输入两位小数的数字'))
			} else if (value === '') {
				return callback(new Error('请输入数值'))
			} else {
				callback()
			}
		}
		// 每人限购数量验证
		const validateLimitNum = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入数值'))
			} else {
				if (!/[1-9]\d*$/.test(value)) {
					callback(new Error('请输入正确的数值'))
				} else {
					callback()
				}
			}
		}
		const validateRushPrice = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请输入数值'))
			} else if (!/^[0-9]*$/.test(value)) {
				callback(new Error('请输入正确的数值'))
			} else {
				callback()
			}
		}
		return {
			checkList: [], // 选中的SKU数据列表
			ruleForm: {
				// 活动信息
				limitPromotion: {},
				// 运费信息
				fareConfig: {
					freeShip: true,
					notFreeShipInfoList: [
						{
							fare: '',
							name: '',
						},
					],
				},
				// 商品SPU和SKU信息
				items: [],
			},
			begPickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
				},
			},
			endPickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7
				},
			},
			posts: [],
			checked: false,
			rules: {
				limitPromotion: {
					title: [
						{ required: true, message: '请输入活动标题', trigger: 'blur' },
						{
							min: 2,
							max: 50,
							message: '长度在 2 到 50 个字符',
							trigger: 'blur',
						},
					],
					description: [
						{ required: true, message: '请输入活动描述', trigger: 'blur' },
						{
							min: 2,
							max: 500,
							message: '长度在 2 到 500 个字符',
							trigger: 'blur',
						},
					],
					rushBeginTime: [
						{ required: true, message: '请选择活动开始时间', trigger: 'blur' },
					],
					rushEndTime: [
						{ required: true, message: '请选择活动结束时间', trigger: 'blur' },
					],
					crowdMulti: [
						{
							validator: validateLimitNum,
							required: true,
							trigger: 'blur',
						},
					],
				},
				fareConfig: {
					fare: [{ validator: checkAge, required: true, trigger: 'blur' }],
					freeShip: [{ required: true, message: '请选择是否包邮', trigger: 'change' }],
					priceAchieve: [
						{
							validator: validatorPriceAchieve,
							required: true,
						},
					],
					farePrice: [
						{
							validator: checkAge,
							required: true,
						},
					],
				},
				items: [{ required: true, message: '请选择添加活动商品', trigger: 'blur' }],
			},
			provinces: [
				{ n: '西藏' },
				{ n: '新疆' },
				{ n: '内蒙古' },
				{ n: '青海' },
				{ n: '宁夏' },
				{ n: '海南' },
			],
			brands: [],
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
			goodsInfo: false,
			// 弹窗
			dialogTableVisible: false,
			column: [
				{
					prop: 'name',
					label: '商品名称',
					formatter: row => {
						if (row.putOn) {
							return row.name
						} else {
							return `${row.name}（已下架）`
						}
					},
				},
				{ prop: 'stock', label: '剩余库存' },
				{ prop: 'defaultPrice', label: '价格' },
				{ prop: 'cover', label: '商品图片', render: true },
			],
			formInline: {
				name: '',
				brandId: null,
				catId: null,
				parentCatId: null,
			},
			id: this.$route.query.id || null,

			isShow: false,
			goodsName: '',
			spuInfo: null,
			skuData: [],
			skuInfoForm: {},
			addGoodsList: [],
			SKUVisible: false, // 修改 SPU 商品的 SKU 信息
			itemsIndex: null, // spu 商品列表的下标
			dialogSKUVisible: false, // 编辑SKU模态窗
			// 编辑SKU 表单数据
			SkuForm: {
				inventoryActNum: null, // 活动库存
				limitNum: null, // 限购数量
				skuRushPrice: null, // sku抢购价格
				skuPrice: null, // sku现价
				stock: null, // SKU 库存
			},
			skuRules: {
				inventoryActNum: [{ validator: validateLimitNum, required: true, trigger: 'blur' }],
				skuRushPrice: [
					{
						validator: validateRushPrice,
						required: true,
						message: '请输入抢购价格',
						trigger: 'blur',
					},
				],
			},
			itemId: null, // SPU 商品id
			skuIndex: null, // SKU 列表下标
		}
	},

	mounted() {
		// 获取活动信息
		if (this.id) {
			getAllActivityInfo({ id: this.id }).then(res => {
				// console.log(res)
				if (res.success) {
					this.ruleForm = res.data

					this.goodsInfo = true
				}
			})
		}
	},
	computed: {
		// 获取商品列表
		getList() {
			return getGoods
		},
	},
	methods: {
		onChangeVal(val) {
			// 循环选中的 SKU 商品id
			this.checkList.forEach((element, index) => {
				// 循环 SKU 列表
				this.skuData.forEach(item => {
					// 如果选中的 SKU 商品的库存为 0 ，给出提示 库存不足
					if (element === item.id && item.stock < 1) {
						Message.error(`该SKU商品库存不足，请重新选择`)
						// 然后把当前选中的 SKU 商品 ID 从选中列表中删除
						this.checkList.splice(index, 1)
					}
					// if (!element.putOn) {
					// 	Message.error('该SPU商品已下架，请重新选择')
					// 	this.checkList.splice(index, 1)
					// }
				})
			})
		},
		// 弹窗
		onClickDialog() {
			this.isShow = false
			this.formInline = {}
			this.checkList = [] // 重置选中的SKU列表
			this.dialogTableVisible = true
			// 获取品牌列表
			getBrand().then(res => {
				if (res.success) {
					this.brands = res.data.list
				}
			})
		},
		// 获取选中商品的Sku信息
		fun(val) {
			console.log(val)
			if (val[0].stock < 1) {
				Message.error('该SPU商品库存不足，请重新选择')
				this.isShow = false
				return false
			}
			if (!val[0].putOn) {
				Message.error('该SPU商品已下架，请重新选择')
				this.isShow = false
				return false
			}
			this.spuInfo = val[0]
			this.checkList = [] // 重置选中的SKU列表
			this.getSkuData(val[0].id)
		},
		// 传入 SPU 商品的 id 获取该商品的 SKU 信息
		getSkuData(id) {
			getGoodsInfo({ id: id }).then(res => {
				if (res.success) {
					this.skuData = res.data
					this.isShow = true
				} else {
					this.isShow = false
				}
			})
		},
		// 修改 SPU 商品的 SKU 信息
		editClick(val, index) {
			// console.log(val)
			this.SKUVisible = true
			this.itemsIndex = index
			val.itemSkuList.forEach(element => {
				this.checkList.push(element.itemSkuId)
			})

			this.getSkuData(val.itemId)
			console.log(this.checkList)
		},
		// 修改 SKU 确定事件
		handleSkuClick() {
			console.log(this.checkList)
			let skuList = []
			if (this.checkList.length < 1) {
				Message.error('请选择SKU规格')
				return false
			} else {
				this.checkList.forEach(element => {
					this.skuData.forEach(item => {
						if (element === item.id) {
							skuList.push({
								itemSkuImage: item.img, // 关联商品 sku 图片
								itemSkuName: item.name, // 关联商品 sku 规则
								skuOriginalPrice: item.originPrice, //  sku 原价
								skuPrice: item.price, // sku 现价
								itemSkuId: item.id, // 关联商品 skuId
								properties: item.properties, // SKU的属性 【颜色:绿色;内存:64G;版本:公开版】
								stock: item.stock, // SKU 库存
								skuRushPrice: null, // sku抢购价格
								limitNum: null, // 单人限购数量，若不限制为-1
								inventoryActNum: null, // 活动库存
								itemId: item.itemId, // 商品名称
							})
						}
					})
				})
				this.ruleForm.items[this.itemsIndex].itemSkuList = skuList
				this.checkList = []
				this.SKUVisible = false
			}
		},
		// 确认选择活动商品
		onClickSkuBtu() {
			console.log(this.spuInfo)
			let tempInfo = {}
			if (!this.spuInfo) {
				Message.error('主选择SPU商品')
				return false
			} else {
				tempInfo = {
					itemCover: this.spuInfo.cover, // 商品封面图
					itemId: this.spuInfo.id, // 商品id
					itemName: this.spuInfo.name, // 商品名称
					summary: this.spuInfo.summary, // 商品简介
					itemSkuList: [],
				}
			}
			if (this.checkList.length < 1) {
				Message.error('请选择SKU规格')
				return false
			} else {
				this.checkList.forEach(element => {
					this.skuData.forEach(item => {
						if (element === item.id) {
							tempInfo.itemSkuList.push({
								itemSkuImage: item.img, // 关联商品 sku 图片
								itemSkuName: item.name, // 关联商品 sku 规则
								skuOriginalPrice: item.originPrice, //  sku 原价
								skuPrice: item.price, // sku 现价
								itemSkuId: item.id, // 关联商品 skuId
								properties: item.properties, // SKU的属性 【颜色:绿色;内存:64G;版本:公开版】
								stock: item.stock, // SKU 库存
								skuRushPrice: null, // sku抢购价格
								limitNum: null, // 单人限购数量，若不限制为-1
								inventoryActNum: null, // 活动库存
								itemId: item.itemId, // 商品名称
							})
						}
					})
				})
				this.ruleForm.items.push(tempInfo)
			}
			this.checkList = []
			this.dialogTableVisible = false
			this.goodsInfo = true
		},
		// SKU 编辑事件
		handleClick(val, index) {
			console.log(val)
			this.dialogSKUVisible = true
			// this.$refs.SkuForm.resetFields()
			this.itemId = val.itemId
			this.skuIndex = index
			this.SkuForm.skuPrice = val.skuPrice
			this.SkuForm.stock = val.stock
			this.SkuForm.inventoryActNum = val.inventoryActNum
			this.SkuForm.skuRushPrice = val.skuRushPrice
			if (val.limitNum === -1) {
				this.checked = false
				this.SkuForm.limitNum = val.limitNum
			} else if (val.limitNum === null) {
				this.checked = false
				this.SkuForm.limitNum = val.limitNum
			} else {
				this.checked = true
				this.SkuForm.limitNum = val.limitNum
			}
		},
		// SKU 编辑模态窗确定事件
		submitSkuForm(formName) {
			if (!this.checked) {
				this.SkuForm.limitNum = -1
			} else {
				if (this.SkuForm.limitNum === null) {
					Message.error('请输入限购数量')
					return false
				} else if (!/^[1-9]\d*$/.test(this.SkuForm.limitNum)) {
					Message.error('请输入大于等于零的整数')
					return false
				}
			}
			console.log(this.SkuForm)
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.SkuForm.skuPrice < this.SkuForm.skuRushPrice) {
						this.$message.error('抢购价格不能大于未划线价格')
						return false
					}
					if (this.SkuForm.stock < this.SkuForm.inventoryActNum) {
						this.$message.error('活动库存不能大于SKU商品库存')
						return false
					}
					this.ruleForm.items.forEach(element => {
						console.log(element)
						if (element.itemId === this.itemId) {
							element.itemSkuList[
								this.skuIndex
							].inventoryActNum = this.SkuForm.inventoryActNum
							element.itemSkuList[this.skuIndex].limitNum = this.SkuForm.limitNum
							element.itemSkuList[
								this.skuIndex
							].skuRushPrice = this.SkuForm.skuRushPrice
						}
					})
					Message.success('添加成功！！')
					this.dialogSKUVisible = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// SKU 编辑模态窗取消事件
		resetSkuForm(formName) {
			this.$refs[formName].resetFields()
			this.dialogSKUVisible = false
		},
		// 删除 SKU 列表商品
		deleteSku(index, rows, data) {
			if (rows.length < 2) {
				// 如果 SKU 列表的长度小于2，就直接将将当前 SPU 商品删除
				for (let i = 0; i < data.length; i++) {
					if (data[i].itemId === rows[index].itemId) {
						data.splice(i, 1)
						break
					}
				}
			} else {
				// 否则删除 当前的 SKU 商品
				rows.splice(index, 1)
			}
		},
		// 删除选择的 SPU 商品
		deleteClick(index) {
			this.ruleForm.items.splice(index, 1)
		},
		// 删除行
		deleteRow(index, rows) {
			// rows.splice(index, 1);
			this.ruleForm.fareConfig.notFreeShipInfoList.splice(index, 1)
		},
		// 添加行
		handleAdd() {
			if (
				this.ruleForm.fareConfig.notFreeShipInfoList &&
				this.ruleForm.fareConfig.notFreeShipInfoList.length
			) {
				this.ruleForm.fareConfig.notFreeShipInfoList.push({
					fare: '',
					name: '',
				})
			} else {
				this.ruleForm.fareConfig.notFreeShipInfoList = [{ name: '', fare: '' }]
			}
		},
		getcity() {},
		// 确定保存
		submitForm(formName) {
			if (this.ruleForm.items.length > 0) {
				let newItems = this.ruleForm.items
				for (let i = 0; i < newItems.length; i++) {
					const itemSkuList = newItems[i].itemSkuList
					for (let j = 0; j < itemSkuList.length; j++) {
						if (itemSkuList[j].skuRushPrice === null) {
							Message.error('请检查SKU列表，编辑填写SKU抢购信息')
							return false
						} else if (itemSkuList[j].inventoryActNum === null) {
							Message.error('请检查SKU列表，编辑填写活动库存信息')
							return false
						} else if (itemSkuList[j].limitNum === null) {
							Message.error('请检查SKU列表，编辑填写单人限购信息')
							return false
						}
					}
				}
			}

			this.$refs[formName].validate(valid => {
				if (valid) {
					const tempArr = this.ruleForm.fareConfig.notFreeShipInfoList
					console.log(tempArr)
					if (tempArr.length > 0) {
						for (let i = 0; i < tempArr.length; i++) {
							if (tempArr[i].name === '') {
								this.$message.error('请选择不包邮的省份')
								return false
							} else if (tempArr[i].fare === '') {
								this.$message.error('请输入运费金额')
								return false
							} else if (!/^[1-9]\d*$/.test(tempArr[i].fare)) {
								this.$message.error('运费请输入大于零的整数')
								return false
							}
						}
					} else {
						this.$message.error('请添加不包邮地区信息')
						return false
					}
					if (
						this.ruleForm.limitPromotion.rushBeginTime >
						this.ruleForm.limitPromotion.rushEndTime
					) {
						this.$message.error('活动结束时间不能小于活动开始时间')
						return false
					}

					if (this.id) {
						// 编辑
						editActivityInfo({
							limitPromotion: this.ruleForm.limitPromotion,
							fareConfig: this.ruleForm.fareConfig,
							items: this.ruleForm.items,
							id: this.id,
						}).then(res => {
							if (res.success) {
								Message.success('修改成功！！')
								this.$router.go(-1)
							}
						})
					} else {
						// 添加
						console.log(this.ruleForm)
						addActivity({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success('添加成功！！')
								this.$router.go(-1)
							}
						})
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},

		// 选择类目ID
		onChangeValue(value) {
			this.formInline.catId = value[1]
			this.formInline.parentCatId = value[0]
		},
		// 查询
		onClickSearch() {
			console.log(this.formInline)
			delete this.formInline.catName
			this.$refs.goodsList.update({ ...this.formInline })
		},
	},
}
</script>

<style lang="scss" scoped>
.addActivity {
	padding: 20px;
}
.parallel {
	display: flex;
}
.box-card {
	width: 40%;
	position: relative;
}
.clearfix {
	display: flex;
}
.new_price {
	color: red;
	font-weight: 600;
	margin-right: 10px;
}
.price_size {
	font-size: 18px;
}
.block {
	width: 100px;
	height: 100px;
}
.goods_info {
	flex: 1;
	margin-left: 20px;
}
.content {
	display: flex;
}
.radioGroup {
	display: flex;
	flex-direction: column;
}
.admin_avater {
	width: 60px;
	height: 50px;
}
.el-checkbox {
	display: flex;
	align-items: center;
}
.el-col-12 {
	max-height: 500px;
	overflow-y: auto;
}
h4 {
	margin: 0;
	padding-bottom: 10px;
	text-align: center;
	flex: 1;
}
.editBtu {
	position: absolute;
	right: 20px;
	bottom: 10px;
}
.item_tip {
	line-height: 24px;
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.spuName {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
.el-textarea {
	width: 400px;
}
</style>
