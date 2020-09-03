<!--
 * @Author: peng.wan
 * @Date: 2020-08-03 10:47:25
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-04 15:19:29
 * @Descripttion: 
-->
<template>
	<div class="uploadTemp">
		<div slot="tip" class="el-upload__tip">
			{{ tipText }}
		</div>
		<el-upload
			ref="uploadTemp"
			:action="actionUrl"
			:list-type="listType"
			:data="parameters"
			:file-list="fileList"
			:on-preview="handlePictureCardPreview"
			:on-remove="handleRemove"
			:before-upload="beforeAvatarUpload"
			:on-success="onSuccess"
			:limit="limit"
		>
			<i v-if="upLoadType === 'image'" class="el-icon-plus"></i>

			<el-button v-else size="small" type="primary">点击上传</el-button>
		</el-upload>

		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import { url } from '@/config/index'
import { GUID } from '@/utils/guid.js'
import store from '@/store'
import { Loading } from 'element-ui'
export default {
	name: 'uploadTemp',
	props: {
		value: {
			// 初始化文件
			type: [String, Array],
		},
		// 上传文件大小
		size: {
			type: Number,
			default: 500,
		},
		// 最大允许上传个数
		limit: {
			type: Number,
			default: 9,
		},

		// 上传文件的类型  图片为image, 文件为file
		upLoadType: {
			type: String,
			default: 'image',
		},
	},
	data() {
		return {
			actionUrl: url.qiniuUrl, // 文件或图片上传地址
			dialogImageUrl: '',
			dialogVisible: false,
			cropperImgVisible: false,
			disabled: false,
			// 上传时附带的额外参数
			parameters: {
				token: store.getters.upLoadToken, // 上传时带的 token
				key: '', // 上传的文件名
			},

			fileList: [], // 上传的文件列表
			listType: 'text', // 文件列表的类型 text/picture/picture-card
			// 防止重复提交
			loading: false,
			loadingInstance: null,
			parentVal: this.value, // 同步父节点传递进来的 默认数据
			tipText: '',
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
	mounted() {
		if (this.upLoadType === 'image') {
			this.listType = 'picture-card'
		} else {
			this.listType = 'text'
		}
		if (this.upLoadType === 'file') {
			this.tipText = `请上传不大于${this.size}KB，PPT、WORD、Excel、PDF格式的文件`
		}
		// if (this.upLoadType === 'video') {
		// 	this.tipText = `请上传不大于${this.size}KB,MP4、AVI、WMV格式的视频文件`
		// }
		this.transFormValueToFileList()
	},
	methods: {
		transFormValueToFileList() {
			if (this.value) {
				if (Array.isArray(this.value)) {
					var _tempArray = this.value.filter(function(s) {
						return s
					})
					if (_tempArray.length > 0) {
						this.fileList = [..._tempArray]
					} else {
						this.fileList = []
					}
				} else if (typeof this.value === 'string') {
					this.fileList = []
				} else {
					this.fileList = []
				}
			} else {
				this.fileList = []
			}
		},
		// 点击文件列表中已上传的文件时的钩子
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url
			this.dialogVisible = true
		},
		// 文件列表移除文件时的钩子
		handleRemove(file, fileList) {
			console.log(file, fileList)
			this.fileList = fileList
			this.syncFileListToParentVal()
		},
		// 文件上传成功时的钩子
		onSuccess(response, file, fileList) {
			this.fileList.push({
				name: file.name,
				key: file.name,
				url: `${url.qiniuDownload}/${file.name}`,
			})
			this.syncFileListToParentVal()
			this.loadingInstance.close()
			this.$refs.uploadTemp.clearFiles() // 清除上次上传记录
		},
		// 同步  fileList 到  parentVal 返回给父组件里面
		syncFileListToParentVal() {
			let tempParentVal = []
			this.fileList.forEach(item => {
				var _tempItem = {}
				_tempItem.name = item.name
				_tempItem.url = item.url
				tempParentVal.push(_tempItem)
			})
			this.parentVal = tempParentVal
		},
		// 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
		beforeAvatarUpload(file) {
			console.log(file)
			let guid = new GUID()

			if (this.upLoadType === 'image') {
				// 如果上传的类型为图片，则进入此业务代码
				console.log('======>>this.fileList', this.fileList)
				if (this.fileList.length === this.limit) {
					this.$message.error(`最多只能上传${this.limit}张图片`)
					return false
				}
				// 上传的文件名
				this.parameters.key = file.name
				// 上传图片的大小
				const isLt = file.size / 1024 > this.size
				// 上传图片的格式
				const isJPG = file.type == 'image/png' || file.type === 'image/jpeg'
				if (!isJPG) {
					this.$message.error('上传图片只能是 JPG/PNG 格式!')
					return false
				}
				if (isLt) {
					this.$message.error(`上传图片大小不能超过${this.size}KB!`)
					return false
				}
				this.loadingInstance = Loading.service({ fullscreen: true })
				return true
			} else if (this.upLoadType === 'file') {
				// 如果上传为文件，则进入此业务代码
				this.parameters.key = file.name
				// 判断文件格式
				// TXT、baiDOC、XLS、PPT、DOCX、XLSX、PPTX

				const isFileType =
					file.type == 'application/msword' ||
					file.type === 'application/pdf' ||
					file.type === 'application/vnd.ms-excel' ||
					file.type.includes('application/vnd.openxmlformats') ||
					file.type.includes('application/vnd.ms-powerpoint')
				// 文件大小
				const isLt = file.size / 1024 / 1024 < this.szie
				if (!isFileType) {
					this.$message.error('上传文件只能是 ppt word excel pdf 格式!')
					return false
				}
				if (isLt) {
					this.$message.error(`上传文件大小不能超过${this.size}MB!`)
					return false
				}
				this.loadingInstance = Loading.service({ fullscreen: true })
				return true
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.el-upload__tip {
	margin-top: 0;
	margin-bottom: 6px;
}
</style>
