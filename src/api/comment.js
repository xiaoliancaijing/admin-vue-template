/*
 * @Author: tianhao
 * @Date: 2020-06-22 16:33:34
 * @LastEditors: 刘家辰
 * @LastEditTime: 2020-07-04 12:28:06
 * @Descripttion: 评论
 */
import request from '@/utils/request'
export function getCommentList(data) {
	return request({
		url: '/adminApi/comment',
		method: 'get',
		data,
	})
}
export function getDetail(data) {
	return request({
		url: `/adminApi/comment/${data.id}`,
		method: 'get',
		data,
	})
}
export function agree(data) {
	return request({
		url: `/adminApi/comment/${data.id}/agree`,
		method: 'put',
		data,
	})
}
export function ban(data) {
	return request({
		url: `/adminApi/comment/${data.id}/ban`,
		method: 'put',
		data,
	})
}
export function noAgree(data) {
	return request({
		url: `/adminApi/comment/${data.id}/notAgree`,
		method: 'put',
		data,
	})
}
export function cancelBan(data) {
	return request({
		url: `/adminApi/comment/${data.id}/cancelBan`,
		method: 'put',
		data,
	})
}
// 添加假评论
export function createComment(data) {
	return request({
		url: `/adminApi/comment`,
		method: 'post',
		data,
	})
}
// 删除加评论
export function delComment(data) {
	return request({
		url: `/adminApi/comment/${data.id}`,
		method: 'delete',
		data,
	})
}
