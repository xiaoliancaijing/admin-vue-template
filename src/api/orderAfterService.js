/*
 * @Author: peng.wan
 * @Date: 2020-07-01 19:38:31
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-01 19:43:20
 * @Descripttion:
 */
import request from '@/utils/request'

// 获取售后单列表
export function getAfterServiceList(data) {
	return request({
		url: '/adminApi/order/afterService',
		method: 'get',
		data,
	})
}
// 获取售后单详情
export function getAfterServiceInfo(data) {
	return request({
		url: `/adminApi/order/afterService/${data.id}`,
		method: 'get',
		data,
	})
}
// 售后申请通过
export function applyForPass(data) {
	return request({
		url: `/adminApi/order/afterService/${data.id}/pass`,
		method: 'put',
		data,
	})
}
// 售后申请拒绝
export function applyForReject(data) {
	return request({
		url: `/adminApi/order/afterService/${data.id}/reject`,
		method: 'put',
		data,
	})
}
