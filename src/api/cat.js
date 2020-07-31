/*
 * @Author: 刘家辰
 * @Date: 2020-06-16 10:49:24
 * @LastEditTime: 2020-06-16 11:13:30
 * @LastEditors: Please set LastEditors
 * @Description:一二级类目管理接口
 */

import request from '@/utils/request';

// 获取类目管理
export function getAllCat(data) {
	return request({
		url: '/adminApi/cats',
		method: 'get',
		data,
	});
}
// 创建类目管理
export function createCat(data) {
	return request({
		url: '/adminApi/cats',
		method: 'post',
		data,
	});
}
// 编辑类目管理
export function editCat(data) {
	return request({
		url: `/adminApi/cats/${data.id}`,
		method: 'put',
		data,
	});
}
// 删除类目管理
export function deleteCat(data) {
	return request({
		url: `/adminApi/cats/${data.id}`,
		method: 'delete',
		data,
	});
}

// 禁用类目管理
export function banCat(data) {
	return request({
		url: `/adminApi/cats/${data.id}/banOrEnable`,
		method: 'put',
		data,
	});
}
