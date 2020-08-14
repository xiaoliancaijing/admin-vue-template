/*
 * @Author: wei.chen
 * @Date: 2020-08-03 18:15:55
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-08-04 14:35:40
 * @Descripttion:
 */
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
