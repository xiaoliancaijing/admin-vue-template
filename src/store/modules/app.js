/*
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: xin.chen
 * @LastEditTime: 2020-09-21 16:19:10
 * @Descripttion:
 */

import Cookies from 'js-cookie';
import { login, logout, getInfo } from '@/api/user';
import { getToken } from '@/api/upload';

const state = {
	sidebar: {
		opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
		withoutAnimation: false,
	},

	device: 'desktop',
	upLoadToken: null,

	// 自定义表单类型
	field: [
		{ key: '', name: '单行文本', type: 'text', placeholder: '', disabled: false },
		{ key: '', name: '选择器', type: 'select', placeholder: '' },
		{ key: '', name: '级联选择器', type: 'cascader', placeholder: '', disabled: false },
		{
			key: '',
			name: '日期时间选择器',
			type: 'datetimepicker',
			placeholder: '',
			disabled: false,
		},
		{
			key: '',
			name: '创建条目选择器',
			type: 'allowcreate',
			placeholder: '',
			disabled: false,
		},
	],
};

const mutations = {
	TOGGLE_SIDEBAR: state => {
		state.sidebar.opened = !state.sidebar.opened;
		state.sidebar.withoutAnimation = false;
		if (state.sidebar.opened) {
			Cookies.set('sidebarStatus', 1);
		} else {
			Cookies.set('sidebarStatus', 0);
		}
	},
	CLOSE_SIDEBAR: (state, withoutAnimation) => {
		Cookies.set('sidebarStatus', 0);
		state.sidebar.opened = false;
		state.sidebar.withoutAnimation = withoutAnimation;
	},
	TOGGLE_DEVICE: (state, device) => {
		state.device = device;
	},
	SET_UPLOAD_TOKEN: (state, token) => {
		console.log('set token', token);
		state.upLoadToken = token;
	},
	// 编辑自定义表单类型
	SET_UPLOAD_FIELD: (state, field) => {
		state.field = field;
	},
};

const actions = {
	toggleSideBar({ commit }) {
		commit('TOGGLE_SIDEBAR');
	},
	closeSideBar({ commit }, { withoutAnimation }) {
		commit('CLOSE_SIDEBAR', withoutAnimation);
	},
	toggleDevice({ commit }, device) {
		commit('TOGGLE_DEVICE', device);
	},
	setUpLoadToken({ commit }, token) {
		commit('SET_UPLOAD_TOKEN', token);
	},
	// 编辑自定义表单类型
	setuploadfield({ commit }, field) {
		commit('SET_UPLOAD_FIELD', field);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
