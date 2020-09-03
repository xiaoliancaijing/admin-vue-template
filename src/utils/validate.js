/*
 * @Author: 刘家辰
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2020-08-05 16:07:43
 * @LastEditors: peng.wan
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
export function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
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

/**
 * 国内三大运营商手机号前三位集合
 *let ophone = [
        130,
        131,
        132,
        133,
        134,
        135,
        136,
        137,
        138,
        139,
        145,
        147,
        149,
        150,
        151,
        152,
        153,
        155,
        156,
        157,
        158,
        159,
        166,
        171,
        172,
        173,
        175,
        176,
        177,
        178,
        180,
        181,
        182,
        183,
        184,
        185,
        186,
        187,
        188,
        189,
        198,
        199,
    ],
 * @export
 * @param {*} val
 * @returns
 */
export function isPhone(val) {
    const phoneReg = /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[1|2|3|5|6|7|8]|18[0-9]|19[8|9])\d{8}$/
    return phoneReg.test(val)
}