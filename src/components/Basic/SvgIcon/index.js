/*
 * @Author: wei.chen
 * @Date: 2020-08-03 18:15:55
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-03 12:42:06
 * @Descripttion:
 */
import Vue from 'vue'
import SvgIcon from '@/components/Basic/SvgIcon/index.vue' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
