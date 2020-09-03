<!--
 * @Author: hao.tian
 * @Date: 2020-08-01 15:31:00
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-06 12:41:22
 * @Descripttion: 图片预览 
    params: 
        title: String 标题 默认为'预览'
        imgs: Array  数组
        show: Boolean 为true打开弹窗 false关闭


-->
<template>
	<el-dialog :visible.sync="isShowImageDialog" @closed="clearImg">
		<el-carousel :interval="4000" type="card" height="600px">
			<el-carousel-item v-for="item in imgs" :key="item">
				<img v-bind:src="item" />
			</el-carousel-item>
		</el-carousel>
	</el-dialog>
</template>

<script>
export default {
	name: 'ImgPreview',
	data() {
		return {
			imgs: [],
			isShowImageDialog: false,
		}
	},
	mounted() {
		console.log(this.imgs)
	},
	methods: {
		clearImg() {
			this.imgs = null
		},
	},
}
</script>

<style scoped></style>
