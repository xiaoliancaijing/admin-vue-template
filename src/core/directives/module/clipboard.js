/*
 * @Author: wei.chen
 * @Date: 2020-07-31 15:00:39
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-07-31 15:00:51
 * @Descripttion: 复制到粘贴板
 */

import Clipboard from 'clipboard'
export default {
	bind: (el, binding) => {
		const clipboard = new Clipboard(el, {
			text: () => binding.value.value,
		})
		el.__success_callback__ = binding.value.success
		el.__error_callback__ = binding.value.error
		clipboard.on('success', e => {
			const callback = el.__success_callback__
			callback && callback(e)
		})
		clipboard.on('error', e => {
			const callback = el.__error_callback__
			callback && callback(e)
		})
		el.__clipboard__ = clipboard
	},
	update: (el, binding) => {
		el.__clipboard__.text = () => binding.value.value
		el.__success_callback__ = binding.value.success
		el.__error_callback__ = binding.value.error
	},
	unbind: (el, binding) => {
		delete el.__success_callback__
		delete el.__error_callback__
		el.__clipboard__.destroy()
		delete el.__clipboard__
	},
}
