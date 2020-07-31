/*
 * @Author: 刘家辰
 * @Date: 2020-06-24 15:07:14
 * @LastEditTime: 2020-06-24 15:12:53
 * @LastEditors: Please set LastEditors
 * @Description: 商品推荐
 */

import request from '@/utils/request'

// 获取分页查询商品推荐信息
export function getGoodsRecommends(data) {
	return request({
		url: '/adminApi/recommends',
		method: 'get',
		data,
	})
}

// 保存商品推荐信息
export function createGoodsRecommends(data) {
	return request({
		url: '/adminApi/recommends',
		method: 'post',
		data,
	})
}

// 删除推荐信息
export function delGoodsRecommends(data) {
	return request({
		url: `/adminApi/recommends/${data.id}`,
		method: 'delete',
		data,
	})
}

// 启用/禁用热销商品
export function banGoodsRecommends(data) {
	return request({
		url: `/adminApi/recommends/${data.id}/banOrEnable`,
		method: 'put',
		data,
	})
}

// 修改推荐信息顺序
export function sortGoodsRecommends(data) {
	return request({
		url: `/adminApi/recommends/${data.id}/sort`,
		method: 'put',
		data,
	})
}
