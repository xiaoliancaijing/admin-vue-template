/*
 * @Author: tianhao
 * @Date: 2020-06-11 12:42:56
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-07-31 12:49:58
 * @Descripttion:
 */

import Vue from 'vue'

import './install'

import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App),
})
