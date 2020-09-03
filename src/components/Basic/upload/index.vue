<!--
 * @Author: tianhao
 * @Date: 2020-06-12 12:09:22
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-03 12:25:55
 * @Descripttion: 
params:
-->

<template>
	<div>
		<el-upload
			class="lt_uploader"
			:action="qiniuUpLoadUrl"
			:show-file-list="false"
			:on-success="handleAvatarSuccess"
			:data="parameters"
			:before-upload="beforeAvatarUpload"
			:file-list="fileList"
			list-type="picture-card"
			:limit="limit"
		>
			<!-- <img v-if="option.imgUrl && limit == 1" :src="option.imgUrl" class="avatar" /> -->
			<div class="upload_btn" v-if="fileList.length != limit" slot="trigger">
				<i class="el-icon-plus"></i>
			</div>
			<div class="upload_comp">
				<div class="upload_img_item" v-for="(item, index) in fileList" :key="item.name">
					<img :src="item.url" class="img_item" />
					<span class="img_item_action">
						<i class="el-icon-delete" @click="delUploadImg(index)"></i>
					</span>
				</div>
			</div>
			<!-- <div slot="file" slot-scope="{ file }">
				{{ file }}
				<img class="el-upload-list__item-thumbnail" :src="file.url" alt="商品详情图片" />
				<span class="el-upload-list__item-actions">
					<span class="el-upload-list__item-delete" @click="delUploadImg(file)">
						<i class="el-icon-delete"></i>
					</span>
				</span>
			</div> -->
		</el-upload>
	</div>
</template>
<script>
import { url } from '@/config/index'
import { GUID } from '@/utils/guid.js'
import store from '@/store'

export default {
	name: 'LTQNUpload',
	props: {
		value: {
			// 初始化图片
			type: [String, Array],
		},
		defaultUrl: {
			type: Array,
			default() {
				return []
			},
		},
		size: {
			type: Number,
			default: 500,
		},
		limit: {
			type: Number,
			default: 1,
		},
	},
	data() {
		// console.log(this.value)
		return {
			parameters: {
				token: store.getters.upLoadToken,
				key: '',
			},
			parentVal: this.value, // 同步父节点传递进来的 默认数据
			qiniuUpLoadUrl: url.qiniuUrl,
			dialogVisible: false,
			option: {
				outputType: '', // 裁剪生成图片的格式
				imgUrl: this.defaultUrl, // 传递进来的默认图片
			},
			fileList: [], //页面显示的数组
			// 防止重复提交
			loading: false,
		}
	},
	watch: {
		value(newValue, oldVal) {
			// console.log('value change', newValue, oldVal)
			if (newValue != oldVal) {
				this.parentVal = this.value
				this.transFormValueToFileList()
			}
		},
		parentVal(newVal, oldVal) {
			if (newVal != oldVal) {
				this.$emit('input', this.parentVal)
				// console.log('this.parentVal:', this.parentVal)
			}
		},
	},
	created() {
		this.transFormValueToFileList()
	},
	beforeDestroy() {},
	methods: {
		transFormValueToFileList() {
			let tempStr
			if (this.value) {
				let _tempArray = []
				if (Array.isArray(this.value)) {
					this.value.forEach(item => {
						if (item) {
							tempStr = item.split('/')
							_tempArray.push({
								name: tempStr[tempStr.length - 1],
								url: item,
							})
						}
					})
					this.fileList = _tempArray
				} else {
					tempStr = this.value.split('/')
					this.fileList = [{ name: tempStr[tempStr.length - 1], url: this.value }]
				}
				// debugger
			} else {
				this.fileList = []
			}

			// if (this.limit == 1) {
			// 	if (this.value) {
			// 		debugger
			// 		tempStr = this.value.split('/')

			// 		this.fileList = [{ name: tempStr[tempStr.length - 1], url: this.value }]
			// 	} else {
			// 		this.fileList = []
			// 	}
			// } else {
			// 	if (this.value) {
			// 		let _tempArray = []
			// 		if (Array.isArray(this.value)) {
			// 			this.value.forEach(item => {
			// 				if (item) {
			// 					tempStr = item.split('/')
			// 					_tempArray.push({
			// 						name: tempStr[tempStr.length - 1],
			// 						url: item,
			// 					})
			// 				}
			// 			})
			// 		}
			// 		// debugger
			// 		this.fileList = _tempArray
			// 	} else {
			// 		this.fileList = []
			// 	}
			// }
		},
		// 删除 图片上传的图片
		delUploadImg(index) {
			// console.log(index)
			this.fileList.splice(index, 1)
			this.syncFileListToParentVal()
			// this.syncFileListToParentVal()
		},
		// 同步  fileList 到  parentVal 返回给父组件里面
		syncFileListToParentVal() {
			let tempParentVal = []
			this.fileList.forEach(item => {
				tempParentVal.push(item.url)
			})

			this.parentVal = tempParentVal
		},
		handleAvatarSuccess(res, file, fileList) {
			console.log(res, file, fileList)
			if (this.limit > 1) {
				// let arr = []
				// fileList.forEach(item => {
				// 	console.log(item)
				// 	arr.push({
				// 		name: file.response.key,
				// 		key: file.response.key,
				// 		url: `${url.qiniuDownload}/${item.response.key}`,
				// 	})
				// })
				this.fileList = [
					...this.fileList,
					{
						name: file.response.key,
						key: file.response.key,
						url: `${url.qiniuDownload}/${res.key}`,
					},
				]
				this.syncFileListToParentVal()
			} else {
				this.fileList = [
					{
						name: file.response.key,
						key: file.response.key,
						url: `${url.qiniuDownload}/${res.key}`,
					},
				]
				this.parentVal = `${url.qiniuDownload}/${res.key}`
			}
			// this.fileList = fileList
			this.dialogVisible = true
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type == 'image/png' || file.type === 'image/jpeg'
			if (file.type === 'image/png') {
				this.option.outputType = 'png'
			} else if (file.type === 'image/jpeg') {
				this.option.outputType = 'jpg'
			}

			// 生成文件名称
			let guid = new GUID()
			this.parameters.key = `${guid.newGUID()}.${this.option.outputType}`
			const isLt = file.size / 1024 > this.size
			console.log('isLt', isLt)
			if (!isJPG) {
				this.$message.error('上传图片只能是 JPG/PNG 格式!')
				return false
			}
			if (isLt) {
				this.$message.error(`上传图片大小不能超过${this.size}KB!`)
				return false
			}

			if (this.width || this.height) {
				return new Promise((resolve, reject) => {
					let _URL = window.URL || window.webkitURL
					let img = new Image()
					img.src = _URL.createObjectURL(file)
					img.onload = () => {
						if (this.width) {
							if (img.width > this.width) {
								this.$message.warning({
									message: `上传文件宽最大为${this.width}`,
								})
								reject()
							}
						}
						if (this.height) {
							if (img.height > this.height) {
								this.$message.warning({
									message: `上传文件高最大为${this.height}`,
								})
								reject()
							}
						}
					}
				})
			} else {
				return true
			}
		},
	},
}
</script>
<style lang="scss" scope>
// 覆盖样式
.el-upload--picture-card {
	width: auto;
	border: none;
	.el-icon-plus {
		width: 148px;
		height: 148px;
		line-height: 148px;
		border: 1px dashed #c0ccda;
	}
}
.upload_btn {
	display: inline-block;
	vertical-align: sub;
	margin-top: 10px;
	.el-icon-plus {
		vertical-align: middle;
	}
}
.upload_comp {
	display: inline;
	vertical-align: text-bottom;
	height: 148px;
	.upload_img_item {
		display: inline-block;
		position: relative;
		width: 148px;
		height: 148px;
		margin-left: 10px;
		margin-top: 10px;
		// vertical-align: top;
		overflow: hidden;
		.img_item {
			width: 100%;
		}
		.img_item_action {
			position: absolute;
			top: 0;
			left: 0;
			width: 148px;
			height: 148px;
			line-height: 148px;
			opacity: 0.01;
			font-size: 20px;
			text-align: center;
			&:hover {
				cursor: default;
				color: #fff;
				opacity: 0.7;
				background-color: rgba(0, 0, 0, 0.7);
				transition: opacity 0.3s;
			}
			.el-icon-delete {
				&:hover {
					cursor: pointer;
				}
			}
		}
	}
}
.img_uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		height: 100%;
	}
}
.img_uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	text-align: center;
}
.avatar {
	height: 100%;
	width: 100%;
}
.cropper-content .cropper {
	width: auto;
	height: 300px;
}
</style>
