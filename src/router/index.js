/*
 * @Author: peng.wan
 * @Date: 2020-07-27 15:03:42
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-08-13 15:18:36
 * @Descripttion:
 */

import Vue from 'vue'
import Router from 'vue-router'
import getRouterList from '@/router/router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 *                               
 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
	noCache							如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
								// 当路由设置了该属性，则会高亮相对应的侧边栏。
								// 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
								// 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
    activeMenu: '/example/list'  
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 公共路由不参与权限
export const constantRoutes = [
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
	},

	{
		path: '/404',
		component: () => import('@/views/404'),
		hidden: true,
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: 'dashboard',
				name: '首页',
				component: () => import('@/views/dashboard/index'),
				meta: { title: '首页', icon: 'dashboard' },
			},
		],
	},
	{
		path: '/test',
		component: Layout,
		redirect: '/dashboard',
		meta: { title: '测试管理' },
		children: [
			{
				path: 'dashboard',
				name: '测试表格',
				component: () => import('@/views/form/index'),
				meta: { title: '测试表格', icon: 'dashboard' },
			},
			{
				path: 'tree',
				name: 'tree',
				component: () => import('@/views/tree/index'),
				meta: { title: 'tree', icon: 'dashboard' },
			},
			{
				path: 'picture',
				name: 'picture',
				component: () => import('@/views/picture/index'),
				meta: { title: 'picture', icon: 'dashboard' },
			},
			{
				path: 'upload',
				name: 'upload',
				component: () => import('@/views/upload/index'),
				meta: { title: 'upload上传', icon: 'dashboard' },
			},
		],
	},

	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: true },
]
let newsRouter = []

if (getRouterList()) {
	newsRouter = constantRoutes.concat(getRouterList())
} else {
	newsRouter = constantRoutes
}

const createRouter = () =>
	new Router({
		// mode: 'history', // require service support
		scrollBehavior: () => ({ y: 0 }),
		routes: newsRouter,
	})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
