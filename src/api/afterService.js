/*
 * @Author: 刘家辰
 * @Date: 2020-06-16 18:55:40
 * @LastEditTime: 2020-06-19 20:19:05
 * @LastEditors: tianhao
 * @Description:服务管理   serviceManage
 */

import request from '@/utils/request';

// 支持服务管理

// 获取支持服务
export function getService(data) {
	return request({
		url: '/adminApi/afterService',
		method: 'get',
		data,
	});
}

// 创建支持服务
export function createService(data) {
	return request({
		url: '/adminApi/afterService',
		method: 'post',
		data,
	});
}

// 编辑支持服务
export function editService(data) {
	return request({
		url: `/adminApi/afterService/${data.id}`,
		method: 'put',
		data,
	});
}
// 运费规则
export function getFreight(data) {
	return request({
		url: '/adminApi/fareConfig',
		method: 'get',
		data,
	});
}
// 保存运费规则
export function saveFreight(data) {
	return request({
		url: '/adminApi/fareConfig',
		method: 'post',
		data,
	});
}
