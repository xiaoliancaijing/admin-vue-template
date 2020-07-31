/*
 * @Author: tianhao
 * @Date: 2020-06-16 10:10:11
 * @LastEditors: 刘家辰
 * @LastEditTime: 2020-07-03 10:10:32
 * @Descripttion: 品牌管理
 */
import request from '@/utils/request'
export function getBrand(data) {
	return request({
		url: '/adminApi/brand',
		method: 'get',
		data,
	})
}
export function addBrand(data) {
	return request({
		url: '/adminApi/brand',
		method: 'post',
		data,
	})
}
export function editBrand(data) {
	return request({
		url: `/adminApi/brand/${data.id}`,
		method: 'put',
		data,
	})
}
