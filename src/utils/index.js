/**
 * Created by PanJiaChen on 16/11/18.
 */

import chalk from 'chalk'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (typeof time === 'string') {
			if (/^[0-9]+$/.test(time)) {
				// support "1548221490638"
				time = parseInt(time)
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}

		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
	if (('' + time).length === 10) {
		time = parseInt(time) * 1000
	} else {
		time = +time
	}
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return (
			d.getMonth() +
			1 +
			'月' +
			d.getDate() +
			'日' +
			d.getHours() +
			'时' +
			d.getMinutes() +
			'分'
		)
	}
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
			decodeURIComponent(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"')
				.replace(/\+/g, ' ') +
			'"}'
	)
}

/**
 * @name:
 * @description: sku解析  [{properties:"材质:羊毛;尺寸:M;颜色:黑色;"},{properties:"材质:羊毛;尺寸:M;颜色:黑色;"}]
 * @param {Array}   val  包含properties值数组
 * @return: names:属性名  sku 属性值
 */
export function getSku(val) {
	if (!val) {
		return false
	}
	let properties = []
	let names = []
	let sku = []
	let arr2 = []
	let obj = {}
	let handle = []
	for (let i = 0; i < val.length; i++) {
		properties.push(val[i].properties)
	}
	for (let i = 0; i < properties.length; i++) {
		let item = properties[i].split(';')

		let arr1 = []
		for (let j = 0; j < item.length; j++) {
			let name = item[j].split(':')
			handle.push(name[0], name[1])
			arr1.push(name[0])
			arr2.push(name[1])
			obj[name[0]] = []
			Object.keys(obj).forEach(item => {
				if (item == name[0]) {
					// console.log(name[1], obj[item])
					obj[item].push(name[1])
				}
			})
		}
		// 由于拼接时候最后一个会有空，需要删除
		arr1.splice(arr1.length - 1, 1)
		arr2.splice(arr2.length - 1, 1)
		names = arr1
		sku = Array.from(new Set(arr2))
	}
	// 模拟用户操作
	handle = handle.filter(item => {
		return item
	})
	return { names, sku, handle }
}

/**
 * @name:
 * @description: 复制内容到粘贴板
 * @param {str} content : 需要复制的内容
 * @param {str} message : 复制完后的提示，不传则默认提示"复制成功"
 * @return:
 */

export function copyToClip(content, message) {
	var aux = document.createElement('input')
	aux.setAttribute('value', content)
	document.body.appendChild(aux)
	aux.select()
	document.execCommand('copy')
	document.body.removeChild(aux)
	if (message == null) {
		confirm('复制成功')
	} else {
		confirm(message)
	}
}
