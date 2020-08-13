<!--
 * @Author: wei.chen
 * @Date: 2020-06-19 11:37:13
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-05 10:20:00
 * @Descripttion: 
-->

<template>
	<div>
		<div class="lt_upload_img_list">
			<div class="lt_cropper_input">
				<div
					class="upload_img_content"
					v-for="(imgItem, index) in fileList"
					:key="imgItem.name"
				>
					<img class="lt_img_item" alt="上传图片" :src="imgItem.url" />
					<span class="img_item_action">
						<i class="el-icon-delete" @click="delUploadImg(index)"></i>
					</span>
				</div>
				<input
					v-if="limit == fileList.length"
					title=""
					ref="inputer"
					type="file"
					name="file"
					accept="jpg"
					@change="handleImgChange"
					class="lt_cropper_input_file"
				/>
			</div>
			<div
				v-if="limit != fileList.length"
				class="lt_cropper_input lt_cropper_upload_item el-upload--picture-card"
			>
				<i class="el-icon-plus avatar-uploader-icon"></i>
				<input
					ref="inputer"
					title=""
					type="file"
					name="file"
					accept="jpg"
					@change="handleImgChange"
					class="lt_cropper_input_file"
				/>
			</div>
		</div>
		<el-dialog
			width="700"
			title="图片剪切"
			:visible.sync="cropperImgVisible"
			append-to-body
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
		>
			<div class="cropper-content">
				<div class="cropper" style="text-align:center">
					<!-- @realTime="realTime" -->
					<vueCropper
						ref="vueCropper"
						:img="option.cropperImgObj"
						:outputSize="option.size"
						:outputType="option.outputType"
						:info="true"
						:full="option.full"
						:canMove="option.canMove"
						:canMoveBox="option.canMoveBox"
						:original="option.original"
						:autoCrop="option.autoCrop"
						:fixed="option.fixed"
						:fixedNumber="option.fixedNumber"
						:centerBox="option.centerBox"
						:infoTrue="option.infoTrue"
						:fixedBox="option.fixedBox"
					></vueCropper>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelCropper">取 消</el-button>
				<el-button type="primary" @click="cropperImgMark">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import axios from 'axios'
import { VueCropper } from 'vue-cropper'
import { url } from '@/config/index'
import { GUID } from '@/utils/guid.js'
import store from '@/store'

export default {
	componentds: {
		VueCropper,
	},
	name: 'LTCropperImg',
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
		width: {
			type: Number,
			default: 300,
		},
		limit: {
			type: Number,
			default: 1,
		},
		ratio: {
			type: Number,
			default: 1,
		},
	},
	data() {
		// console.log('limit', this.limit)
		// console.log('value', this.value)
		console.log('url', url)

		return {
			cropperImgVisible: false, // 剪切图片模态窗
			parentVal: this.value, // 同步父节点传递进来的 默认数据
			fileList: [], // 存储图片数据列表
			parameters: {
				token: store.getters.upLoadToken, //  图片上传到七牛的token
				key: '', // 图片上传的时候 图片名称
			},
			qiniuUpLoadUrl: url.qiniuUrl, //  上传地址

			// 裁剪组件的基础配置option
			option: {
				limit: this.limit, // 限制图片上传的数量
				outputType: 'jpeg', // 裁剪生成图片的格式
				imgUrl: this.defaultUrl,
				cropperImgObj: null, // 图片剪切后的本地图片对象
				size: 400, // 图片默认大小限制  400kb
				full: true, // 是否输出原图比例的截图
				fixed: true, // 是否开启截图框宽高固定比例
				canScale: false, // 是否默认生成截图框
				fixedNumber: [1, this.ratio], // 截图框的宽高比例
				canMove: true, // 上传图片是否可以移动
				fixedBox: false, // 不允许修改比例
				original: true, // 上传图片按照原始比例渲染
				canMoveBox: true, // 上传图片是否可以移动
				autoCrop: true, // 是否默认生成截图框
				mode: 'cover', //图片默认渲染方式
				autoCropWidth: this.width, // 只有自动截图开启 宽度高度才生效
				autoCropHeight: this.width * this.ratio,
				centerBox: true, // 截图框是否被限制在图片里面
			},
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
			}
		},
	},
	created() {
		this.transFormValueToFileList()
		// token 直接从 mobx 里获取
		// this.getqiniuToken()
	},
	destroyed: function() {},
	beforeDestroy() {},

	methods: {
		transFormValueToFileList() {
			let tempStr
			if (this.limit == 1) {
				if (this.value) {
					tempStr = this.value.split('/')

					this.fileList = [{ name: tempStr[tempStr.length - 1], url: this.value }]
				} else {
					this.fileList = []
				}
			} else {
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
					}
					// debugger
					this.fileList = _tempArray
				} else {
					this.fileList = []
				}
			}
		},

		realTime(data) {
			this.previews = data
		},

		// 图片上传的函数
		upLoadImgToQiNiu(file) {
			// 生成文件名称

			// 封装数据对象
			let param = new FormData()
			param.append('token', this.parameters.token)
			param.append('key', this.parameters.key)
			//通过append向form对象添加数据
			param.append('file', file)

			// 请求头设置
			let config = {
				//添加请求头
				headers: { 'Content-Type': 'multipart/form-data' },
				//添加上传进度监听事件
				onUploadProgress: e => {
					var completeProgress = (((e.loaded / e.total) * 100) | 0) + '%'
					// console.log(completeProgress)
				},
			}
			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)',
			})

			axios
				.post(url.qiniuUrl, param, config)
				.then(res => {
					// console.log(res.data)

					this.option.imgUrl = `${url.qiniuDownload}/${res.data.key}`
					if (this.limit === 1) {
						// 将图片回传到 父组件去

						this.fileList = [{ name: res.data.key, url: this.option.imgUrl }]
						this.parentVal = this.option.imgUrl
					} else {
						this.fileList.push({ name: res.data.key, url: this.option.imgUrl })
						// 将数据fileList 同步到 parentVal 里面去
						this.syncFileListToParentVal()
					}

					// 延迟 300 处理数据显示 渲染时间问题,loading 延迟 300毫秒消失
					setTimeout(() => {
						loading.close()
					}, 300)
				})
				.catch(error => {
					console.log(error)
				})
		},
		// 同步  fileList 到  parentVal 返回给父组件里面
		syncFileListToParentVal() {
			let tempParentVal = []
			this.fileList.forEach(item => {
				tempParentVal.push(item.url)
			})

			this.parentVal = tempParentVal
		},
		// 用户选择图片的回调函数 ,上传成功也会触发 change 事件

		handleImgChange(e) {
			var reader = new FileReader()
			let inputDOM = this.$refs.inputer
			console.log(e)
			console.log(reader)
			reader.onload = e => {
				// 把Array Buffer转化为blob 如果是base64不需要
				console.log(e)
				if (typeof e.target.result === 'object') {
					this.option.cropperImgObj = window.URL.createObjectURL(
						new Blob([e.target.result])
					)
				} else {
					this.option.cropperImgObj = e.target.result
				}
				this.cropperImgVisible = true
				inputDOM.value = ''
			}

			// 转化为blob
			reader.readAsArrayBuffer(inputDOM.files[0])
			// let inputDOM = this.$refs.inputer
			// console.log(inputDOM.files[0])
			// this.option.cropperImgObj = inputDOM.files[0]
			// this.cropperImgVisible = true
		},

		// 上传前做 大小检查  同时生成唯一的图片名称
		beforeAvatarUpload(file) {
			// 生成文件名称
			let guid = new GUID()
			// this.parameters.key = `${guid.newGUID()}.${this.option.outputType}`
			this.parameters.key = `${guid.newGUID()}.jpg`

			const isLt = file.size / 1024 < this.size

			this.$refs.vueCropper.getCropBlob(blob => {
				// 调用图片上传
				let that = this
				var reader = new FileReader()
				reader.readAsDataURL(blob)
				reader.onload = function(e) {
					that.option.imgUrl = e.target.result
					// that.fileList = [{ name: that.parameters.key, url: e.target.result }]
					that.cropperImgVisible = false
					let guid = new GUID()
					that.parameters.key = `${guid.newGUID()}.jpg`
					let tempFile = new window.File([blob], that.parameters.key, {
						type: 'jpg',
					})
					that.upLoadImgToQiNiu(tempFile)
					// that.$refs.imgUpload.submit()
				}
			})
		}, // 取消剪切图片
		cancelCropper() {
			this.option.cropperImgObj = null
			this.cropperImgVisible = false
		},
		// 删除 图片上传的图片
		delUploadImg(index) {
			// console.log(index)
			this.fileList.splice(index, 1)
			this.syncFileListToParentVal()
		},
		// 确定剪切图片
		cropperImgMark() {
			// 获取图片剪切的内容

			this.$refs.vueCropper.getCropBlob(blob => {
				// 调用图片上传
				let that = this
				var reader = new FileReader()
				reader.readAsDataURL(blob)
				reader.onload = function(e) {
					that.option.imgUrl = e.target.result
					// that.fileList = [{ name: that.parameters.key, url: e.target.result }]
					that.cropperImgVisible = false
					let guid = new GUID()
					that.parameters.key = `${guid.newGUID()}.jpg`
					let tempFile = new window.File([blob], that.parameters.key, {
						type: 'jpg',
					})
					that.upLoadImgToQiNiu(tempFile)
					// that.$refs.imgUpload.submit()
				}
			})
		},
	},
}
</script>
<style lang="scss" scope>
.img_uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.lt_upload_img_list {
	.lt_img_item {
		width: 148px;
		height: 148px;
		margin-right: 20px;
	}
}

.lt_cropper_input {
	position: relative;
	display: inline-block;
	text-align: left;
	.avatar-uploader-icon:hover {
		cursor: pointer;
	}
	.upload_img_content {
		display: inline-block;
		position: relative;
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
	.lt_cropper_input_file {
		position: absolute;
		left: 0;
		top: 0;
		width: 148px;
		height: 148px;
		opacity: 0.01;
		// visibility: hidden;
		display: inline-block;
		&:hover {
			cursor: pointer;
		}
	}
}
.lt_cropper_upload_item {
	text-align: center;
}
.img_uploader .el-upload:hover {
	border-color: #409eff;
}
.img_uploader-icon {
	font-size: 28px;
	color: #8c939d;
	// width: 178px;
	// height: 178px;
	// line-height: 178px;
	text-align: center;
}
.avatar {
	// width: 178px;
	// height: 178px;
	display: block;
}
.cropper-content .cropper {
	width: auto;
	height: 500px;
}
</style>
