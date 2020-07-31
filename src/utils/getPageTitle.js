/*
 * @Author: wei.chen
 * @Date: 2020-06-11 12:42:39
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-06-12 18:59:15
 * @Descripttion:
 */

import defaultSettings from '@/settings';

const title = defaultSettings.title || 'Admin';

export default function getPageTitle(pageTitle) {
	if (pageTitle) {
		return `${pageTitle} - ${title}`;
	}
	return `${title}`;
}
