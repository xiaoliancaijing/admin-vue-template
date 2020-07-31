<!--
 * @Author: tianhao
 * @Date: 2020-06-12 16:51:28
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-10 16:07:24
 * @Descripttion: 
-->
<template>
	<div class="supplierManage">
		<el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">
			添加供应商
		</el-button>
		<Table :loadData="getList" ref="table" :column="column">
			<!-- <template v-slot:itemCount="{ scope }">
				<div class="itemName" :title="scope.itemCount">{{ scope.itemCount }}</div>
			</template> -->
		</Table>
		<el-dialog
			:title="isAdd ? '新增' : '编辑'"
			:visible.sync="dialogVisible"
			:destroy-on-close="true"
			width="60%"
			@close="handleCel"
			custom-class="dialogStyle"
		>
			<el-form
				:model="ruleForm"
				:rules="rules"
				ref="ruleForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<div class>
					<el-form-item label="供应商名称" prop="name">
						<el-input
							maxlength="40"
							v-model.trim="ruleForm.name"
							placeholder="请输入内容"
							size="small"
						></el-input>
						<!-- <UpLoad :width="1080" :height="1080" :size="400" /> -->
					</el-form-item>
				</div>
				<div style="display:flex">
					<el-card class="box-card card">
						<div slot="header" class="clearfix">
							<span>发货地址</span>
						</div>
						<div>
							<el-form-item label="发货人" prop="senderName">
								<el-input
									maxlength="20"
									v-model.trim="ruleForm.senderName"
									placeholder="请输入内容"
									size="small"
								></el-input>
							</el-form-item>
							<el-form-item label="手机号" prop="senderPhone">
								<el-input
									v-model.trim="ruleForm.senderPhone"
									placeholder="请输入内容"
									size="small"
									maxlength="11"
								></el-input>
							</el-form-item>
							<el-form-item label="发货地" required :label-width="'100px'">
								<el-select
									v-model.trim="ruleForm.senderProvince"
									placeholder="选择省"
									@change="getcity"
									size="small"
								>
									<el-option
										v-for="item in cityInfo"
										:key="item.c"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
								<el-select
									v-model.trim="ruleForm.senderCity"
									placeholder="请选择市"
									@change="getarea"
									size="small"
								>
									<el-option
										v-for="item in cityList"
										:key="item.c"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
								<el-select
									v-model.trim="ruleForm.senderArea"
									@change="getAreaCode"
									placeholder="请选择区"
									size="small"
								>
									<el-option
										v-for="item in areaList"
										:key="item.c"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="详细地址" prop="senderDetail">
								<el-input
									maxlength="100"
									type="textarea"
									v-model.trim="ruleForm.senderDetail"
									placeholder="请输入内容"
									size="small"
								></el-input>
							</el-form-item>
						</div>
					</el-card>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>收货地址</span>
						</div>
						<div>
							<el-form-item label="收货人" prop="receiverName">
								<el-input
									maxlength="20"
									v-model.trim="ruleForm.receiverName"
									placeholder="请输入内容"
									size="small"
								></el-input>
							</el-form-item>
							<el-form-item label="手机号" prop="receiverPhone">
								<el-input
									v-model.trim="ruleForm.receiverPhone"
									placeholder="请输入内容"
									size="small"
									maxlength="11"
								></el-input>
							</el-form-item>
							<el-form-item label="收货地" required prop>
								<el-select
									v-model.trim="ruleForm.receiverProvince"
									placeholder="选择省"
									@change="getReceiverCity"
									size="small"
								>
									<el-option
										v-for="item in cityInfo"
										:key="item.c"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
								<el-select
									v-model.trim="ruleForm.receiverCity"
									placeholder="请选择市"
									@change="getReceiverArea"
									size="small"
								>
									<el-option
										v-for="item in receiverCityList"
										:key="item.c"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
								<el-select
									@change="getreceiverAreaCode"
									v-model.trim="ruleForm.receiverArea"
									placeholder="请选择区"
									size="small"
								>
									<el-option
										v-for="item in receiverAreaList"
										:key="item.c"
										:label="item.n"
										:value="item.n"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="详细地址" prop="receiverDetail">
								<el-input
									maxlength="100"
									type="textarea"
									v-model.trim="ruleForm.receiverDetail"
									placeholder="请输入内容"
									size="small"
								></el-input>
							</el-form-item>
						</div>
					</el-card>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCel">取 消</el-button>
				<el-button type="primary" @click="handleOk('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { getList, addSupplier, editSupplier } from '@/api/supplier'
import { parseTime } from '@/utils'
import { cityInfo, areaInfo } from '@/utils/area'
import { parse } from 'path-to-regexp'
import { Divider } from 'element-ui'
export default {
	components: {
		Table,
	},
	data() {
		// 手机号验证
		const validatePhone = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入手机号'))
			} else {
				if (!/^1[3456789]\d{9}$/.test(value)) {
					callback(new Error('请输入正确的手机号'))
				} else {
					callback()
				}
			}
		}
		return {
			column: [
				{ prop: 'name', label: '供应商名称' },
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'itemCount', label: '关联商品数' },
				{
					prop: 'brandList',
					label: '关联品牌',
					formatter: (row, column) => {
						let str = row.brandList.toString()
						return (
							<div>
								<el-tooltip content={str} placement="top">
									<div>{row.brandList.toString()}</div>
								</el-tooltip>
							</div>
						)
					},
				},
				{ prop: 'senderDetail', label: '发货地址' },
				{ prop: 'receiverDetail', label: '退货地址' },
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.dialogVisible = true
								this.isAdd = false
								this.ruleForm = { ...val }
								if (this.ruleForm.senderProvince) {
									this.getcity()
									if (this.ruleForm.senderCity) {
										this.getarea()
									}
								}
								if (this.ruleForm.receiverProvince) {
									this.getReceiverCity()
									if (this.ruleForm.receiverCity) {
										this.getReceiverArea()
									}
								}
							},
						},
					],
				},
			],
			dialogVisible: false,
			isAdd: false, //是否新增
			ruleForm: {
				senderProvince: '',
				senderCity: '',
				senderArea: '',
				receiverProvince: '',
				receiverCity: '',
				receiverArea: '',
				senderCode: '',
				receiverCode: '',
			},
			rules: {
				name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
				senderName: [{ required: true, message: '请输入发货人', trigger: 'blur' }],
				senderPhone: [
					{ required: true, message: '请输入手机号', trigger: 'change' },
					{ validator: validatePhone, trigger: 'change' },
				],
				senderDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
				receiverName: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
				receiverPhone: [
					{ required: true, message: '请输入手机号', trigger: 'change' },
					{ validator: validatePhone, trigger: 'change' },
				],
				receiverDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
			},
			cityInfo: cityInfo,
			cityList: [],
			receiverCityList: [],
			areaList: [],
			receiverAreaList: [],
		}
	},
	created() {
		// this.getList();
	},
	computed: {
		getList() {
			return getList
		},
	},
	watch: {
		'ruleForm.senderProvince': {
			handler(newVal, oldVal) {
				if (this.ruleForm.senderCity) {
					if (newVal !== oldVal && oldVal) {
						this.ruleForm.senderCity = ''
					}
				}
			},
		},
		'ruleForm.senderCity': {
			handler(newVal, oldVal) {
				if (this.ruleForm.senderArea) {
					if (newVal !== oldVal && oldVal) {
						this.ruleForm.senderArea = ''
					}
				}
			},
		},
		'ruleForm.receiverProvince': {
			handler(newVal, oldVal) {
				if (this.ruleForm.receiverCity) {
					if (newVal !== oldVal && oldVal) {
						this.ruleForm.receiverCity = ''
					}
				}
			},
		},
		'ruleForm.receiverCity': {
			handler(newVal, oldVal) {
				if (this.ruleForm.receiverArea) {
					if (newVal !== oldVal && oldVal) {
						this.ruleForm.receiverArea = ''
					}
				}
			},
		},
	},
	methods: {
		handleCel() {
			this.ruleForm = {}
			this.dialogVisible = false
		},
		// initialization () {
		//   this.$refs['ruleForm'].resetFields()
		// },

		getcity() {
			this.cityInfo.forEach(item => {
				if (item.n === this.ruleForm.senderProvince) {
					this.ruleForm.senderProvinceCode = item.c
				}
			})
			this.cityList = []
			this.areaList = []
			if (this.ruleForm.senderProvince) {
				this.cityInfo.forEach((item, index) => {
					if (this.ruleForm.senderProvinceCode == item.c) {
						this.cityList = item.s
					}
				})
			}
		},
		getReceiverCity() {
			for (let i = 0; i < this.cityInfo.length; i++) {
				if (this.cityInfo[i].n === this.ruleForm.receiverProvince) {
					this.ruleForm.receiverProvinceCode = this.cityInfo[i].c
					break
				}
			}
			this.receiverCityList = []
			this.receiverAreaList = []
			if (this.ruleForm.receiverProvince) {
				this.cityInfo.forEach((item, index) => {
					if (this.ruleForm.receiverProvinceCode == item.c) {
						this.receiverCityList = item.s
					}
				})
			}
		},
		getReceiverArea() {
			this.cityInfo.forEach(item => {
				if (item.n === this.ruleForm.receiverProvince) {
					item.s.forEach(items => {
						if (items.n === this.ruleForm.receiverCity) {
							this.ruleForm.receiverCityCode = items.c
						}
					})
				}
			})
			let str = this.ruleForm.receiverCityCode
			this.receiverAreaList = areaInfo[str]
		},
		getarea() {
			this.cityInfo.forEach(item => {
				if (item.n === this.ruleForm.senderProvince) {
					item.s.forEach(items => {
						if (items.n === this.ruleForm.senderCity) {
							this.ruleForm.senderCityCode = items.c
						}
					})
				}
			})
			let str = this.ruleForm.senderCityCode
			this.areaList = areaInfo[str]
		},
		getAreaCode() {
			this.areaList.forEach(item => {
				if (item.n === this.ruleForm.senderArea) {
					this.ruleForm.senderAreaCode = item.c
				}
			})
		},
		getreceiverAreaCode() {
			this.areaList.forEach(item => {
				if (item.n === this.ruleForm.receiverArea) {
					this.ruleForm.receiverAreaCode = item.c
				}
			})
		},
		handleOk(formName) {
			let params = { ...this.ruleForm }
			params.senderCode = `${params.senderProvinceCode}-${params.senderCityCode}-${
				params.senderAreaCode
			}`
			params.receiverCode = `${params.receiverProvinceCode}-${params.receiverCityCode}-${
				params.receiverAreaCode
			}`
			delete params.receiverAreaCode
			delete params.receiverCityCode
			delete params.receiverProvinceCode
			delete params.senderAreaCode
			delete params.senderCityCode
			delete params.senderProvinceCode
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.isAdd) {
						addSupplier(params).then(res => {
							if (res.code === 200) {
								this.dialogVisible = false
								this.$message.success('操作成功')
								this.$refs.table.reset()
								this.ruleForm = {}
							} else {
								this.$message.error(res.msg)
							}
						})
					} else {
						editSupplier(params).then(res => {
							if (res.code === 200) {
								this.dialogVisible = false
								this.$message.success('操作成功')
								this.$refs.table.reset()
								this.ruleForm = {}
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
		handleAdd() {
			this.isAdd = true
			this.dialogVisible = true
		},
	},
}
</script>

<style lang="scss" scoped>
.supplierManage {
	padding: 20px;
}
.midInput {
	display: flex;
	justify-content: center;
	align-items: center;
}
.card {
	margin-right: 20px;
}
.el-select {
	margin-bottom: 10px;
}
</style>
