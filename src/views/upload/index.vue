<!--
 * @Author: peng.wan
 * @Date: 2020-08-03 11:03:07
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-05 10:21:02
 * @Descripttion: 
-->
<template>
	<div class="upload">
		<UploadImg v-model="file" />
		<!-- <UploadImgage /> -->
	</div>
</template>

<script>
import UploadImg from '@/components/upload/upload'
// import UploadImgage from '@/components/upload/index'
import UploadImgage from '@/components/cropperImg/index'
import { isPhone } from '@/utils/validate'

export default {
	components: {
		UploadImg,
		UploadImgage,
	},
	name: 'upload',
	data() {
		return {
			file: '',
			input: '',
		}
	},
	mounted() {},
	methods: {},
	watch: {
		file(newVal, oldVal) {
			console.log('======>>this.file', this.file)
		},
	},
}
</script>

<style lang="scss" scoped>
.upload {
	padding: 20px;
}
</style>
