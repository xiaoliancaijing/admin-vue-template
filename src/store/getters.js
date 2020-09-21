/*
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: xin.chen
 * @LastEditTime: 2020-09-21 12:14:06
 * @Descripttion:
 */

const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	upLoadToken: state => state.app.upLoadToken,
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	name: state => state.user.name,
	field: state => state.app.field,
};
export default getters;
