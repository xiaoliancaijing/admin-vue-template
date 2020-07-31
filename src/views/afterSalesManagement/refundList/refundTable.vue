<!--
 * @Author: peng.wan
 * @Date: 2020-06-30 15:13:21
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-09 16:34:13
 * @Descripttion: 
-->
<template>
	<div class="refundTable">
		<el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
			<el-form-item label="" prop="orderNum">
				<el-input
					placeholder="请输入订单编号"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.orderNum"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="退款申请时间" prop="regDate">
				<el-date-picker
					@change="onChangeTime"
					v-model.trim="ruleForm.regDate"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="处理状态" prop="status">
				<el-select v-model.trim="ruleForm.status" placeholder="请选择" size="small">
					<el-option
						v-for="item in handleStates"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="售后方式" prop="afterType" v-if="isShowAfterType">
				<el-select v-model.trim="ruleForm.afterType" placeholder="请选择" size="small">
					<el-option
						v-for="item in types"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="退款原因" prop="afterReasonId">
				<el-select v-model.trim="ruleForm.afterReasonId" placeholder="请选择" size="small">
					<el-option
						v-for="item in refundReasons"
						:key="item.id"
						:label="item.reason"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch">
					查询
				</el-button>
				<el-button type="primary" size="small" @click="resetForm('ruleForm')">
					重置
				</el-button>
			</el-form-item>
		</el-form>
		<Table
			:loadData="getList"
			:column="column"
			:params="{ goodsStatus: name }"
			ref="orderList"
		/>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { Message } from 'element-ui'
import { parseTime } from '@/utils'
import { getAfterServiceList } from '@/api/orderAfterService'
import { getRefundReasonsList } from '@/api/refundReasons'
export default {
	name: 'refundTable',
	components: {
		Table,
	},
	props: {
		isShowAfterType: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
		},
		handleStates: {
			type: Array,
		},
		column: {
			type: Array,
		},
	},
	data() {
		return {
			ruleForm: {
				afterReasonId: null, // 售后原因Id
				afterType: null, // 售后方式
				applyStartTime: null, // 退款申请开始时间
				applyEndTime: null, // 退款申请结束时间
				orderNum: null, // 订单编号
				status: null, // 售后单状态
			},
			refundReasons: [],
			types: [
				{ value: 'REFUND', label: '仅退款' },
				{ value: 'REFUND_RETURN', label: '退款/退货' },
				{ value: 'EXCHANGE_GOODS', label: '商品损坏/换货' },
			],
		}
	},
	computed: {
		getList() {
			return getAfterServiceList
		},
	},
	mounted() {
		getRefundReasonsList().then(res => {
			if (res.success) {
				this.refundReasons = res.data.list
			}
		})
	},
	methods: {
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.ruleForm.applyEndTime = null
			this.ruleForm.applyStartTime = null
		},
		// 查询
		onClickSearch() {
			this.$refs.orderList.update({ ...this.ruleForm })
		},
		// reset() {
		// 	this.$refs.orderList.reset()
		// },
		// 选择时间
		onChangeTime(val) {
			if (val.length > 0) {
				this.ruleForm.applyStartTime = val[0]
				this.ruleForm.applyEndTime = val[1]
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
