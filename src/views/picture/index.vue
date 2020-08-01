<!--
 * @Author: hao.tian
 * @Date: 2020-08-01 15:39:00
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-01 16:36:24
 * @Descripttion: 
-->
<template>
	<div class="picture">
		<el-table :data="tableData" style="width: 100%">
			<el-table-column label="评论内容" header-align="center">
				<template slot-scope="scope">
					<el-button
						v-if="scope.row.images.length > 0"
						:data-img="scope.row.images"
						type="text"
						size="small"
						@click="$imgPreview"
					>
						查看图片
					</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="date" label="日期" width="180"></el-table-column>
			<el-table-column prop="address" label="地址"></el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			title: '预览',
			show: false,
			tableData: [
				{
					images: 'www.baidu.com,www.qq.com',
				},
			],
		}
	},
	methods: {
		open() {
			this.show = true
		},
	},
}
</script>

<style></style>
