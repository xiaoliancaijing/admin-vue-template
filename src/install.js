/*
 * @Author: wei.chen
 * @Date: 2020-07-31 12:45:27
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-01 17:58:37
 * @Descripttion: 这个文件是用来安装其它第三方组件配置
 */
import Vue from 'vue'
//  图片剪切组件
import VueCropper from 'vue-cropper'
// 样式
import 'normalize.css/normalize.css' // css 重置样式
import '@/styles/index.scss' // 全局样式

// element 配置
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 全局修改默认值
ElementUI.Button.props.size.default = 'small'
// console.log('ElementUI', ElementUI.Button.props);
ElementUI.Dialog.props.destroyOnClose.default = true
ElementUI.Dialog.props.customClass.default = 'dialogStyle'
// console.log('ElementUI', ElementUI.Dialog);
Vue.use(ElementUI)

// vue

Vue.use(VueCropper)

//  icon 配置导入
import '@/components/SvgIcon/index' // icon
