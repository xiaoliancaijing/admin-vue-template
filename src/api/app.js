/*
 * @Author: xin.chen
 * @Date: 2020-09-21 19:03:58
 * @LastEditors: xin.chen
 * @LastEditTime: 2020-09-21 19:08:38
 * @Descripttion:
 */

import request from '@/utils/request';

// 获取支持服务
export function getWorksheet(data) {
	return request({
		url: '/worksheetlist',
		method: 'get',
		data,
	});
}
