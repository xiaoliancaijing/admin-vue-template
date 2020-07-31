/*
 * @Author: wei.chen
 * @Date: 2020-06-11 12:42:39
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-07-31 15:52:21
 * @Descripttion:
 */

import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Admin'

export function getPageTitle(pageTitle) {
	if (pageTitle) {
		return `${pageTitle} - ${title}`
	}
	return `${title}`
}
