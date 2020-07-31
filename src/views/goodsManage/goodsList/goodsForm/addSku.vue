<!--
 * @Author: 刘家辰
 * @Date: 2020-06-17 12:23:33
 * @LastEditTime: 2020-07-22 11:37:43
 * @LastEditors: wei.chen
 * @Description: 
-->
<template>
	<div>
		<el-form
			label-position="left"
			label-width="100px"
			class="goodsForm"
			ref="infomationForm"
			:model="infomationForm"
		>
			<el-form-item label="添加SKU" :required="true">
				<router-link
					:to="{
						path: '/goodsManage/catManage/attributeList',
						query: { id: catId, parentId: parentCatId },
					}"
					class="href"
				>
					+去添加
				</router-link>
				<div class="goods_attribute">
					<div class="goods_attribute_item">
						<el-form-item label="SKU列表"></el-form-item>
						<div v-for="(skuItem, index) in SKUList" :key="'skuItem_' + index">
							<div>{{ skuItem.name }}</div>
							<el-checkbox-group
								v-model.trim="chooseSkuItem"
								@change="handleSku(skuItem.name)"
							>
								<el-checkbox
									:label="item"
									v-for="item in skuItem.list"
									:key="'sku_' + item"
								>
									{{ item }}
								</el-checkbox>
							</el-checkbox-group>
							<el-button
								class="button-new-tag"
								size="small"
								@click="addSkuItem(skuItem, index)"
								type="primary"
								v-if="skuItem.addFlag"
							>
								+ 编辑属性
							</el-button>
						</div>
					</div>
					<el-button type="primary" size="small" @click="createSku">确认生成</el-button>
				</div>
			</el-form-item>
			<el-form-item :required="true">
				<el-table :data="SKUdata">
					<el-table-column
						:prop="item.prop"
						:label="item.label"
						v-for="item in SKUcolumn"
						:key="item.prop"
					>
						<template v-slot="scope" v-if="item.prop == 'operation'">
							<el-button
								@click.native.prevent="deleteSku(scope.$index)"
								type="text"
								size="small"
							>
								删除
							</el-button>
							<el-button
								@click.native.prevent="editSku(scope.row, scope.$index)"
								type="text"
								size="small"
							>
								编辑
							</el-button>
						</template>
						<template v-slot="scope" v-else-if="item.prop == 'img'">
							<el-image
								v-if="scope.row.img"
								:src="scope.row.img"
								:preview-src-list="[scope.row.img]"
							/>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item label="添加参数" class="catSpec_table" :required="true">
				<router-link
					:to="{
						path: '/goodsManage/catManage/parameterList',
						query: { catId: catId, parentId: parentCatId },
					}"
					class="href"
				>
					+去添加
				</router-link>
				<div class="goods_attribute">
					<div class="goods_attribute_item">
						<span class="title">参数名称</span>
						<el-input
							v-model.trim="catSpecName"
							placeholder="请输入参数名称"
							maxlength="20"
							size="small"
						></el-input>
						<el-button type="primary" size="small" @click="addCatSpec">+增加</el-button>
					</div>
					<el-table :data="catSpecList" max-height="250">
						<el-table-column prop="name" label="参数名称"></el-table-column>
						<el-table-column prop="value" label="参数描述"></el-table-column>
						<el-table-column prop label="操作">
							<template v-slot="scope">
								<el-button
									type="text"
									size="small"
									@click="editCatSpec(scope.row, scope.$index)"
								>
									编辑
								</el-button>
								<i
									class="el-icon-delete"
									@click="delCatSpec(scope.$index)"
									style="cursor:pointer"
								></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-form-item>
			<el-form-item
				label="商品详情"
				:required="true"
				prop="detail"
				:rules="{ required: true, message: '商品详情图片不能为空！' }"
			>
				<UploadImg v-model.trim="infomationForm.detail" :limit="9"></UploadImg>
			</el-form-item>
		</el-form>
		<!-- sku表格弹窗 -->
		<el-dialog
			title="编辑SKU"
			:visible.sync="skuVisible"
			:before-close="() => (skuVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle"
		>
			<el-form
				:model="skuForm"
				label-width="100px"
				class="demo-ruleForm"
				ref="skuForm"
				:required="true"
				:rules="addSkuRules"
			>
				<el-row>
					<el-col :span="10">
						<el-form-item label="划线价" prop="originPrice" required>
							<el-input
								v-model.number="skuForm.originPrice"
								maxlength="10"
								placeholder="划线价"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="未划线价" prop="price" required>
							<el-input
								v-model.number="skuForm.price"
								maxlength="10"
								placeholder="未划线价"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="商品库存" prop="stock" required>
							<el-input
								v-model.number="skuForm.stock"
								maxlength="5"
								placeholder="商品库存"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="库存预警值" prop="warningStock" required>
							<el-input
								v-model.number="skuForm.warningStock"
								maxlength="5"
								placeholder="库存预警值"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="10">
						<el-form-item label="展示图" prop="img" required>
							<CropperImg v-model.trim="skuForm.img"></CropperImg>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="skuVisible = false">取 消</el-button>
				<el-button type="primary" @click="addsku">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 参数编辑弹窗 -->
		<el-dialog
			title="编辑参数"
			:visible.sync="catSpecVisible"
			:before-close="() => (catSpecVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle"
		>
			<el-form
				v-model.trim="catSpec"
				label-width="100px"
				class="demo-ruleForm"
				:required="true"
				:rules="catSpecRules"
				:model="catSpec"
				ref="catSpec"
			>
				<el-row>
					<el-col :span="10">
						<el-form-item label="描述" prop="value" required>
							<el-input
								v-model.trim="catSpec.value"
								maxlength="30"
								placeholder="描述"
								size="small"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="catSpecVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveCatSpec">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 参数添加窗口 -->
		<el-dialog
			title="添加参数"
			:visible.sync="checkBoxVisible"
			:before-close="() => (checkBoxVisible = false)"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			custom-class="dialogStyle"
		>
			<span>{{ editcatSpec.name }}:</span>
			<el-tag
				:key="tag"
				v-for="tag in editcatSpec.list"
				closable
				:disable-transitions="false"
				@close="handleClose(tag)"
			>
				{{ tag }}
			</el-tag>
			<el-input
				class="input-new-tag"
				v-model.trim="tagValue"
				ref="saveTagInput"
				size="small"
				@keyup.enter.native="handleInputConfirm"
				@blur="handleInputConfirm"
			></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="checkBoxVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveSkuItem">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import CropperImg from '@/components/cropperImg/index'
import UploadImg from '@/components/upload/index'

import { getCatSkus, getCatSpec } from '@/api/catSpec'
import { getSku } from '@/utils'
import { Message } from 'element-ui'
export default {
	components: {
		CropperImg,
		UploadImg,
	},
	props: ['detailData'],
	data() {
		return {
			catId: 0,
			parentCatId: 0,
			listQuery: {
				pageIndex: 1,
				pageSize: 100,
			},
			SKUList: [], //规格参数  sku列表数据
			catSpecList: [], //属性参数
			skuVisible: false, //sku表格添加/编辑弹窗
			catSpecVisible: false, //参数添加/编辑弹窗
			checkBoxVisible: false, //sku编辑
			chooseSkuItem: [], //用户选择sku数据
			chooseSku: {}, //sku选择后重构数据结构
			SKUdata: [], //用户生成表单时sku数据
			SKUcolumn: [], //生成表头
			apiSKUdata: [], //编辑时保存原始sku数据 该数据不做curd操作 除非用户在表格中手动删除
			apichooseSkuItem: [], //编辑时保存的原始选中项
			SKUInput: {
				name: '',
				value: [], //新增sku属性列表
			}, //新增sku
			catSpecName: '', //添加参数名称
			prevSkuName: {}, //存储上次skuName
			infomationForm: {
				detail: [], //商品详情
			},
			skuForm: {
				index: '',
				originPrice: '',
				price: '',
				stock: '',
				warningStock: '',
				img: '',
			}, //sku弹窗
			catSpec: {
				index: '',
				name: '',
				value: '',
			},
			delKey: [], //清除过的sku属性
			tagValue: '', //sku属性tag
			editcatSpec: '', //编辑当前参数
			data: '',
			addSkuRules: {
				originPrice: {
					required: true,
					message: '输入正确的划线价，整数或小数！',
					pattern: /^\d+(\.\d+)?$/,
				},
				price: {
					required: true,
					message: '输入正确的未划线价，整数或小数！',
					pattern: /^\d+(\.\d+)?$/,
				},
				stock: {
					required: true,
					message: '请输入正确的商品库存，1-5位正整数！',
					pattern: /^[0-9]{1,5}$/,
				},
				warningStock: {
					required: true,
					message: '请输入正确的库存预警值，1-5位正整数！',
					pattern: /^[0-9]{1,5}$/,
				},
				img: {
					type: 'string',
					required: true,
					message: '展示图不能为空！',
				},
			},
			catSpecRules: {
				value: {
					type: 'string',
					required: true,
					message: '描述不能为空！',
				},
			},
		}
	},
	watch: {
		detailData(newValue, oldValue) {
			if (newValue === oldValue) {
				return false
			}
			this.data = newValue
			let { itemSkuList, specParamJSON, detail } = this.data
			this.catSpecList = JSON.parse(specParamJSON)
			let skuObj = getSku(itemSkuList)
			let arr = [] //表头
			let arr1 = detail.split(',')
			for (let i = 0; i < skuObj.handle.length / 2; i++) {
				this.handleSku(skuObj.handle[2 * i], skuObj.handle[2 * i + 1])
				this.apichooseSkuItem.push(skuObj.handle[2 * i + 1]) //保存一份原始选中项
				this.apichooseSkuItem = Array.from(new Set(this.apichooseSkuItem))
			}
			arr1.splice(arr1.length - 1, 1)
			this.infomationForm.detail = arr1
			for (let j = 0; j < itemSkuList.length; j++) {
				let arr = itemSkuList[j].name.split(' ')
				let obj = {}
				for (let i = 0; i < arr.length - 1; i++) {
					// 这里少循环一次 因为最后值为空
					obj[`sku${i}`] = arr[i]
				}
				obj.id = itemSkuList[j].id
				obj.originPrice = itemSkuList[j].originPrice
				obj.price = itemSkuList[j].price
				obj.stock = itemSkuList[j].stock
				obj.warningStock = itemSkuList[j].warningStock
				obj.img = itemSkuList[j].img
				this.SKUdata.push(obj)
				this.apiSKUdata.push(obj) //保存一份原始接口数据
			}
			//动态表头
			for (let i = 0; i < skuObj.names.length; i++) {
				let obj = {}
				obj.prop = `sku${i}`
				obj.label = skuObj.names[i]
				arr.push(obj)
			}
			this.SKUcolumn = [
				...arr,
				{
					prop: 'originPrice',
					label: '划线价',
				},
				{
					prop: 'price',
					label: '未划线价',
				},
				{
					prop: 'stock',
					label: '商品库存',
				},
				{
					prop: 'warningStock',
					label: '库存预警值',
				},
				{
					prop: 'img',
					label: '展示图',
				},
				{
					prop: 'operation',
					label: '操作',
				},
			]
		},
	},
	methods: {
		//获取sku列表
		getCatSkus(params) {
			getCatSkus({ ...this.listQuery, ...params }).then(res => {
				if (res.success) {
					this.SKUList = res.data.list.map(item => {
						return {
							name: item.name,
							list: item.value.split(','),
							addFlag: item.addFlag,
						}
					})
					this.loading = false
				}
			})
		},
		//获取参数名称
		getCatSpec(params) {
			getCatSpec({ ...this.listQuery, ...params }).then(res => {
				if (res.success) {
					this.catSpecList = res.data.list.map(item => {
						return { name: item.name }
					})
					this.loading = false
				}
			})
		},
		// 添加参数
		addCatSpec() {
			if (this.catSpecList.length == 20) {
				return Message.warning('最多添加20个属性！')
			}
			if (!this.catSpecName) {
				return Message.warning('属性名不能为空！')
			}
			this.catSpecList.forEach(item => {})
			for (let i = 0; i < this.catSpecList.length; i++) {
				const item = this.catSpecList[i]
				if (item.name === this.catSpecName) {
					return Message.warning('参数名称不允许重复！')
				}
			}
			this.catSpecList.push({
				name: this.catSpecName,
			})
			this.catSpecName = ''
		},
		// 删除参数
		delCatSpec(index) {
			this.catSpecList.splice(index, 1)
		},
		// 编辑参数描述
		editCatSpec(row, index) {
			this.catSpecVisible = true
			this.catSpec = { ...row }
			this.catSpec.index = index
		},
		// 保存参数描述
		saveCatSpec() {
			const { index, name, value } = this.catSpec
			this.$refs.catSpec.validate(valid => {
				if (valid) {
					this.catSpecList.splice(index, 1, { index, name, value })
					this.catSpec = {}
					this.catSpecVisible = false
				}
			})
		},
		// sku属性列表添加
		handleInputConfirm() {
			let inputValue = this.tagValue
			if (inputValue) {
				this.editcatSpec.list.forEach(item => {
					if (inputValue === item) {
						return Message.warning('该属性值已经存在！')
					}
				})
				this.editcatSpec.list.push(inputValue)
				this.tagValue = ''
			}
		},
		//  sku属性列表删除
		handleClose(tag) {
			this.editcatSpec.list.splice(this.tagValue.indexOf(tag), 1)
		},
		// 添加sku
		addSkuItem(skuItem, index) {
			this.checkBoxVisible = true
			this.editcatSpec = skuItem
			this.editcatSpec.index = index
		},
		saveSkuItem() {
			const { index, name, list, addFlag } = this.editcatSpec
			this.SKUList.splice(index, 1, { name, list, addFlag })
			this.checkBoxVisible = false
		},
		// 选择sku
		/**
		 * @name:
		 * @description:
		 * @param {type} skuName 选择时skuname属性 sku编辑时需要同步传递sku值进来
		 * @return:
		 */
		handleSku(skuName, sku, e) {
			//需要编辑时勾选 则打开此注释
			if (sku) {
				this.chooseSkuItem.push(sku)
			}
			let isNew = true //是否为已存在属性
			let key //已存在属性的key
			let arr = Object.keys(this.chooseSku)
			let newItem = this.chooseSkuItem[this.chooseSkuItem.length - 1] //新加的值
			let prevName = this.prevSkuName.name
			let prevValues = this.prevSkuName.values || []
			let isAdd = this.chooseSkuItem.length >= prevValues.length ? true : false //用户操作类型
			let delItem //删除的值
			if (!isAdd) {
				// 找出删除value
				prevValues.forEach(item => {
					if (this.chooseSkuItem.indexOf(item) === -1) {
						delItem = item
					}
				})
			}
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] === skuName) {
					//判断是否是存在属性
					isNew = false
					key = arr[i]
				}
			}
			if (skuName !== prevName) {
				// 属性名称改变 两次不同属性
				if (isNew) {
					//新的属性
					this.chooseSku[skuName] = [newItem]
				} else {
					// 已存在属性 排除不同的 加上之前的
					let arr = this.chooseSku[key]
					if (isAdd) {
						// 增加
						arr.push(newItem)
					} else {
						//删除
						let arr2 = arr.filter(item => {
							return item !== delItem
						})
						arr = arr2
					}
					arr = Array.from(new Set(arr))
					arr = arr.filter(item => {
						return item !== undefined
					})
					if (arr.length) {
						this.chooseSku[key] = arr
					} else {
						delete this.chooseSku[key]
					}
				}
			} else {
				// 属性名称没有改变 两次同一属性
				if (isNew) {
					if (this.delKey.indexOf(skuName) !== -1) {
						//新的属性且之前没有添加过的
						this.chooseSku[skuName] = this.chooseSkuItem
					} else {
						// 新属性之前有添加过
						this.chooseSku[skuName] = [newItem]
					}
				} else {
					// 已存在属性 排除不同的 加上之前的
					let arr = this.chooseSku[key]
					if (isAdd) {
						// 增加
						arr.push(newItem)
					} else {
						// 删除
						let arr2 = arr.filter(item => {
							return item !== delItem
						})
						arr = arr2
					}
					// 去重且过滤空
					arr = Array.from(new Set(arr))
					arr = arr.filter(item => {
						return item !== undefined
					})
					if (arr.length) {
						this.chooseSku[key] = arr
					} else {
						delete this.chooseSku[key]
					}
				}
			}
			this.chooseSkuItem = Array.from(new Set(this.chooseSkuItem))
			this.prevSkuName.values = this.chooseSkuItem
			this.prevSkuName.name = skuName
		},
		// 生成sku表格
		createSku() {
			if (!this.chooseSkuItem.length) {
				return Message.warning('请先选择SKU！')
			}
			if (
				this.apichooseSkuItem.sort().toString() !== this.chooseSkuItem.sort().toString() &&
				this.apichooseSkuItem.length > this.chooseSkuItem.length
			) {
				Message.warning('取消sku属性后,原表格中的相关数据需要手动删除！')
			}
			let emptyIndex = -1
			let skuValues = [] //value 值
			let skuKeys = [] //key 值
			let arr = [] //表头
			Object.entries(this.chooseSku).forEach(([key, value]) => {
				skuValues.push(value)
				skuKeys.push(key)
			}) //保证对象遍历出来的值为顺序一定的
			// 找出属性值为空的属性名
			skuValues.forEach((item, index) => {
				if (item.length == 0) {
					emptyIndex = index
				}
			})
			// 表头 数据生成函数
			/**
			 * @name:
			 * @description:
			 * @param {type} isRecreate 是否需要重新生成表头 将会同时清空数据
			 * @return:
			 */
			let createDate = isRecreate => {
				// 数据处理函数
				/**
				 * @name:
				 * @description:
				 * @param {type} data 表格数据
				 * @return:
				 */
				let handleskuData = data => {
					return data.map((item, index) => {
						let name = ''
						let skus = [] //sku0 sku1 sku2
						Object.keys(item).forEach(j => {
							if (/^sku/.test(j)) {
								skus.push(j)
							}
						})
						skus.forEach(y => {
							name += item[`${y}`] + ' '
						})
						return name
					})
				}
				let oldData = [] //旧sku组合数据
				let newData = [] //新sku组合数据
				let addData = [] //合并后去重的sku组合数据
				let skuArray = []
				this.handleData(skuValues).forEach(item => {
					skuArray.push(item.split(','))
				})
				if (isRecreate) {
					// 创建阶段或用户允许重新生成
					console.log('重新生成新数据++++++++++++++')
					this.SKUcolumn = [
						...arr,
						{
							prop: 'originPrice',
							label: '划线价',
						},
						{
							prop: 'price',
							label: '未划线价',
						},
						{
							prop: 'stock',
							label: '商品库存',
						},
						{
							prop: 'warningStock',
							label: '库存预警值',
						},
						{
							prop: 'img',
							label: '展示图',
						},
						{
							prop: 'operation',
							label: '操作',
						},
					]
					this.SKUdata = []
					skuArray.forEach((item, index) => {
						let obj = {}
						item.forEach((item, index) => {
							obj['sku' + index] = item
						})
						this.SKUdata.push(obj)
					})
				} else {
					console.log('合并数据++++++++++++++')
					// 编辑阶段不允许重新生成 新旧数据合并
					let _SKUdata = [...this.apiSKUdata] //计算新值 用于合并数据
					let _origunSKUdata = [...this.apiSKUdata] //初始化旧值 用于curd
					skuArray.forEach((item, index) => {
						let obj = {}
						item.forEach((item, index) => {
							obj['sku' + index] = item
						})
						_SKUdata.push(obj)
					})
					oldData = Array.from(new Set(handleskuData(_origunSKUdata)))
					newData = Array.from(new Set(handleskuData(_SKUdata)))
					// 属性新增
					addData = newData.filter(item => {
						if (oldData.indexOf(item) == -1) {
							return item
						}
					})
					for (let j = 0; j < addData.length; j++) {
						let arr = addData[j].split(' ')
						let obj = {}
						for (let i = 0; i < arr.length - 1; i++) {
							// 这里少循环一次 因为最后值为空
							obj[`sku${i}`] = arr[i]
						}
						_origunSKUdata.push(obj)
					}
					this.SKUdata = _origunSKUdata
				}
			}
			let columnLabel = [] //当前表头label字段
			let _columnLabel = [] //新选中表头label字段
			let isConfirm = false //是否提示
			skuKeys.forEach((item, index) => {
				if (index !== emptyIndex) {
					arr.push({
						prop: 'sku' + index,
						label: item,
					})
					_columnLabel.push(item)
				}
			})
			//动态表头 判断新选中表头和当前表头是否相同
			if (this.data.id) {
				// 编辑阶段
				for (let i = 0; i < this.SKUcolumn.length; i++) {
					let item = this.SKUcolumn[i]
					if (/^sku/.test(item.prop)) {
						columnLabel.push(item.label)
					}
				}
				// 判断sku是否全部删除完 如果删除完 则允许重新生成表头 否则不允许
				if (this.SKUdata.length) {
					for (let i = 0; i < this.SKUdata.length; i++) {
						if (this.SKUdata[i].id) {
							isConfirm = true
							break
						} else {
							createDate()
							isConfirm = false
							return
						}
					}
				}
				// 判断 不相同弹出提示 是否允许清空数据 重新生成表头
				if (columnLabel.sort().toString() !== _columnLabel.sort().toString()) {
					isConfirm = true
				} else {
					createDate()
					isConfirm = false
					return
				}
			} else {
				// 创建阶段
				createDate(true)
			}
			if (isConfirm) {
				this.$confirm('改变sku将会清空现有表格数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						createDate(true)
					})
					.catch(() => {})
			}
		},
		// sku动态循环
		handleData(arrs) {
			/**
			 * eg:[[红，黄，蓝]，[大，中，小]]=> //["红,大", "红,中", "红,小", "黄,大", "黄,中", "黄,小", "蓝,大", "蓝,中", "蓝,小"]
			 * 以第一项为基础,循环合并之后的每一项再循环的值
			 * @param {*} acc 累计的值
			 * @param {*} cur 当前遍历项
			 * @param {*} index 当前遍历索引
			 */
			let result = arrs.reduce((acc, cur, index) => {
				// 从第二项开始合并值
				if (index > 0) {
					let saveArr = []
					acc.forEach(item => {
						cur.forEach(subItem => {
							saveArr.push(`${item},${subItem}`)
						})
					})
					acc = saveArr
				}
				return acc
			}, arrs[0]) // 把数组的第一项传入作为初始值
			return result
		},
		// 删除表格中sku
		deleteSku(index) {
			this.$confirm('确定删除?', '提示', {
				type: 'warning',
			}).then(() => {
				this.SKUdata.splice(index, 1)
				this.apiSKUdata.splice(index, 1)
			})
		},
		// 编辑表格中sku
		editSku(row, index) {
			this.skuVisible = true
			this.skuForm = { ...row }
			this.skuForm.index = index
		},
		// 确认表格中sku修改
		addsku() {
			this.$refs.skuForm.validate(valid => {
				if (valid) {
					let { originPrice, price } = this.skuForm
					if (Number(originPrice) < Number(price)) {
						return Message.warning('未划线价应小于划线价！')
					}
					this.skuForm.originPrice = Number(originPrice).toFixed(2)
					this.skuForm.price = Number(price).toFixed(2)
					this.SKUdata.splice(this.skuForm.index, 1, this.skuForm)
					this.skuVisible = false
					this.skuForm = {}
				}
			})
		},
	},
}
</script>

<style lang="scss">
.goodsForm {
	padding-top: 50px;
	width: 60%;
	margin: 0 auto;
	.goods_attribute {
		border: 1px solid #f1f1f1;
		padding: 20px;
		width: 80%;
		.goods_attribute_item + .goods_attribute_item {
			margin-top: 20px;
		}
		.title {
			margin-bottom: 10px;
			margin-right: 20px;
		}
	}
	.el-table th {
		padding: 0;
	}
	.el-table th {
		background-color: #fafafa;
	}
	.el-table {
		width: 80%;
		max-width: 80%;
		img {
			width: 50px;
			height: 50px;
		}
	}
	.catSpec_table {
		.el-table {
			width: 100%;
			max-width: 100%;
		}
	}
	.chooseImg {
		width: 100px;
		height: 100px;
	}
}
.href {
	color: dodgerblue;
	&:hover {
		color: dodgerblue;
	}
}
</style>
