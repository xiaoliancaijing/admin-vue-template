<!--
 * @Author: tianhao
 * @Date: 2020-06-16 14:58:17
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-08 15:48:22
 * @Descripttion: 
-->
<template>
	<div class="orderList">
		<el-tabs v-model.trim="activeName" @tab-click="handleClick">
			<el-tab-pane label="全部">
				<TabTable :btn="false" v-if="activeName == 0" name />
			</el-tab-pane>
			<el-tab-pane label="待付款">
				<TabTable :btn="false" v-if="activeName == 1" name="UN_PAY" />
			</el-tab-pane>
			<el-tab-pane label="待发货">
				<TabTable :btn="true" v-if="activeName == 2" name="WAIT_SHIP" />
			</el-tab-pane>
			<el-tab-pane label="已发货">
				<TabTable :btn="false" v-if="activeName == 3" name="SHIPPED" />
			</el-tab-pane>
			<el-tab-pane label="已完成">
				<TabTable :btn="false" v-if="activeName == 4" name="DONE" />
			</el-tab-pane>
			<el-tab-pane label="已取消">
				<TabTable :btn="false" v-if="activeName == 5" name="CANCEL" />
			</el-tab-pane>
			<el-tab-pane label="已关闭">
				<TabTable :btn="false" v-if="activeName == 6" name="CLOSE" />
			</el-tab-pane>
			<!-- <el-tab-pane label="售后处理中">
				<TabTable :btn="false" v-if="activeName == 7" name="AFTER_SALE" />
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
import TabTable from './tabTable'
export default {
	components: {
		TabTable,
	},
	data() {
		return {
			activeName: 0,
			name: '',
			showBtn: false,
		}
	},
	created() {
		this.handleClick()
	},
	methods: {
		handleClick() {},
	},
}
</script>

<style>
.orderList {
	padding: 20px;
}
</style>
