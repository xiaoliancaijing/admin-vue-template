/*
 * @Author: wei.chen
 * @Date: 2020-07-31 14:57:36
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-07-31 15:02:21
 * @Descripttion: 配置vue 的指令
 */

import directive from './directives'

const importDirective = Vue => {
	/**
	 * clipboard指令 v-draggable="options"
	 * options = {
	 *  value:    /在输入框中使用v-model绑定的值/,
	 *  success:  /复制成功后的回调/,
	 *  error:    /复制失败后的回调/
	 * }
	 */
	Vue.directive('clipboard', directive.clipboard)
}

export default importDirective
