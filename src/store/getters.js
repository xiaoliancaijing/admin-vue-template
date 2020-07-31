/*
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-06-23 15:53:13
 * @Descripttion:
 */

const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	upLoadToken: state => state.app.upLoadToken,
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	name: state => state.user.name,
}
export default getters
