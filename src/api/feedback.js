/*
 * @Author: tianhao
 * @Date: 2020-06-18 20:22:23
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-18 20:22:49
 * @Descripttion:
 */
import request from '@/utils/request';
export function getList(data) {
	return request({
		url: '/adminApi/feedback',
		method: 'get',
		data,
	});
}
