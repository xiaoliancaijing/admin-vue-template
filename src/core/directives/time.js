/*
 * @Author: tianhao
 * @Date: 2020-06-11 15:18:11
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-07-31 11:50:17
 * @Descripttion:
 */
import monent from 'moment'
/**
 *
 * @param {*} fmt
 * demo: timeFormat(yyyy-MM-dd HH:mm:ss)
 */
export const timeFormat = fmt => {
	var o = {
		'Y+': this.getFullYear(), //年份
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		'H+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds(), //毫秒
	}
	var week = {
		'0': '/u65e5',
		'1': '/u4e00',
		'2': '/u4e8c',
		'3': '/u4e09',
		'4': '/u56db',
		'5': '/u4e94',
		'6': '/u516d',
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') +
				week[this.getDay() + '']
		)
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
			)
		}
	}
	return fmt
}
/**
 *
 * @param {*} time  type [new Date(),new Date()]
 * demo:startEndTime([new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)])
 */
export const startEndTime = time => {
	if (time && time.length) {
		let startTime = time[0].valueOf()
		startTime = new Date(startTime).setHours(0, 0, 0, 0)
		let endTime = time[1].valueOf()
		endTime = new Date(endTime).setHours(23, 59, 59, 0)
		let timeArray = [startTime, endTime]
		return timeArray
	}
}
