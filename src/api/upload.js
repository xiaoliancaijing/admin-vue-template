/*
 * @Author: tianhao
 * @Date: 2020-06-12 18:25:22
 * @LastEditors: 刘家辰
 * @LastEditTime: 2020-07-03 10:11:27
 * @Descripttion:
 */
import request from '@/utils/request'
export function getToken(data) {
	return request({
		url: '/adminApi/qiniu/token',
		method: 'get',
		data,
	})
}
