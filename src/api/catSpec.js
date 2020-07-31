/*
 * @Author: peng.wan
 * @Date: 2020-06-16 14:48:16
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-06-17 12:13:20
 * @Descripttion:
 */

import request from '@/utils/request'

// 获取类目管理下面的规格列表
export function getCatSpec(data) {
	return request({
		url: '/adminApi/catSpec',
		method: 'get',
		data,
	})
}
// 添加类目管理下面的参数
export function createCatSpec(data) {
	return request({
		url: '/adminApi/catSpec',
		method: 'post',
		data,
	})
}
// 删除类目管理下面的参数
export function deleteCatSpec(data) {
	return request({
		url: `/adminApi/catSpec/${data.id}`,
		method: 'delete',
		data,
	})
}
// 编辑类目管理下面的参数
export function editCatSpec(data) {
	return request({
		url: `/adminApi/catSpec/${data.id}`,
		method: 'put',
		data,
	})
}
// 添加类目管理下面的属性
export function createCatSkus(data) {
	return request({
		url: '/adminApi/catSkus',
		method: 'post',
		data,
	})
}
// 编辑类目管理下面的属性
export function editCatSkus(data) {
	return request({
		url: `/adminApi/catSkus/${data.id}`,
		method: 'put',
		data,
	})
}
// 删除类目管理下面的属性
export function deleteCatSkus(data) {
	return request({
		url: `/adminApi/catSkus/${data.id}`,
		method: 'delete',
		data,
	})
}
// 获取类目管理下面的属性
export function getCatSkus(data) {
	return request({
		url: `/adminApi/catSkus`,
		method: 'get',
		data,
	})
}
