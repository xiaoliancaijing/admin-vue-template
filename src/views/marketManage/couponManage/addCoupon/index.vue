<!--
 * @Author: peng.wan
 * @Date: 2020-06-28 14:43:54
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-09 15:29:03
 * @Descripttion: 
-->
<template>
	<div class="addCoupon">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-form-item label="优惠券名称" prop="name" label-width="150px">
				<el-input
					v-model.trim="ruleForm.name"
					placeholder="请输入优惠券名称"
					maxlength="30"
				></el-input>
			</el-form-item>
			<el-form-item label="优惠券描述" prop="description" label-width="150px">
				<el-input
					type="textarea"
					v-model.trim="ruleForm.description"
					style="width:185px"
					placeholder="请输入优惠券描述"
					maxlength="500"
				></el-input>
			</el-form-item>
			<!-- <el-form-item label="优惠券类型" prop="couponType">
				<el-radio-group v-model="ruleForm.couponType">
					<el-radio label="品类满减券"></el-radio>
				</el-radio-group>
			</el-form-item> -->
			<el-form-item label="优惠券内容" required label-width="150px">
				<div class="flex-row">
					<el-form-item label="购物消费每满" prop="fullPrice">
						<el-input
							v-model.number="ruleForm.fullPrice"
							maxlength="10"
							placeholder="请输入消费金额"
						>
							<template slot="append">
								/元
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="减" prop="subtractPrice">
						<el-input
							v-model.number="ruleForm.subtractPrice"
							maxlength="10"
							placeholder="请输入减免金额"
						>
							<template slot="append">
								/元
							</template>
						</el-input>
					</el-form-item>
				</div>
			</el-form-item>
			<el-form-item label="优惠券规则" required label-width="150px">
				<div class="userLimitAmount">
					<el-form-item label="限领规则" prop="userLimitAmount">
						<span>每人限领</span>
						<el-input
							v-model.number="ruleForm.userLimitAmount"
							placeholder="请输入每人限领次数"
							maxlength="5"
						>
							<template slot="append">
								/次
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="参与活动" prop="limitPromotionFlag">
						<el-checkbox
							label="限时抢购"
							v-model.trim="ruleForm.limitPromotionFlag"
							name="type"
						></el-checkbox>
					</el-form-item>
				</div>
			</el-form-item>

			<el-form-item label="优惠券有效期" prop="time" label-width="150px">
				<el-date-picker
					v-model.trim="ruleForm.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
					@change="onChangeTime"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="优惠券数量" prop="totalAmount" label-width="150px">
				<el-input
					v-model.number="ruleForm.totalAmount"
					placeholder="请输入优惠券数量"
					maxlength="5"
				></el-input>
			</el-form-item>
			<el-form-item label="适用商品" prop="itemName" label-width="150px">
				<el-button type="primary" size="small" @click="chooseGoods('formInline')">
					请选择
				</el-button>
				<p>
					品类优惠券仅允许适用一个商品，若需增加新的商品，请创建新的优惠券
				</p>
				<el-card shadow="hover" class="box-card" v-if="ruleForm.itemName">
					<div slot="header" class="clearfix">
						<span>商品名称：{{ ruleForm.itemName }}</span>
						<el-button
							style="float: right; padding: 3px 0"
							icon="el-icon-delete"
							@click="deleteBtu"
						></el-button>
					</div>
					<div>
						商品图片
						<img :src="ruleForm.itemImg" class="image" />
					</div>
				</el-card>
			</el-form-item>

			<el-form-item label-width="150px">
				<el-button @click="resetForm('ruleForm')">取消</el-button>
				<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
			</el-form-item>
		</el-form>

		<!-- 选择商品 -->
		<el-dialog
			center
			title="选择商品"
			v-if="dialogTableVisible"
			:visible.sync="dialogTableVisible"
			width="60%"
		>
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="商品名称">
					<el-input
						v-model.trim="formInline.name"
						size="small"
						placeholder="请输入商品名称"
						maxlength="30"
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
			<Table
				:loadData="getList"
				:column="column"
				ref="goodsList"
				:select="fun"
				:single="true"
				style="height: 500px;overflow-y: auto;"
			>
				<template v-slot:cover="{ scope }">
					<img :src="scope.cover" class="admin_avater" />
				</template>
			</Table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelBtu('formInline')">取 消</el-button>
				<el-button type="primary" @click="onClickSkuBtu">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getAllCat } from '@/api/cat'
import { getGoods, getGoodsInfo } from '@/api/goods'
import { getBrand } from '@/api/brand'
import { addCoupon, getCouponInfo, editCoupon } from '@/api/coupon'
import { Message } from 'element-ui'
export default {
	name: 'addCoupon',
	components: {
		Table,
	},
	data() {
		const checkNumber = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入数值'))
			} else {
				if (!/^\+?[1-9][0-9]*$/.test(value)) {
					callback(new Error('请输入大于零的整数'))
				} else {
					if (!Number.isInteger(value)) {
						callback(new Error('请输入数字值'))
					} else {
						callback()
					}
				}
			}
		}
		return {
			ruleForm: {
				endTime: null, // 有效期结束时间
				startTime: null, // 有效期开始时间
				subtractPrice: null, // 减免金额
				totalAmount: null, // 优惠券数量
				lastAmount: null, // 优惠剩余数量
				userLimitAmount: null, //每人限领数量
				limitPromotionFlag: false, //是否允许参加限时抢购
				itemName: '', // 商品名称
				name: '', // 优惠券名称
				itemImg: '', // 商品图片
				itemId: null, // 商品ID
				fullPrice: null, // 满足金额
				description: '', // 描述
				itemOriginPrice: null, // 商品原价
				itemPrice: null, // 商品现价
			},
			formInline: {
				name: '',
				brandId: null,
				catId: null,
				parentCatId: null,
			},
			dialogTableVisible: false,
			column: [
				{ prop: 'name', label: '商品名称' },
				{ prop: 'stock', label: '剩余库存' },
				{ prop: 'defaultPrice', label: '价格' },
				{ prop: 'cover', label: '商品图片', render: true },
			],
			isShowGoodsInfo: false,
			rules: {
				name: [
					{ required: true, message: '请输入优惠券名称', trigger: 'blur' },
					{ min: 1, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' },
				],
				description: [
					{ required: true, message: '请输入优惠券描述', trigger: 'blur' },
					{ min: 1, max: 500, message: '描述长度在500个字符内', trigger: 'blur' },
				],
				fullPrice: [
					{
						validator: checkNumber,
						trigger: 'blur',
					},
				],
				subtractPrice: [
					{
						validator: checkNumber,
						trigger: 'blur',
					},
				],
				time: [
					{
						required: true,
						message: '请选择优惠券有效时间',
						trigger: 'change',
					},
				],
				totalAmount: [
					{
						validator: checkNumber,
						required: true,
						trigger: 'blur',
					},
				],
				itemName: [{ required: true, message: '请选择适用商品', trigger: 'blur' }],
				userLimitAmount: [
					{
						validator: checkNumber,
						trigger: 'blur',
					},
				],
				// limitPromotionFlag: [{ message: '请选择是否参与活动', trigger: 'blur' }],
			},
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
			id: this.$route.query.id || null,
		}
	},
	mounted() {
		// 编辑的时候获取优惠券详情
		if (this.id) {
			getCouponInfo({ id: this.id }).then(res => {
				if (res.success) {
					this.ruleForm = res.data
					this.ruleForm.time = [res.data.startTime, res.data.endTime]
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
		// 弹窗
		chooseGoods(formName) {
			this.dialogTableVisible = true
			// this.$refs[formName].resetFields()
			this.formInline = {}
			// this.$refs.goodsList.update()
			// 获取品牌列表
			getBrand().then(res => {
				if (res.success) {
					this.brands = res.data.list
				}
			})
		},
		// 获取选中商品信息
		fun(val) {
			// if (val.length > 0) {
			// 	this.isShowGoodsInfo = true
			// } else {
			// 	this.isShowGoodsInfo = false
			// }
			this.ruleForm.itemName = val[0].name
			this.ruleForm.itemImg = val[0].cover
			this.ruleForm.itemId = val[0].id
			this.ruleForm.itemOriginPrice = val[0].defaultOriginPrice
			this.ruleForm.itemPrice = val[0].defaultPrice
		},
		// 删除所选商品
		deleteBtu() {
			this.ruleForm.itemName = ''
			this.ruleForm.itemImg = ''
			this.ruleForm.itemId = ''
		},
		// 选择类目ID
		onChangeValue(value) {
			this.formInline.catId = value[1]
			this.formInline.parentCatId = value[0]
			delete this.formInline.catName
		},
		// 查询
		onClickSearch() {
			console.log(this.formInline)
			this.$refs.goodsList.update({ ...this.formInline })
		},
		// 确认选择活动商品
		onClickSkuBtu() {
			this.dialogTableVisible = false
		},
		// 取消模态窗
		cancelBtu(formName) {
			this.$refs[formName].resetFields()
		},
		// 获取有效时间
		onChangeTime(val) {
			if (val.length > 0) {
				this.ruleForm.startTime = val[0]
				this.ruleForm.endTime = val[1]
			}
		},
		// 确认保存新增优惠券
		submitForm(formName) {
			console.log(this.ruleForm)
			this.$refs[formName].validate(valid => {
				if (valid) {
					delete this.ruleForm.time
					this.ruleForm.lastAmount = this.ruleForm.totalAmount
					if (this.ruleForm.subtractPrice > this.ruleForm.fullPrice) {
						Message.error('满减金额不能小于等于减免金额')
						return false
					}
					if (this.id) {
						// 编辑
						editCoupon({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success('优惠券修改成功')
								this.$router.go(-1)
								this.$refs[formName].resetFields()
							}
						})
					} else {
						// 新增
						addCoupon({ ...this.ruleForm }).then(res => {
							console.log(res)
							if (res.success) {
								Message.success('优惠券添加成功')
								this.$router.go(-1)
								this.$refs[formName].resetFields()
							}
						})
					}
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 取消
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.$router.go(-1)
		},
	},
}
</script>

<style lang="scss" scoped>
.addCoupon {
	padding: 20px;
}
.box-card {
	width: 300px;
}
.image {
	width: 100%;
	display: block;
}
p {
	margin: 0;
}
.admin_avater {
	width: 70px;
	height: 50px;
}
.flex-row {
	display: flex;
	.el-form-item {
		text-align: left;
		display: flex;
		margin-right: 10px;
	}
}
.userLimitAmount {
	clear: both;
	text-align: left;
}
.el-form-item .el-form-item {
	margin-bottom: 10px;
}
</style>
