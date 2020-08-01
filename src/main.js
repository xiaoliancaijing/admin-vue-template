/*
 * @Author: tianhao
 * @Date: 2020-06-11 12:42:56
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-01 16:17:20
 * @Descripttion:
 */

import Vue from 'vue'

import './install'

import App from './App'
import store from './store'
import router from './router'
import imgPreview from '@/components/previewImg/index'

Vue.use(imgPreview)
Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App),
})
