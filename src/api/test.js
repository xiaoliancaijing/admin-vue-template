/*
 * @Author: hao.tian
 * @Date: 2020-07-31 17:40:49
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-07-31 17:41:20
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
