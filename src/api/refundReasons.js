/*
 * @Author: peng.wan
 * @Date: 2020-07-02 11:35:06
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-02 14:51:11
 * @Descripttion:
 */
import request from '@/utils/request'

// 分页获取退货原因列表
export function getRefundReasonsList(data) {
	return request({
		url: '/adminApi/refundReasons',
		method: 'get',
		data,
	})
}
// 不分页获取退货原因列表
export function getAllRefundReasonsList(data) {
	return request({
		url: '/adminApi/refundReasons/all',
		method: 'get',
		data,
	})
}
// 添加退货原因
export function addRefundReasons(data) {
	return request({
		url: '/adminApi/refundReasons',
		method: 'post',
		data,
	})
}
// 修改退货原因
export function editRefundReasons(data) {
	return request({
		url: `/adminApi/refundReasons/${data.id}`,
		method: 'put',
		data,
	})
}
// 删除退货原因
export function deleteRefundReasons(data) {
	return request({
		url: `/adminApi/refundReasons/${data.id}`,
		method: 'delete',
		data,
	})
}
