/*
 * @Author: 刘家辰
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2020-07-31 14:41:06
 * @LastEditors: wei.chen
 * @Description:
 */

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		// do something before request is sent

		if (store.getters.token) {
			// let each request carry token
			// ['X-Token'] is a custom headers key
			// please modify it according to the actual situation
			config.headers['Authorization'] = getToken()
		}
		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	response => {
		const res = response.data
		// debugger
		// if the custom code is not 20000, it is judged as an error.
		if (res.code !== 200) {
			switch (res.code) {
				case 10005:
					res.msg = '值不可以重复！'
					break
			}
			Message({
				message: res.msg || 'Error',
				type: 'error',
				duration: 5 * 1000,
			})
			if (res.code === 402) {
				// token 过期了
				// 1、重置用户的状态
				// 2、用户跳转到 登录界面
			}
			// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
			if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
				// to re-login
				MessageBox.confirm('登录状态失效，请重新登录', '确认退出', {
					confirmButtonText: '重新登录',
					cancelButtonText: 'Cancel',
					type: 'warning',
				}).then(() => {
					store.dispatch('user/resetToken').then(() => {
						location.reload()
					})
				})
			}
			return Promise.reject(new Error(res.msg || 'Error'))
		} else {
			return res
		}
	},
	error => {
		Message({
			message: '服务开了小差，请稍后重试',
			type: 'error',
			duration: 3 * 1000,
		})
		return Promise.reject(error)
	}
)
// get请求封装
const request = val => {
	let { data, url, method } = val
	if (method == 'get' || method == 'GET') {
		return service({ url, method, params: data })
	} else {
		return service({ url, method, data })
	}
}

export default request
