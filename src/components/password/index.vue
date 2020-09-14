<!--
 * @Author: CL
 * @Date: 2020-09-11 17:20:20element
 * @LastEditors: CL
 * @LastEditTime: 2020-09-12 11:10:07
 * @Descripttion: 基于element UI的密码输入框    直接导入使用， 通过 v-model 绑定val值 ，change事件也是直接绑定
-->
<template>
	<div class="passWord_view">
		<el-input
			:placeholder="placeholder"
			v-bind="$attrs"
			:size="size"
			:prefix-icon="leftIcon"
			v-model="modelvalue"
			:type="iconState ? 'text' : 'password'"
			@change="changeVal"
			@blur="pdwBlur"
			@focus="pdwFocus"
			:maxlength="maxlength"
		>
			<i
				v-if="iconState"
				:class="iconShow"
				class="iconCup"
				slot="suffix"
				@click="iconStateShow"
			></i>
			<i
				v-if="!iconState"
				:class="iconHide"
				class="iconCup"
				slot="suffix"
				@click="iconStateHide"
			></i>
		</el-input>
	</div>
</template>

<script>
export default {
	model: {
		prop: 'value', //绑定的值，通过父组件传递
		event: 'input', //自定义事件名
	},
	props: {
		value: {}, //输入的值
		size: {
			type: String,
			default: 'small',
		}, //密码框大小
		leftIcon: {
			type: String,
			default: 'el-icon-lock',
		}, //左边显示图标
		placeholder: {
			type: String,
			default: '请输入',
		}, //左边显示图标
		iconShow: {
			type: String,
			default: 'el-icon-view',
		}, //右边显示图标  自行替换 显示密码图标
		iconHide: {
			type: String,
			default: 'el-icon-refresh-left',
		}, //右边显示图标  自行替换 显示密码图标
		maxlength: {
			type: Number,
			default: 16,
		}, //录入限制长度 默认16
	},
	data() {
		return {
			iconState: true, //明文密码显示状态
			pdwState: -1, //明文密码常驻显示状态   -1 未默认状态  0 用户点击了不可见状态   1 用户点击了 看见状态
			modelvalue: '',
		};
	},
	watch: {
		value: function (data) {
			this.modelvalue = data;
		},
	},
	methods: {
		// 显示密码
		iconStateShow() {
			this.iconState = false;
			this.pdwState = false;
		},
		// 显示密码
		iconStateHide() {
			this.iconState = true;
			this.pdwState = false;
		},
		// 失去焦点
		pdwBlur() {
			if (this.pdwState === -1) {
				this.iconState = false;
			}
		},
		// 获取焦点
		pdwFocus() {
			if (this.pdwState === -1) {
				this.iconState = true;
			}
		},
		// change
		changeVal(val) {
			this.$emit('input', val);
			this.$emit('change', val);
		},
	},
};
</script>

<style>
.iconCup {
	cursor: pointer;
}
</style>
