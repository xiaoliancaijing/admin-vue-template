//获取动态路由方法
import Layout from '@/layout'

// 权限路由表
let constantRoutes2 = [
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
		meta: { title: '测试', icon: 'dashboard', code: 'null' },
		children: [
			{
				path: 'dashboard',
				name: '测试表格',
				component: () => import('@/views/form/index'),
				meta: { title: '测试表格', icon: 'dashboard', code: 'null' },
			},
			{
				path: 'tree',
				name: 'tree',
				component: () => import('@/views/tree/index'),
				meta: { title: 'tree', icon: 'dashboard', code: 'null' },
			},
			{
				path: 'picture',
				name: 'picture',
				component: () => import('@/views/picture/index'),
				meta: { title: 'picture', icon: 'dashboard', code: 'null' },
			},
		],
	},

	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: true },
]

function getRouterList() {
	//登录之后获取动态路由
	let role_router = ''
	role_router = sessionStorage.getItem('role_router')
	var userRouter = JSON.parse(role_router)
	var userRouters = []
	constantRoutes2.map((value, i) => {
		let child = []
		if (
			(value.meta && value.meta.code && userRouter && userRouter.includes(value.meta.code)) ||
			(value.meta && userRouter && !value.meta.code)
		) {
			value.children.forEach(function(item, i) {
				// console.log(item.code)
				if (userRouter.includes(item.meta.code) || !item.meta.code) {
					child.push(item)
				}
			})
			if (child.length > 0) {
				value.children = child
			}
			userRouters.push(value)
		}
	})

	return userRouters
}

export default getRouterList
