<!--
 * @Author: 刘家辰
 * @Date: 2020-07-01 10:40:32
 * @LastEditTime: 2020-07-13 16:26:34
 * @LastEditors: peng.wan
 * @Description: 添加假评论
-->
<template>
	<div>
		<el-card :body-style="{ padding: '20px' }">
			<el-form
				:model="addForm"
				ref="addForm"
				:rules="rules"
				class="addForm"
				label-width="150px"
			>
				<el-form-item label="用户头像：" prop="avatar">
					<CropperImg v-model.trim="addForm.avatar" />
				</el-form-item>
				<el-form-item label="用户昵称：" prop="userNickName">
					<el-input v-model.trim="addForm.userNickName" maxlength="40" size="small" />
				</el-form-item>
				<el-form-item label="物流速度：" prop="expressSpeedStar">
					<el-rate class="rate" v-model.trim="addForm.expressSpeedStar"></el-rate>
				</el-form-item>
				<el-form-item label="商品满意度：" prop="itemStar">
					<el-rate class="rate" v-model.trim="addForm.itemStar"></el-rate>
				</el-form-item>
				<el-form-item label="评价描述：" prop="content">
					<el-input
						type="textarea"
						placeholder="请输入评价："
						v-model.trim="addForm.content"
					/>
				</el-form-item>
				<el-form-item label="评价图片：" prop="srcs">
					<CropperImg v-model.trim="addForm.srcs" :limit="6" />
				</el-form-item>
				<el-form-item label="选择商品：">
					<el-button size="small" type="primary" @click="dialogTableVisible = true">
						请选择
					</el-button>
					<div class="clearfix" v-if="goodsInfo">
						<div class="block">
							<el-image
								style="width: 100%; height: 100%"
								:src="goods.cover"
							></el-image>
						</div>
						<div class="goods_info">
							<span>商品名称：{{ goods.name }}</span>
							<p>
								<span>剩余库存： {{ goods.stock }}</span>
							</p>
							<div>
								<span class="new_price">
									<span class="price_size">
										¥{{ goods.defaultPrice || null }}.
									</span>
									00
								</span>
								<span class="old_price">
									¥{{ goods.defaultOriginPrice || null }}.00
								</span>
							</div>
							<div>
								<span>{{ JSON.parse(skuInfo || '{}').skuName }}</span>
							</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="发布时间：" prop="time">
					<el-date-picker
						v-model.trim="addForm.time"
						type="datetime"
						placeholder="选择日期"
						value-format="timestamp"
					></el-date-picker>
				</el-form-item>
			</el-form>
			<span class="btn_margin">
				<el-button
					type="primary"
					@click="() => this.$router.push('/operation/commentManagement')"
					size="small"
				>
					取消
				</el-button>
				<el-button type="primary" @click="sendComment" size="small">发布评论</el-button>
			</span>
		</el-card>
		<!-- 选择商品弹窗 -->
		<el-dialog
			center
			title="选择商品"
			v-if="dialogTableVisible"
			:visible.sync="dialogTableVisible"
			width="1150px"
		>
			<el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
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
				<el-form-item>
					<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				</el-form-item>
			</el-form>
			<el-row :gutter="12">
				<el-col :span="14" style="height: 500px;overflow-y: auto;">
					<Table
						:loadData="getList"
						:column="column"
						ref="goodsList"
						:select="fun"
						:single="true"
					>
						<template v-slot:cover="{ scope }">
							<img :src="scope.cover" class="admin_avater" />
						</template>
					</Table>
				</el-col>
				<el-col :span="10" v-if="isShow" style="margin-top:20px">
					<el-card shadow="never" class="card">
						<div class="clearfix">
							<div class="block">
								<el-image
									style="width: 100%; height: 100%"
									:src="goods.cover"
								></el-image>
							</div>
							<div class="goods_info">
								<span>商品名称：{{ goods.name || '' }}</span>
								<p>
									<span>剩余库存： {{ JSON.parse(skuInfo || '{}').stock }}</span>
								</p>
								<div>
									<span class="new_price">
										<span class="price_size">
											¥{{ JSON.parse(skuInfo || '{}').price }}.
										</span>
										00
									</span>
									<span class="old_price">
										¥{{ JSON.parse(skuInfo || '{}').originPrice }}.00
									</span>
								</div>
								<p>
									<span>{{ JSON.parse(skuInfo || '{}').skuName }}</span>
								</p>
							</div>
						</div>
						<p>sku选择:</p>
						<el-radio-group
							v-model="skuInfo"
							@change="ocChangeRadio"
							class="radioGroup"
						>
							<el-radio
								style="margin-bottom:10px"
								v-for="item in skuData"
								:key="'skuData' + item.skuId"
								:label="
									JSON.stringify({
										skuName: item.name,
										skuId: item.id,
										originPrice: item.originPrice,
										price: item.price,
									})
								"
							>
								{{ item.skuName }}
							</el-radio>
						</el-radio-group>
					</el-card>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false" type="primary" size="small">
					取 消
				</el-button>
				<el-button type="primary" size="small" @click="onClickSkuBtu">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import CropperImg from '@/components/cropperImg/index'
import { getGoods, getGoodsInfo } from '@/api/goods'
import { getAllCat } from '@/api/cat'
import Table from '@/components/Table'
import { createComment } from '@/api/comment'
import { Message } from 'element-ui'
export default {
	components: {
		CropperImg,
		Table,
	},
	data() {
		return {
			column: [
				{ prop: 'name', label: '商品名称' },
				{ prop: 'stock', label: '剩余库存' },
				{ prop: 'defaultPrice', label: '价格' },
				{ prop: 'cover', label: '商品图片', render: true },
			],
			addVisible: false, //添加评论模态窗
			goodsInfo: false, //是否已选择商品
			addForm: {
				avatar: '',
				userNickName: '',
				expressSpeedStar: 0,
				itemStar: 0,
				content: '',
				srcs: '',
				time: '',
				item: {},
			},
			formInline: {
				name: '',
				brandId: null,
				catId: null,
				parentCatId: null,
			},
			dialogTableVisible: false,
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
			brands: [],
			isShow: false,
			skuData: [],
			skuInfo: '',
			goods: {},
			rules: {
				avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
				userNickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
				expressSpeedStar: [
					{ required: true, message: '物流满意度不能为空', trigger: 'blur' },
				],
				itemStar: [{ required: true, message: '商品满意度不能为空', trigger: 'blur' }],
				content: [{ required: true, message: '评价描述不能为空', trigger: 'blur' }],
				images: [{ required: true, message: '评价图片不能为空', trigger: 'blur' }],
				createTime: [{ required: true, message: '发布时间不能为空', trigger: 'blur' }],
				// itemName: [{ required: true, message: '商品不能为空' }],
				srcs: [{ required: true, message: '请选择评价图片', trigger: 'blur' }],
				time: [{ required: true, message: '请选择发布时间', trigger: 'blur' }],
			},
		}
	},
	computed: {
		// 获取商品列表
		getList() {
			return getGoods
		},
	},
	methods: {
		sendComment() {},
		// 选择类目ID
		onChangeValue(value) {
			this.formInline.catId = value[1]
			this.formInline.parentCatId = value[0]
			delete this.formInline.catName
		},
		// 查询
		onClickSearch() {
			this.$refs.goodsList.update({ ...this.formInline })
		},
		// 确认选择活动商品
		onClickSkuBtu() {
			this.dialogTableVisible = false
			this.goodsInfo = true
			this.addForm.item = this.goods
		}, // 获取选中商品的Sku信息
		// 获取选中商品的Sku信息
		fun(val) {
			if (val.length > 0) {
				this.isShow = true
			} else {
				this.isShow = false
			}
			this.goods = val[0]
			getGoodsInfo({ id: val[0].id }).then(res => {
				if (res.success) {
					let arr = []
					this.skuInfo = JSON.stringify({
						skuName: res.data[0].name,
						skuId: res.data[0].id,
						originPrice: res.data[0].originPrice,
						price: res.data[0].price,
						stock: res.data[0].stock,
					})
					res.data.forEach(item => {
						let obj = {
							skuName: item.name,
							skuId: item.id,
							originPrice: item.originPrice,
							price: item.price,
							stock: item.stock,
						}
						arr.push({ ...item, ...obj })
					})
					this.skuData = arr
				}
			})
		},
		// 选择sku规格
		ocChangeRadio(value) {
			console.log(value)
			this.skuInfo = value
		},
		sendComment() {
			this.$refs.addForm.validate(valid => {
				console.log(this.addForm)
				if (valid) {
					let str = ''
					let { item } = this.addForm
					this.addForm.srcs.forEach(item => {
						str += item + ','
					})
					if (this.addForm.expressSpeedStar < 1) {
						Message.error('请选择物流速度评分！！！！！')
						return false
					}
					if (this.addForm.itemStar < 1) {
						Message.error('请选择商品满意度！！！！！')
						return false
					}
					if (!this.addForm.item.name) {
						Message.error('请选择商品！！！！！')
						return false
					}
					let skuInfo = JSON.parse(this.skuInfo)
					this.addForm.images = str
					this.addForm.itemId = item.id
					this.addForm.itemImg = item.cover
					this.addForm.itemName = item.name
					this.addForm.createTime = this.addForm.time
					this.addForm.skuName = skuInfo.skuName
					this.addForm.price = skuInfo.price
					this.addForm.originPrice = skuInfo.originPrice
					delete this.addForm.item
					delete this.addForm.time
					delete this.addForm.srcs
					console.log(this.addForm)
					createComment(this.addForm).then(res => {
						if (res.success) {
							Message.success('添加成功！')
							this.$router.push('/operation/commentManagement')
						}
					})
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.addForm {
	width: 800px;
}
.addActivity {
	padding: 20px;
}
.parallel {
	display: flex;
}
.box-card {
	width: 40%;
}
.clearfix {
	display: flex;
}
.new_price {
	color: red;
	font-weight: 600;
}
.price_size {
	font-size: 18px;
}
.block {
	width: 200px;
	height: 200px;
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
.card {
	width: 450px;
	position: fixed;
	max-height: 500px;
	overflow-y: auto;
}
.el-row {
	height: 500px;
	overflow-y: auto;
}
.btn_margin {
	margin: 0 auto;
	display: block;
	width: 200px;
}
.el-rate {
	line-height: 50px;
}
</style>
