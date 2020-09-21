<!--
 * @Author: xin.chen
 * @Date: 2020-09-18 15:19:34
 * @LastEditors: xin.chen
 * @LastEditTime: 2020-09-22 00:49:38
 * @Descripttion: 
-->
/** * @name: 自定义表单 * @description: 基于vue2.0 element mobx二次封装自定义表单组件 *
@formData:当前自定义表单所有类型集合 * @formData:当前自定义表单所有类型 */

<template>
	<div class="worksheetCom">
		<el-form
			:model="ruleForm"
			status-icon
			label-width="120px"
			class="demo-ruleForm demo-ruleForm-float"
		>
			<el-form-item
				v-for="item in fieldatas"
				:label="item.name"
				:prop="item.key"
				ref="ruleForm"
				:key="item.type"
			>
				<!-- 单行文本模块 -->
				<el-input
					v-if="item.type == 'text'"
					size="small"
					:placeholder="item.placeholder"
					v-model="ruleForm[item.key]"
					:disabled="item.disabled"
				></el-input>
				<!-- 下拉选择器模块 -->
				<el-select
					v-if="item.type == 'select'"
					size="small"
					:placeholder="item.placeholder"
					v-model="ruleForm[item.key]"
					:disabled="item.disabled"
				>
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
				<!-- 级联选择器 -->
				<el-cascader
					v-if="item.type == 'cascader'"
					size="small"
					:disabled="item.disabled"
					v-model="ruleForm[item.key]"
					:options="optionsdata"
					:placeholder="item.placeholder"
				></el-cascader>
				<!-- 时间日期选择器 -->
				<div v-if="item.type == 'datetimepicker'" class="block">
					<el-date-picker
						size="small"
						v-model="ruleForm[item.key]"
						type="datetime"
						:placeholder="item.placeholder"
					></el-date-picker>
				</div>
				<!-- 标签选择器 -->
				<el-select
					v-if="item.type == 'allowcreate'"
					size="small"
					v-model="ruleForm[item.key]"
					multiple
					filterable
					allow-create
					default-first-option
					:placeholder="item.placeholder"
				>
					<el-option
						v-for="item in optionsbq"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import store from '@/store';
import vuedraggable from 'vuedraggable'; // vue拖拽组件

export default {
	name: 'worksheetCom',
	props: ['formData'],
	components: { vuedraggable },
	data() {
		return {
			fieldatas: [],
			ruleForm: {}, // 存放所有自定义表单key ==> state
			options: [
				{
					value: '选项1',
					label: '黄金糕',
				},
				{
					value: '选项2',
					label: '双皮奶',
				},
				{
					value: '选项3',
					label: '蚵仔煎',
				},
				{
					value: '选项4',
					label: '龙须面',
				},
				{
					value: '选项5',
					label: '北京烤鸭',
				},
			],
			optionsdata: [
				{
					value: 'zhinan',
					label: '指南',
					children: [
						{
							value: 'shejiyuanze',
							label: '设计原则',
							children: [
								{
									value: 'yizhi',
									label: '一致',
								},
								{
									value: 'fankui',
									label: '反馈',
								},
								{
									value: 'xiaolv',
									label: '效率',
								},
								{
									value: 'kekong',
									label: '可控',
								},
							],
						},
						{
							value: 'daohang',
							label: '导航',
							children: [
								{
									value: 'cexiangdaohang',
									label: '侧向导航',
								},
								{
									value: 'dingbudaohang',
									label: '顶部导航',
								},
							],
						},
					],
				},
				{
					value: 'zujian',
					label: '组件',
					children: [
						{
							value: 'basic',
							label: 'Basic',
							children: [
								{
									value: 'layout',
									label: 'Layout 布局',
								},
								{
									value: 'color',
									label: 'Color 色彩',
								},
								{
									value: 'typography',
									label: 'Typography 字体',
								},
								{
									value: 'icon',
									label: 'Icon 图标',
								},
								{
									value: 'button',
									label: 'Button 按钮',
								},
							],
						},
						{
							value: 'form',
							label: 'Form',
							children: [
								{
									value: 'radio',
									label: 'Radio 单选框',
								},
								{
									value: 'checkbox',
									label: 'Checkbox 多选框',
								},
								{
									value: 'input',
									label: 'Input 输入框',
								},
								{
									value: 'input-number',
									label: 'InputNumber 计数器',
								},
								{
									value: 'select',
									label: 'Select 选择器',
								},
								{
									value: 'cascader',
									label: 'Cascader 级联选择器',
								},
								{
									value: 'switch',
									label: 'Switch 开关',
								},
								{
									value: 'slider',
									label: 'Slider 滑块',
								},
								{
									value: 'time-picker',
									label: 'TimePicker 时间选择器',
								},
								{
									value: 'date-picker',
									label: 'DatePicker 日期选择器',
								},
								{
									value: 'datetime-picker',
									label: 'DateTimePicker 日期时间选择器',
								},
								{
									value: 'upload',
									label: 'Upload 上传',
								},
								{
									value: 'rate',
									label: 'Rate 评分',
								},
								{
									value: 'form',
									label: 'Form 表单',
								},
							],
						},
						{
							value: 'data',
							label: 'Data',
							children: [
								{
									value: 'table',
									label: 'Table 表格',
								},
								{
									value: 'tag',
									label: 'Tag 标签',
								},
								{
									value: 'progress',
									label: 'Progress 进度条',
								},
								{
									value: 'tree',
									label: 'Tree 树形控件',
								},
								{
									value: 'pagination',
									label: 'Pagination 分页',
								},
								{
									value: 'badge',
									label: 'Badge 标记',
								},
							],
						},
						{
							value: 'notice',
							label: 'Notice',
							children: [
								{
									value: 'alert',
									label: 'Alert 警告',
								},
								{
									value: 'loading',
									label: 'Loading 加载',
								},
								{
									value: 'message',
									label: 'Message 消息提示',
								},
								{
									value: 'message-box',
									label: 'MessageBox 弹框',
								},
								{
									value: 'notification',
									label: 'Notification 通知',
								},
							],
						},
						{
							value: 'navigation',
							label: 'Navigation',
							children: [
								{
									value: 'menu',
									label: 'NavMenu 导航菜单',
								},
								{
									value: 'tabs',
									label: 'Tabs 标签页',
								},
								{
									value: 'breadcrumb',
									label: 'Breadcrumb 面包屑',
								},
								{
									value: 'dropdown',
									label: 'Dropdown 下拉菜单',
								},
								{
									value: 'steps',
									label: 'Steps 步骤条',
								},
							],
						},
						{
							value: 'others',
							label: 'Others',
							children: [
								{
									value: 'dialog',
									label: 'Dialog 对话框',
								},
								{
									value: 'tooltip',
									label: 'Tooltip 文字提示',
								},
								{
									value: 'popover',
									label: 'Popover 弹出框',
								},
								{
									value: 'card',
									label: 'Card 卡片',
								},
								{
									value: 'carousel',
									label: 'Carousel 走马灯',
								},
								{
									value: 'collapse',
									label: 'Collapse 折叠面板',
								},
							],
						},
					],
				},
				{
					value: 'ziyuan',
					label: '资源',
					children: [
						{
							value: 'axure',
							label: 'Axure Components',
						},
						{
							value: 'sketch',
							label: 'Sketch Templates',
						},
						{
							value: 'jiaohu',
							label: '组件交互文档',
						},
					],
				},
			],
			optionsbq: [
				{
					value: 'HTML',
					label: 'HTML',
				},
				{
					value: 'CSS',
					label: 'CSS',
				},
				{
					value: 'JavaScript',
					label: 'JavaScript',
				},
			],
		};
	},
	watch: {
		formData: function(newvalue) {
			this.fieldatas = [...newvalue];
		},
		immediate: true,
	},

	methods: {},
};
</script>
<style></style>

<style lang="scss" scoped>
.worksheetCom {
}
</style>
