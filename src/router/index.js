import Vue from 'vue'
import Router from 'vue-router'

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
	// 商品管理
	{
		path: '/goodsManage',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: '商品管理',
			icon: 'nested',
		},
		children: [
			{
				path: 'goodsList',
				component: () => import('@/views/goodsManage/goodsList/index'),
				meta: { title: '商品列表', icon: 'form' },
			},
			{
				path: 'goodsList/goodsForm',
				hidden: true,
				component: () => import('@/views/goodsManage/goodsList/goodsForm/index'),
				meta: { title: '添加商品' },
			},
			{
				path: 'goodsList/goodsDetail',
				hidden: true,
				component: () => import('@/views/goodsManage/goodsList/goodsDetail/index'),
				meta: { title: '商品详情' },
			},

			{
				path: 'brandManage',
				component: () => import('@/views/goodsManage/brandManage/index'),
				meta: { title: '品牌管理', icon: 'brand' },
			},
			{
				path: 'supplierManage',
				component: () => import('@/views/goodsManage/supplierManage/index'),
				meta: { title: '供应商管理', icon: 'supperlier' },
			},
			{
				path: 'catManage',
				component: () => import('@/views/goodsManage/catManage/index'),
				meta: { title: '类目管理', icon: 'cat' },
			},
			{
				path: 'catManage/attributeList',
				hidden: true,
				component: () => import('@/views/goodsManage/catManage/attributeList/index'),
				meta: { title: 'SKU列表', activeMenu: '/goodsManage/catManage' },
			},
			{
				path: 'catManage/parameterList',
				hidden: true,
				component: () => import('@/views/goodsManage/catManage/parameterList/index'),
				meta: { title: '参数列表', activeMenu: '/goodsManage/catManage' },
			},
			{
				path: 'serviceManage',
				component: () => import('@/views/goodsManage/afterService/index'),
				meta: { title: '商品规则', icon: 'service' },
			},
			// {
			// 	path: 'freightRules',
			// 	component: () => import('@/views/goodsManage/freightRules/index'),
			// 	meta: { title: '运费规则' },
			// },
		],
	},
	// 用户管理
	{
		path: '/user',
		component: Layout,
		// redirect: 'userList',
		name: '用户管理',
		meta: { title: '', icon: 'setting' },
		children: [
			{
				path: 'userList',
				name: '用户列表',
				component: () => import('@/views/user/userList/index'),
				meta: { title: '用户管理', icon: 'user' },
			},
			{
				path: 'userDetail',
				name: '用户详情',
				component: () => import('@/views/user/userDetail/index'),
				hidden: true,
				activeMenu: '/user/userList',
				meta: { title: '用户详情', icon: 'setting' },
			},
		],
	},
	// 订单管理
	{
		path: '/order',
		component: Layout,
		redirect: 'orderList',
		name: '订单管理',
		meta: { title: '', icon: 'order' },
		children: [
			{
				path: 'orderList',
				name: '订单列表',
				component: () => import('@/views/order/orderList/index'),
				meta: { title: '订单管理' },
			},
			{
				path: 'detail',
				name: '订单详情',
				hidden: true,
				component: () => import('@/views/order/orderList/detail/detail'),
				meta: {
					title: '订单详情',
					icon: '',
					activeMenu: '/order/orderList',
				},
			},
			{
				path: 'waitDetail',
				name: '订单详情',
				hidden: true,
				component: () => import('@/views/order/orderList/detail/waitDetail'),
				meta: {
					title: '订单详情',
					icon: '',
					activeMenu: '/order/orderList',
				},
			},
		],
	},
	// 运营管理
	{
		path: '/operation',
		component: Layout,
		redirect: 'noRedirect',
		name: '运营管理',
		meta: { title: '运营管理', icon: 'operation' },
		children: [
			{
				path: 'bannerList',
				name: 'banner推广',
				component: () => import('@/views/operation/banner/index'),
				meta: { title: 'banner推广', icon: 'banner' },
			},
			{
				path: 'commentManagement',
				name: '评论管理',
				component: () => import('@/views/operation/comment/index'),
				meta: { title: '评论管理', icon: 'comment' },
			},
			{
				path: 'addComment',
				name: '添加评论',
				hidden: true,
				component: () => import('@/views/operation/comment/addComment'),
				meta: { title: '添加评论', icon: 'comment' },
			},
			{
				path: 'goodsRecommend',
				name: '商品推荐',
				component: () => import('@/views/operation/recommends/index'),
				meta: { title: '商品推荐', icon: 'recommends' },
			},
		],
	},
	// 营销管理
	{
		path: '/marketManage',
		component: Layout,
		name: '营销管理',
		redirect: '/marketManage/activity',
		meta: { title: '营销管理', icon: 'market' },
		children: [
			{
				path: 'activity',
				name: 'activity',
				component: () => import('@/views/marketManage/activity/index.vue'),
				meta: { title: '限时抢购', icon: 'activity' },
			},
			{
				path: 'addActivity',
				name: 'addActivity',
				// hidden: true,
				component: () => import('@/views/marketManage/activity/addActivity/index.vue'),
				// meta: { title: '' },
			},
			{
				path: 'activityDetail',
				name: 'activityDetail',
				hidden: true,
				component: () => import('@/views/marketManage/activity/activityDetail/index.vue'),
				meta: { title: '活动明细' },
			},
			{
				path: 'couponManage',
				name: 'couponManage',
				component: () => import('@/views/marketManage/couponManage/index.vue'),
				meta: { title: '优惠券管理', icon: 'coupon' },
			},
			{
				path: 'addCoupon',
				name: 'addCoupon',
				hidden: true,
				component: () => import('@/views/marketManage/couponManage/addCoupon/index.vue'),
				meta: { title: '' },
			},
			{
				path: 'couponDetail',
				name: 'couponDetail',
				hidden: true,
				component: () => import('@/views/marketManage/couponManage/couponDetail/index.vue'),
				meta: { title: '优惠券明细' },
			},
		],
	},
	// 售后管理
	{
		path: '/afterSalesManagement',
		component: Layout,
		redirect: '/afterSalesManagement/refundList',
		name: '售后管理',
		meta: { title: '售后管理', icon: 'afterSales' },
		children: [
			{
				path: 'refundList',
				name: 'refundList',
				component: () => import('@/views/afterSalesManagement/refundList/index'),
				meta: { title: '售后申请', icon: 'form' },
			},
			{
				path: 'refundPage',
				name: 'refundPage',
				hidden: true,
				component: () => import('@/views/afterSalesManagement/refundList/refundPage/index'),
				meta: { title: '售后操作' },
			},
			{
				path: 'refundDetail',
				name: 'refundDetail',
				hidden: true,
				component: () =>
					import('@/views/afterSalesManagement/refundList/refundDetail/index'),
				meta: { title: '售后详情' },
			},
			{
				path: 'refundSause',
				name: 'refundSause',
				// hidden: true,
				component: () => import('@/views/afterSalesManagement/refundSause/index'),
				meta: { title: '售后原因', icon: 'form' },
			},
			{
				path: 'feedback',
				name: '意见反馈',
				component: () => import('@/views/afterSalesManagement/feedback/index'),
				meta: { title: '意见反馈', icon: 'feedback' },
			},
		],
	},
	// 系统配置
	{
		path: '/system',
		component: Layout,
		redirect: '/system/admin',
		name: '系统配置',
		meta: { title: '系统配置', icon: 'setting' },
		children: [
			{
				path: 'admin',
				name: '账号管理',
				component: () => import('@/views/Admin'),
				meta: { title: '账号管理', icon: 'admin' },
			},
		],
	},
	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: true },
]
const createRouter = () =>
	new Router({
		// mode: 'history', // require service support
		scrollBehavior: () => ({ y: 0 }),
		routes: constantRoutes,
	})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
