/*
 * @Author: hao.tian
 * @Date: 2020-07-31 17:40:49
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-06 17:24:04
 * @Descripttion:
 */
import request from '@/utils/request'
export const getList = data => {
	return {
		url: '/adminApi/banner',
		method: 'get',
		data,
	}
}
// 用户状态管理
export function banState(data) {
	return request({
		url: `/adminApi/users/${data.userId}/banOrEnable`,
		method: 'put',
		data,
	})
}
