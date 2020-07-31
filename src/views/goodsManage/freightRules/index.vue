<template>
	<div class="freightRules">
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="0"
			class="demo-ruleForm"
		>
			<el-form-item label="全场商品是否包邮：" prop="freeShip" label-width="150px">
				<el-radio-group @change="changeRadio" v-model.trim="ruleForm.freeShip">
					<el-radio :label="true">包邮</el-radio>
					<el-radio :label="false">不包邮</el-radio>
				</el-radio-group>
			</el-form-item>
			<div v-if="!ruleForm.freeShip">
				<el-form-item label="默认运费：" prop="fare" label-width="150px">
					<el-input placeholder v-model.trim="ruleForm.fare" maxlength="3" size="small">
						<template slot="append">/元</template>
					</el-input>
				</el-form-item>
				<div class="parallel">
					<el-form-item label="商品合计价格满：" prop="priceAchieve" label-width="150px">
						<el-input
							placeholder
							maxlength="10"
							v-model.trim="ruleForm.priceAchieve"
							size="small"
						>
							<template slot="append">/元</template>
						</el-input>
					</el-form-item>
					<el-form-item label-width="90px" label="运费为：" prop="farePrice">
						<el-input
							placeholder
							v-model.trim="ruleForm.farePrice"
							maxlength="3"
							size="small"
						>
							<template slot="append">/元</template>
						</el-input>
					</el-form-item>
				</div>
			</div>
			<div class="parallel">
				<div class="text">不支持包邮：</div>
				<div>
					<el-table
						ref="filterTable"
						:data="ruleForm.notFreeShipInfoList"
						style="width:800px"
					>
						<el-table-column prop="date" label="地区名称（省）" align="center">
							<template slot-scope="scope">
								<el-form-item style="margin:0" prop="name">
									<el-select
										v-model.trim="scope.row.name"
										placeholder="请选择省"
										@change="getcity"
										size="small"
									>
										<el-option
											v-for="item in Province"
											:key="item.n"
											:label="item.n"
											:value="item.n"
										></el-option>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column label="运费" align="center" prop="fare">
							<template slot-scope="scope">
								<el-form-item style="margin:0">
									<el-input
										placeholder="请输入大于零的整数"
										v-model.number="scope.row.fare"
										maxlength="3"
										size="small"
									>
										<template slot="append">/元</template>
									</el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column align="right" width="120px">
							<template slot="header">
								<el-button @click="handleAdd" type="primary" size="small">
									加一行
								</el-button>
							</template>
							<template slot-scope="scope">
								<el-button
									@click.native.prevent="deleteRow(scope.$index)"
									type="danger"
									size="small"
								>
									移除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<el-form-item style="margin-top:20px">
				<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { getFreight, saveFreight } from '@/api/afterService'
import { isEmpty } from '@/core/directives/empty'
export default {
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
		return {
			ruleForm: {
				fare: null,
				farePrice: null,
				freeShip: false,
				notFreeShipInfoList: [],
				priceAchieve: null,
			},
			Province: [
				{ n: '西藏' },
				{ n: '新疆' },
				{ n: '内蒙古' },
				{ n: '青海' },
				{ n: '宁夏' },
				{ n: '海南' },
			],
			rules: {
				fare: [{ validator: checkAge, required: true, trigger: 'blur' }],
				freeShip: [{ required: true, message: '请选择类型', trigger: 'change' }],
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
		}
	},
	created() {
		this.getDetail()
	},
	methods: {
		getDetail() {
			getFreight().then(res => {
				if (res.code === 200) {
					// console.log(res);
					this.ruleForm = res.data || {}
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		changeRadio() {
			// if (this.ruleForm.freeShip) {
			//   this.ruleForm = {
			//     freeShip: true
			//   };
			// }
		},

		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (!this.ruleForm.freeShip && !this.ruleForm.notFreeShipInfoList) {
						this.$message.error('不支持包邮地区最少为1个')
					} else if (this.ruleForm.freeShip) {
						delete this.ruleForm.fare
						delete this.ruleForm.farePrice
						delete this.ruleForm.priceAchieve
					}
					const tempArr = this.ruleForm.notFreeShipInfoList
					if (tempArr.length > 0) {
						for (let index = 0; index < tempArr.length; index++) {
							if (tempArr[index].name === '') {
								this.$message.error('请选择不包邮的省份')
								return false
							} else if (tempArr[index].fare === '') {
								this.$message.error('请输入运费金额')
								return false
							} else if (!/^[1-9]\d*$/.test(tempArr[index].fare)) {
								this.$message.error('运费请输入大于零的整数')
								return false
							}
						}
					} else {
						this.$message.error('请添加不包邮地区信息')
						return false
					}
					saveFreight(this.ruleForm).then(res => {
						if (res.code === 200) {
							this.$message.success('操作成功')
						} else {
							this.$message.error(res.msg)
						}
					})

					// alert("submit!");
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		deleteRow(index, rows) {
			// rows.splice(index, 1);
			this.ruleForm.notFreeShipInfoList.splice(index, 1)
		},
		handleAdd() {
			if (this.ruleForm.notFreeShipInfoList && this.ruleForm.notFreeShipInfoList.length) {
				this.ruleForm.notFreeShipInfoList.push({
					fare: '',
					name: '',
				})
			} else {
				this.ruleForm.notFreeShipInfoList = [{ name: '', fare: '' }]
			}
		},
		getcity() {},
	},
}
</script>

<style>
.freightRules {
	padding: 20px;
}
.parallel {
	display: flex;
}
.text {
	width: 140px;
	margin: 0;
	padding-top: 20px;
	padding-right: 12px;
	text-align: right;
	font-size: 14px;
}
.choose {
	width: 100px;
}
</style>
