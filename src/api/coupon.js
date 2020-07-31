/*
 * @Author: peng.wan
 * @Date: 2020-07-01 11:33:48
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-06 11:11:19
 * @Descripttion:
 */
import request from '@/utils/request'

// 新增优惠券
export function addCoupon(data) {
	return request({
		url: '/adminApi/coupon',
		method: 'post',
		data,
	})
}
// 获取优惠券列表
export function getCouponList(data) {
	return request({
		url: '/adminApi/coupon',
		method: 'get',
		data,
	})
}
// 获取优惠券详情
export function getCouponInfo(data) {
	return request({
		url: `/adminApi/coupon/${data.id}`,
		method: 'get',
		data,
	})
}
// 编辑优惠券
export function editCoupon(data) {
	return request({
		url: `/adminApi/coupon/${data.id}`,
		method: 'put',
		data,
	})
}
// 删除优惠券
export function deleteCoupon(data) {
	return request({
		url: `/adminApi/coupon/${data.id}`,
		method: 'delete',
		data,
	})
}
// 获取优惠券统计信息
export function getStatisticsInfo(data) {
	return request({
		url: `/adminApi/coupon/${data.id}/statistics`,
		method: 'get',
		data,
	})
}
// 获取持有详情
export function getHoldDetailInfo(data) {
	return request({
		url: `/adminApi/coupon/${data.id}/holdDetail`,
		method: 'get',
		data,
	})
}
// 优惠券启用/禁用管理
export function banState(data) {
	return request({
		url: `/adminApi/coupon/${data.id}/banOrEnable`,
		method: 'put',
		data,
	})
}
