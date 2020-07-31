/*
 * @Author: peng.wan
 * @Date: 2020-06-18 12:38:14
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-04 17:43:53
 * @Descripttion:
 */

import request from '@/utils/request'

// 获取订单列表
export function getOrderList(data) {
	return request({
		url: '/adminApi/order',
		method: 'get',
		data,
	})
}
// 订单详情
export function orderDetail(data) {
	return request({
		url: `/adminApi/order/${data.id}`,
		method: 'get',
		data,
	})
}
// 关闭订单
export function orderClose(data) {
	return request({
		url: `/adminApi/order/${data.id}/cancel`,
		method: 'put',
		data,
	})
}
// 发货
export function sendExpress(data) {
	return request({
		url: `/adminApi/order/${data.id}/sendExpress`,
		method: 'put',
		data,
	})
}
// 申请退货
export function refund(data) {
	return request({
		url: `/adminApi/order/${data.id}/refund`,
		method: 'post',
		data,
	})
}
// 导出订单单
export function exportUnShippedOrder(data) {
	return request({
		url: `/adminApi/order/export/unShipped`,
		method: 'get',
		data,
	})
}
// 导入发货单
export function importShipped(data) {
	return request({
		url: `/adminApi/order/import/shipped`,
		method: 'post',
		data,
	})
}
