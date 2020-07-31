/*
 * @Author: tianhao
 * @Date: 2020-06-12 17:33:37
 * @LastEditors: 刘家辰
 * @LastEditTime: 2020-07-03 10:11:15
 * @Descripttion:
 */
import request from '@/utils/request'

export function getList(data) {
	return request({
		url: '/adminApi/supplier',
		method: 'get',
		data,
	})
}
export function addSupplier(data) {
	return request({
		url: '/adminApi/supplier',
		method: 'post',
		data,
	})
}
export function editSupplier(data) {
	return request({
		url: `/adminApi/supplier/${data.id}`,
		method: 'put',
		data,
	})
}
export function getSupplierBrand(data) {
	return request({
		url: `/adminApi/supplier/${data.id}/brand`,
		method: 'get',
		data,
	})
}
