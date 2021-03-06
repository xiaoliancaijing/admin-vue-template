/*
 * @Author: 刘家辰
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2020-07-31 12:54:10
 * @LastEditors: wei.chen
 * @Description:
 */

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @name:
 * @description: 手机号码校验
 * 进行严谨的规则匹配
 * /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
 * 非强校验
 * @param {type}
 * @return:
 */
export function isPhone(val) {
	const phoneReg = /^[1]([3-9])[0-9]{9}$/
	return phoneReg.test(val)
}
