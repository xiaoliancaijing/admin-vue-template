/*
 * @Author: peng.wan
 * @Date: 2020-06-15 12:32:38
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-03 11:05:20
 * @Descripttion:
 */

import request from '@/utils/request'

// 登录
export function login(data) {
	return request({
		url: '/adminApi/login',
		method: 'get',
		data,
	})
}
// 获取用户列表
export function getUserList(data) {
	return request({
		url: '/adminApi/users',
		method: 'get',
		data,
	})
}
// 获取用户信息
export function getUserInfo(data) {
	return request({
		url: `/adminApi/users/${data.id}`,
		method: 'get',
		data,
	})
}
// 用户状态管理
export function banState(data) {
	return request({
		url: `/adminApi/users/${data.userId}/banOrEnable`,
		method: 'put',
		data,
	})
}
// 获取用户收货地址列表
export function getUserAddress(data) {
	return request({
		url: `/adminApi/users/${data.id}/addresses`,
		method: 'get',
		data,
	})
}
// 获取用户自购记录
export function getUserOrder(data) {
	return request({
		url: `/adminApi/users/${data.id}/orders`,
		method: 'get',
		data,
	})
}
// 获取用户优惠券信息
export function getUserCoupons(data) {
	return request({
		url: `/adminApi/users/${data.id}/coupons`,
		method: 'get',
		data,
	})
}
