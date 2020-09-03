/*
 * @Author: hao.tian
 * @Date: 2020-08-01 16:13:03
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-01 16:23:58
 * @Descripttion:
 */
import ImgPreviewComponent from './index.vue'

const ImgPreview = {}

ImgPreview.install = Vue => {
	const ImgConstructor = Vue.extend(ImgPreviewComponent)

	const instance = new ImgConstructor()

	instance.$mount(document.createElement('div'))

	document.body.appendChild(instance.$el)

	Vue.prototype.$imgPreview = e => {
		instance.target = e.currentTarget
		instance.imgs = instance.target.getAttribute('data-img').split(',')
		instance.isShowImageDialog = true
		console.log(instance.imgs)
	}
}

export default ImgPreview
