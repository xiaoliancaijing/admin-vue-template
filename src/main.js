/*
 * @Author: tianhao
 * @Date: 2020-06-11 12:42:56
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-03 12:43:08
 * @Descripttion:
 */

import Vue from 'vue'

import './install'

import App from './App'
import store from './store'
import router from './router'
import imgPreview from '@/components/Basic/previewImg'

Vue.use(imgPreview)
Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App),
})
