/*
 * @Author: tianhao
 * @Date: 2020-06-12 17:14:55
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-12 17:58:35
 * @Descripttion:
 */

import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		app,
		settings,
		user,
	},
	getters,
	plugins: [
		createPersistedState({
			storage: window.sessionStorage,
		}),
	],
});

export default store;
