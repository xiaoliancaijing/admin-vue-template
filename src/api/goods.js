/*
 * @Author: 刘家辰
 * @Date: 2020-06-17 12:07:33
 * @LastEditTime: 2020-06-20 18:27:51
 * @LastEditors: Please set LastEditors
 * @Description: 商品列表
 */
import request from '@/utils/request'

// 获取商品
export function getGoods(data) {
	return request({
		url: '/adminApi/item',
		method: 'get',
		data,
	})
}
// 创建商品
export function createGoods(data) {
	return request({
		url: '/adminApi/item',
		method: 'post',
		data,
	})
}
// 编辑商品
export function editGoods(data) {
	return request({
		url: `/adminApi/item/${data.id}`,
		method: 'put',
		data,
	})
}
// 删除商品
export function deleteGoods(data) {
	return request({
		url: `/adminApi/item/${data.id}`,
		method: 'delete',
		data,
	})
}

// 上新商品
export function putnewGoods(data) {
	return request({
		url: `/adminApi/item/${data.id}/newFlagOrNot`,
		method: 'put',
		data,
	})
}
// 上架商品
export function putawayGoods(data) {
	return request({
		url: `/adminApi/item/${data.id}/putOnOrDown`,
		method: 'put',
		data,
	})
}
// 获取商品详情
export function getGoodsDetail(data) {
	return request({
		url: `/adminApi/item/${data.id}`,
		method: 'get',
		data,
	})
}
// 根据商品ID查询sku列表
export function getGoodsInfo(data) {
	return request({
		url: `/adminApi/item/${data.id}/sku`,
		method: 'get',
		data,
	})
}
// 商品是否可编辑
export function isEdit(data) {
	return request({
		url: `/adminApi/item/${data.id}/editFlag`,
		method: 'get',
		data,
	})
}
