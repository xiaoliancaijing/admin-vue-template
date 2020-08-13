<!--
 * @Author: peng.wan
 * @Date: 2020-08-03 10:08:19
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-03 14:39:17
 * @Descripttion: 
-->
<template>
	<component :is="type" v-bind="linkProps(to)">
		<slot />
	</component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
	props: {
		to: {
			type: String,
			required: true,
		},
	},
	computed: {
		isExternal() {
			return isExternal(this.to)
		},
		type() {
			if (this.isExternal) {
				return 'a'
			}
			return 'router-link'
		},
	},
	methods: {
		linkProps(to) {
			if (this.isExternal) {
				return {
					href: to,
					target: '_blank',
					rel: 'noopener',
				}
			}
			return {
				to: to,
			}
		},
	},
}
</script>
