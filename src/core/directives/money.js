/*
 * @Author: tianhao
 * @Date: 2020-06-11 16:26:31
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-11 16:29:31
 * @Descripttion: 123456  =>
 */
export const moneyFormat = str => {
	if (str) {
		if (!isNaN(str)) {
			str = str.toString()
		}
		var newStr = ''
		var count = 0

		if (str.indexOf('.') == -1) {
			for (var i = str.length - 1; i >= 0; i--) {
				if (count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + ',' + newStr
				} else {
					newStr = str.charAt(i) + newStr
				}
				count++
			}
			str = newStr + '.00' //自动补小数点后两位
		} else {
			for (var i = str.indexOf('.') - 1; i >= 0; i--) {
				if (count % 3 == 0 && count != 0) {
					newStr = str.charAt(i) + ',' + newStr //碰到3的倍数则加上“,”号
				} else {
					newStr = str.charAt(i) + newStr //逐个字符相接起来
				}
				count++
			}
			str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
		}
		return str
	}
}
