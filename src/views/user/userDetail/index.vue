<!--
 * @Author: tianhao
 * @Date: 2020-06-17 12:26:38
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-07 17:50:25
 * @Descripttion: 
-->
<template>
	<div class="userDetail">
		<el-card class="left-card">
			<div slot="header" class="clearfix">
				<span>基本信息</span>
			</div>
			<div class="text item">
				<div>
					<div class="block">
						<el-avatar :size="60" :src="userInfo.avatar || circleUrl"></el-avatar>
					</div>
					<div class="centent_center baseInfo_body">
						<div class="baseInfo_body_item">
							<span>ID</span>
							<span>{{ userInfo.id }}</span>
						</div>
						<div class="baseInfo_body_item">
							<span>昵称</span>
							<span>{{ userInfo.nickName }}</span>
						</div>
						<!-- <div class="baseInfo_body_item">
							<span>真实姓名</span>
							<span>{{ userInfo.name }}</span>
						</div> -->
						<!-- <div class="baseInfo_body_item">
              <span>专享邀请ID</span>
              <span></span>
            </div> -->
						<div class="baseInfo_body_item">
							<span>注册时间</span>
							<span>{{ createTime }}</span>
						</div>
						<!-- <div class="baseInfo_body_item">
              <span>用户等级</span>
              <span></span>
            </div> -->
						<!-- <div class="baseInfo_body_item">
							<span>性别</span>
							<span>{{ sex }}</span>
						</div> -->
						<!-- <div class="baseInfo_body_item">
							<span>生日</span>
							<span>{{ userInfo.birthday || '未填写' }}</span>
						</div> -->
						<!-- <div class="baseInfo_body_item">
              <span>微信号</span>
              <span></span>
            </div> -->
						<!-- <div class="baseInfo_body_item">
							<span>是否绑定微信</span>
							<span>{{ userInfo.weChat ? '是' : '否' }}</span>
						</div> -->
						<!-- <div class="baseInfo_body_item">
              <span>绑定支付宝</span>
              <span></span>
            </div>
            <div class="baseInfo_body_item">
              <span>绑定银行卡</span>
              <span></span>
            </div>
            <div class="baseInfo_body_item">
              <span>直属粉丝</span>
              <span></span>
            </div> -->
						<div class="baseInfo_body_item">
							<span>初次登录小程序时间</span>
							<span>{{ firstLoginMini }}</span>
						</div>
						<!-- <div class="baseInfo_body_item">
              <span>初次登录APP时间</span>
              <span></span>
            </div> -->
						<!-- <div class="baseInfo_body_item">
              <span>总登录次数</span>
              <span></span>
            </div>
            <div class="baseInfo_body_item">
              <span>最近一次登录时间</span>
              <span></span>
            </div> -->
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="right-card">
			<div slot="header" class="clearfix">
				<span>行为数据</span>
			</div>
			<div class="texts item">
				<el-tabs>
					<!-- <el-tab-pane label="登录情况">
            <Table :loadData="getList" ref="table" :column="column"></Table>
          </el-tab-pane> -->
					<!-- <el-tab-pane label="分享记录">
            <Table :loadData="getShareList" ref="secondTable" :column="secondColumn"></Table>
          </el-tab-pane> -->
					<el-tab-pane label="自购记录">
						<Table :loadData="getOwnBuyList" :params="id" :column="thirdColumn"></Table>
					</el-tab-pane>
					<!-- <el-tab-pane label="关系绑定记录">
            <Table :loadData="getBindList" ref="fourthTable" :column="fourthColumn"></Table>
          </el-tab-pane> -->
					<el-tab-pane label="收货地址">
						<Table
							:loadData="getAddressList"
							:params="id"
							:column="addressColumn"
						></Table>
					</el-tab-pane>
					<!-- <el-tab-pane label="收货明细">
            <Table :loadData="getDetilList" ref="sixthTable" :column="sixthColumn"></Table>
          </el-tab-pane> -->
					<el-tab-pane label="优惠券信息">
						<Table
							:loadData="getCouponList"
							ref="seventhTable"
							:params="id"
							:column="seventhColumn"
						></Table>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-card>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'
import { getUserInfo, getUserAddress, getUserOrder, getUserCoupons } from '@/api/user'
import router from '../../../router'
export default {
	components: {
		Table,
	},
	data() {
		return {
			column: [
				{ prop: 'name', label: '登录时间' },
				{ prop: 'name', label: '登录终端' },
				{ prop: 'name', label: '最长停留时长功能页面' },
				{ prop: 'name', label: '最高频次触发功能' },
				{ prop: 'name', label: '从未触发功能' },
			],
			secondColumn: [
				{ prop: 'name', label: '分享时间' },
				{ prop: 'name', label: '分享发生终端' },
				{ prop: 'name', label: '分享内容' },
				{ prop: 'name', label: '分享类型' },
				{ prop: 'name', label: '分享是否产生购买' },
				{ prop: 'name', label: '分享购买人数' },
			],
			thirdColumn: [
				{
					prop: 'createTime',
					label: '下单时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'orderNum', label: '订单编号' },
				{
					prop: 'couponDeductAmount',
					label: '优惠',
					formatter: (row, column) => {
						return `${row.couponDeductAmount || 0}元`
					},
				},
				{
					prop: 'fare',
					label: '运费',
					formatter: (row, column) => {
						if (row.fare === 0) {
							return '包邮'
						}
					},
				},
				{
					prop: 'payPrice',
					label: '实付',
					formatter: (row, column) => {
						return `${row.payPrice}元`
					},
				},
				{ prop: 'itemName', label: '商品名称' },
				{ prop: 'itemNum', label: '购买数量' },
				{
					prop: 'actType',
					label: '商品活动',
					formatter: (row, column) => {
						if (row.actType === 'PROMOTION') {
							return '限时抢购'
						} else {
							return '普通订单'
						}
					},
				},
				{
					prop: 'status',
					label: '订单状态',
					formatter: (row, column, cellValue, index) => {
						switch (row.status) {
							case 'UN_PAY':
								return '未支付'
								break
							case 'WAIT_SHIP':
								return '待发货'
								break
							case 'SHIPPED':
								return '已发货'
								break
							case 'DONE':
								return '已完成'
								break
							case 'CANCEL':
								return '已取消'
								break
							case 'CLOSE':
								return '已关闭'
								break
							case 'AFTER_SALE':
								return '售后处理'
							default:
								return ''
						}
					},
				},
			],
			fourthColumn: [
				{ prop: 'name', label: '关系绑定时间' },
				{ prop: 'name', label: '绑定用户昵称' },
				{ prop: 'name', label: '关系用户等级' },
				{ prop: 'name', label: '关系' },
				{ prop: 'name', label: '绑定方式' },
				{ prop: 'name', label: '绑定关系关联商品' },
			],
			addressColumn: [
				{ prop: 'consignee', label: '收货人' },
				{ prop: 'phone', label: '收货人手机号' },
				{
					prop: 'province',
					label: '收货地址',
					formatter: row => {
						return `${row.province}${row.address}${row.district}`
					},
				},
				{ prop: 'orderNum', label: '关联订单笔数' },
			],
			sixthColumn: [
				{ prop: 'name', label: '收益时间' },
				{ prop: 'name', label: '收益类型' },
				{ prop: 'name', label: '收益产生用户昵称' },
				{ prop: 'name', label: '收益内容' },
			],
			seventhColumn: [
				{
					prop: 'createTime',
					label: '获得时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{
					prop: 'status',
					label: '优惠券状态',
					formatter: (row, column) => {
						switch (row.status) {
							case 'UN_USE':
								return '未使用'
								break
							case 'EXPIRED':
								return '已过期'
								break
							case 'USED':
								return '已使用'
								break
							default:
								return ''
								break
						}
					},
				},
				{
					prop: 'useDateTime',
					label: '使用时间',
					formatter: (row, column) => {
						return parseTime(row.useDateTime)
					},
				},
				{
					prop: 'subtractPrice',
					label: '优惠券内容',
					formatter: (row, column) => {
						return `满${row.fullPrice}减${row.subtractPrice}`
					},
				},
				{ prop: 'itemName', label: '适用商品' },
			],
			userInfo: '',
			circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
			createTime: '',
			firstLoginMini: '',
			sex: '',
			id: { id: this.$route.query.userId || null },
		}
	},
	created() {
		// console.log(this.$route)

		getUserInfo({ id: this.$route.query.userId }).then(res => {
			if (res.success) {
				this.userInfo = res.data
				this.createTime = parseTime(res.data.createTime)
				this.firstLoginMini = parseTime(res.data.firstLoginMini)
				if (res.data.sex === 'MAN') {
					this.sex = '男'
				} else if (res.data.sex === 'WOMAN') {
					this.sex = '女'
				} else {
					this.sex = '未知'
				}
			}
		})
	},
	computed: {
		getAddressList: {
			get() {
				return getUserAddress
			},
			set() {},
		},
		getOwnBuyList: {
			get() {
				return getUserOrder
			},
			set() {},
		},
		getCouponList: {
			get() {
				return getUserCoupons
			},
			set() {},
		},
	},
	methods: {
		onClickBtu() {
			console.log('====================')
		},
		getShareList() {},
		getBindList() {},
		getdetaiList() {},
		getCouponList() {},
	},
}
</script>

<style>
.userDetail {
	padding: 20px;
	display: flex;
	width: 100%;
}
.texts {
	font-size: 14px;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}

.left-card {
	width: 15%;
	margin-right: 20px;
}
.right-card {
	width: 85%;
	/* float: right; */
}
.user_head {
	width: 280px;
	height: 160px;
}
.centent_center {
	text-align: center;
}
.baseInfo_header {
	/* height: 150px;
  padding-bottom: 20px; */
	background-color: #f2f2f2;
	text-align: center;
}
.baseInfo_header_img {
	width: 120px;
	height: 120px;
}
.centent_center {
	text-align: center;
}

.baseInfo_body_item {
	display: flex;
}
.baseInfo_header_nick {
	padding-top: 10px;
	height: 40px;
}
.baseInfo_body_item span {
	flex: 1;

	padding-top: 10px;
	padding-bottom: 10px;
	width: 49%;

	border-top: 1px solid #999;
	border-left: 1px solid #999;
}
.baseInfo_body_item span:first-child {
	background-color: #f5f5f5;
}
.baseInfo_body_item span:last-child {
	border-right: 1px solid #999;
}
.baseInfo_body_item:last-child {
	border-bottom: 1px solid #999;
}
.user_info_summary {
	min-height: 120px;
}

.tag {
	padding: 24px 0;
	text-align: center;
}
.block {
	text-align: center;
	padding-bottom: 20px;
}
</style>
