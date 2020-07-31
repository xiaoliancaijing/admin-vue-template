/*
 * @Author: 刘家辰
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2020-06-16 10:27:20
 * @LastEditors: Please set LastEditors
 * @Description:系统用户管理
 */

import request from '@/utils/request';

// 获取系统用户
export function getAllOperator(data) {
	return request({
		url: '/adminApi/admins',
		method: 'get',
		data,
	});
}

// 创建系统用户
export function createOperator(data) {
	return request({
		url: '/adminApi/admins',
		method: 'post',
		data,
	});
}

// 编辑系统用户
export function editOperator(data) {
	return request({
		url: `/adminApi/admins/${data.id}`,
		method: 'put',
		data,
	});
}

// 删除系统用户
export function delOperator(data) {
	return request({
		url: `/adminApi/admins/${data.id}`,
		method: 'delete',
		data,
	});
}

// 禁用/启用系统用户
export function banOperator(data) {
	return request({
		url: `/adminApi/admins/${data.id}/ban`,
		method: 'put',
		data,
	});
}

// 修改密码
export function changePassword(data) {
	return request({
		url: `/adminApi/admins/${data.id}/passWord`,
		method: 'put',
		data,
	});
}
