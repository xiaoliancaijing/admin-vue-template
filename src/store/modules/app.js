/*
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-23 17:56:44
 * @Descripttion:
 */

import Cookies from 'js-cookie'
import { login, logout, getInfo } from '@/api/user'
import { getToken } from '@/api/upload'

const state = {
	sidebar: {
		opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
		withoutAnimation: false,
	},

	device: 'desktop',
	upLoadToken: null,
}

const mutations = {
	TOGGLE_SIDEBAR: state => {
		state.sidebar.opened = !state.sidebar.opened
		state.sidebar.withoutAnimation = false
		if (state.sidebar.opened) {
			Cookies.set('sidebarStatus', 1)
		} else {
			Cookies.set('sidebarStatus', 0)
		}
	},
	CLOSE_SIDEBAR: (state, withoutAnimation) => {
		Cookies.set('sidebarStatus', 0)
		state.sidebar.opened = false
		state.sidebar.withoutAnimation = withoutAnimation
	},
	TOGGLE_DEVICE: (state, device) => {
		state.device = device
	},
	SET_UPLOAD_TOKEN: (state, token) => {
		console.log('set token', token)
		state.upLoadToken = token
	},
}

const actions = {
	toggleSideBar({ commit }) {
		commit('TOGGLE_SIDEBAR')
	},
	closeSideBar({ commit }, { withoutAnimation }) {
		commit('CLOSE_SIDEBAR', withoutAnimation)
	},
	toggleDevice({ commit }, device) {
		commit('TOGGLE_DEVICE', device)
	},
	setUpLoadToken({ commit }, token) {
		commit('SET_UPLOAD_TOKEN', token)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
