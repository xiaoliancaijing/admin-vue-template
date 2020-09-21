<!--
 * @Author: xin.chen
 * @Date: 2020-09-18 15:19:34
 * @LastEditors: xin.chen
 * @LastEditTime: 2020-09-22 00:53:01
 * @Descripttion: 
-->
<template>
	<div class="worksheet-body">
		<div class="worksheet-left">
			<div
				@click="fieldclick(item)"
				v-for="item in fields"
				:key="item.type"
				class="worksheetsame"
			>
				{{ item.name }}
			</div>
		</div>
		<div class="worksheet-center">
			<worksheetCom :formData="fieldata" />
		</div>
		<div class="worksheet-right">
			<el-form
				:model="ruleForms"
				status-icon
				label-width="140px"
				class="demo-ruleForm demo-ruleForm-float"
			>
				<el-form-item label="编辑字段">
					<el-input
						maxlength="40"
						size="small"
						@change="changeFrom"
						v-model="thisname"
					></el-input>
				</el-form-item>
				<el-form-item label="设置表单唯一key值">
					<el-input maxlength="40" size="small" v-model="thiskey"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import store from '@/store';
import worksheetCom from '@/views/worksheet/worksheetcom';
import { getWorksheet } from '@/api/app';
let ids = 0;
export default {
	name: 'worksheet',
	components: {
		worksheetCom,
	},
	data() {
		return {
			fields: [],
			fieldata: [],
			thiskey: '',
			thisname: '',
		};
	},
	created() {
		this.fields = store.getters.field;
		getWorksheet({}).then(res => {
			console.log('1111111', res);
		});
	},

	methods: {
		// 自定义表单添加
		fieldclick(item, i) {
			// 是否为初始化设置
			if (item.key == '') {
				++ids;
				item.id = ids;
			}
			this.thisname = item.name;
			this.thiskey = item.key;
			this.fieldata.push({ ...item });
		},
		// 编辑当前表单信息
		changeFrom() {
			this.fieldata.map((val, i) => {
				if (val.id == ids) {
					val.name = this.thisname;
					val.key = this.thiskey;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.worksheet-body {
	display: flex;

	.worksheet-left {
		padding: 20px;
		width: 320px;
		border-right: 1px solid red;
		display: flex;
		justify-content: space-between;
		align-content: flex-start;
		flex-wrap: wrap;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		.worksheetsame {
			width: 130px;
			height: 30px;
			font-size: 13px;
			padding: 0 10px;
			background: #ebf3ff;
			margin-bottom: 10px;
			border-radius: 3px;
			display: flex;
			align-items: center;
			// justify-content: flex-start;
			-webkit-box-pack: start;
			color: #333;
			cursor: pointer;
		}
	}
	.worksheet-center {
		padding: 20px;
		padding-right: 40px;
		border-right: 1px solid red;
	}
	.worksheet-right {
		padding: 20px;
		padding-top: 10px;
		h4 {
			font-weight: 400;
		}
	}
}
</style>
