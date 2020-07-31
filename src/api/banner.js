/*
 * @Author: tianhao
 * @Date: 2020-06-17 16:57:20
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-06-23 14:39:16
 * @Descripttion:
 */
import request from '@/utils/request'
export function getList(data) {
	return request({
		url: '/adminApi/banner',
		method: 'get',
		data,
	})
}
export function AddBanner(data) {
	return request({
		url: '/adminApi/banner',
		method: 'post',
		data,
	})
}
export function deleteBanner(data) {
	return request({
		url: `/adminApi/banner/${data.id}`,
		method: 'delete',
		data,
	})
}
// 启用禁用
export function banPick(data) {
	return request({
		url: `/adminApi/banner/${data.id}/ban`,
		method: 'put',
		data,
	})
}
export function edit(data) {
	return request({
		url: `/adminApi/banner/${data.id}`,
		method: 'put',
		data,
	})
}

export function bannerDetail(data) {
	return request({
		url: `/adminApi/banner/${data}`,
		method: 'get',
		data,
	})
}
