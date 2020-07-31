/*
 * @Author: tianhao
 * @Date: 2020-06-11 16:32:29
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-18 11:21:34
 * @Descripttion:
 */
/**
 *
 * @param {*} type  //
 */
export const isEmpty = type => {
	if (type === undefined) {
		// 只能用 === 运算来测试某个值是否是未定义的
		return false;
	}

	if (type == null) {
		// 等同于 a === undefined || a === null
		return false;
	}

	// String
	if (type == '' || type == null || type == undefined) {
		// "",null,undefined
		return false;
	}
	if (!type) {
		// "",null,undefined,NaN
		return false;
	}

	// Array
	if (type.length == 0) {
		// "",[]
		return false;
	}
	if (!type.length) {
		// "",[]
		return false;
	}

	// Object {}
	if (typeof type === Object) {
		//for in 循环判断
		for (var key in type) {
			return false;
		}
	} else {
		return true;
	}
};
