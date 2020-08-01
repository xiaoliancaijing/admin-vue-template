/*
 * @Author: hao.tian
 * @Date: 2020-08-01 17:13:11
 * @LastEditors: hao.tian
 * @LastEditTime: 2020-08-01 17:44:06
 * @Descripttion:
 */

export default  regexps = {
	// 电话号
	isPhone = data => {
		let regex = /^[1][1,3,2,4,5,7,8,9][0-9]{9}$/
		return regex.test(data)
	},
	// 邮箱
	isEmail = data => {
		let regex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
		return regex.test(data)
	},
	// 身份证号
	isIdCard = data => {
		let regex = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/
		return regex.test(data)
    },
    // 字母和数字
    letterAndNmuber = data => {
        let regex = /[^\w]/g 
        return regex.test(data)
    },
    // 2位小数
    money = data => {
        let regex = /^[0-9]+\.[0-9]{2}$/ 
        return regex.test(data)
    },
    // http地址
    http = data => {
        let regex = /(http|https):\/\/([\w.]+\/?)\S*/　
        return regex.test(data)
    },
    // 空格
    space = data => {
        let regex = /^[^\s]*$/
        return regex.test(data)
    }
}
