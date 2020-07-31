<!--
 * @Author: tianhao
 * @Date: 2020-06-22 16:15:15
 * @LastEditors: peng.wan
 * @LastEditTime: 2020-07-15 10:15:19
 * @Descripttion: 
-->
<template>
	<div class="commentManagement">
		<el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
			<el-form-item label="手机号:" prop="phone">
				<el-input
					placeholder="手机号"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.phone"
					maxlength="11"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="昵称:" prop="nickName">
				<el-input
					placeholder="昵称"
					prefix-icon="el-icon-search"
					v-model.trim="ruleForm.nickName"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="评论时间:" prop="time">
				<el-date-picker
					v-model.trim="ruleForm.time"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
					@change="onChangTime"
					size="small"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="状态:" prop="status">
				<el-select v-model.trim="ruleForm.status" placeholder="请选择" size="small">
					<el-option
						v-for="item in states"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型:" prop="type">
				<el-select v-model.trim="ruleForm.type" placeholder="请选择" size="small">
					<el-option value label="全部"></el-option>
					<el-option value="NORMAL" label="用户评论"></el-option>
					<el-option value="FAKE" label="人工添加"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="search">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('ruleForm')">
					重置
				</el-button>
				<el-button
					type="primary"
					size="small"
					@click="() => this.$router.push('/operation/addComment')"
					icon="el-icon-plus"
				>
					添加评论
				</el-button>
			</el-form-item>
		</el-form>
		<Table :loadData="getList" :column="column" ref="table">
			<template v-slot:content="{ scope }">
				<el-tooltip class="tip_item" effect="dark" :content="scope.content" placement="top">
					<span>{{ scope.content }}</span>
				</el-tooltip>
			</template>
			<template v-slot:itemName="{ scope }">
				<el-tooltip
					class="tip_item"
					effect="dark"
					:content="scope.itemName"
					placement="top"
				>
					<span>{{ scope.itemName }}</span>
				</el-tooltip>
			</template>
		</Table>
		<el-dialog
			:title="isCheck ? '审核评论' : '查看评论'"
			:visible.sync="dialogVisible"
			width="30%"
			@closed="
				detail = {}
				isShield = false
			"
		>
			<div>
				<div class="userInfo">
					<div style="display: flex;">
						<div class="userImg">
							<img v-bind:src="detail.avatar" class="avatar" />
						</div>
						<div class="user">
							<p>用户昵称：{{ detail.userNickName ? detail.userNickName : '' }}</p>
							<p>
								<span v-if="detail.userRealName">
									真实姓名：{{ detail.userRealName ? detail.userRealName : '' }}
								</span>
								<span>手机号：{{ detail.phone ? detail.phone : '' }}</span>
							</p>
						</div>
					</div>
					<p style="margin-right:50px">状态：{{ getStatus(detail.status) }}</p>
				</div>
				<el-row></el-row>
				<el-row>
					<el-col :span="24">
						<div class="detail_item">
							<h4>评论时间:</h4>
							{{ parseTime(detail.createTime) }}
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="detail_goods detail_item">
							<h4>评论商品:</h4>
							<router-link
								tag="a"
								:to="{
									path: '/goodsManage/goodsList/goodsDetail',
									query: { id: detail.itemId },
								}"
							>
								<div>
									<img v-bind:src="detail.itemImg" class="pic" />
								</div>
								<div class="googds">
									{{ detail.itemName }}
									<p class="price">￥{{ detail.price }}</p>
									<p class="originPrice">￥{{ detail.originPrice }}</p>
									<p>{{ detail.skuName }}</p>
								</div>
							</router-link>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="detail_item">
							<div>
								<h4>评论内容:</h4>
								{{ detail.content }}
							</div>
							<div>
								<h4>商品满意度:</h4>
								<el-rate
									class="rate"
									disabled
									v-model.trim="detail.itemStar"
								></el-rate>
							</div>
							<div>
								<h4>物流满意度:</h4>
								<el-rate
									class="rate"
									disabled
									v-model.trim="detail.expressSpeedStar"
								></el-rate>
							</div>
						</div>
					</el-col>
				</el-row>
				<div class="demo-image__preview">
					<el-image
						style="width: 100px; height: 100px;margin: 10px 5px;"
						v-for="(item, index) in images"
						:key="index"
						:src="item"
						:preview-src-list="images"
					></el-image>
				</div>
				<!-- <div>
					<img
						class="pics"
						v-for="(item, index) in detail.images"
						:key="index"
						:src="
							item +
								'?imageMogr2/auto-orient/thumbnail/40000@/format/jpg/interlace/1/blur/1x0/quality/85|imageslim'
						"
					/>
				</div> -->
			</div>
			<span slot="footer" class="dialog-footer" v-if="isCheck">
				<el-button type="primary" @click="handleNoAgree" size="small">不通过</el-button>
				<el-button type="primary" @click="handleAgree" size="small">通过</el-button>
			</span>
			<span slot="footer" class="dialog-footer" v-else>
				<el-button type="primary" @click="dialogVisible = false" size="small">
					确 定
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'
import { startEndTime } from '@/core/directives/time'
import {
	getCommentList,
	getDetail,
	agree,
	ban,
	noAgree,
	cancelBan,
	delComment,
} from '@/api/comment'
import { Message } from 'element-ui'
export default {
	components: {
		Table,
	},
	data() {
		return {
			isCheck: false, //是否是审核
			dialogVisible: false,
			ruleForm: {
				phone: '',
				nickName: '',
				time: [],
				status: '',
				type: '',
			},
			detail: {},
			images: [],
			states: [
				{ label: '全部', value: '' },
				{ label: '正常', value: 'AGREE' },
				{ label: '待审核', value: 'WAIT_CHECK' },
				{ label: '不通过', value: 'NOT_AGREE' },
				{ label: '屏蔽', value: 'BAN' },
			],
			column: [
				{
					prop: 'createTime',
					label: '评论时间',
					formatter: (row, column) => {
						return parseTime(row.createTime)
					},
				},
				{ prop: 'userNickName', label: '用户昵称' },
				{
					prop: 'phone',
					label: '手机号',
					formatter: (row, column) => {
						return row.phone ? row.phone : '-'
					},
				},
				{
					prop: 'content',
					label: '评论内容',
					render: true,
				},
				{
					prop: 'itemName',
					label: '评论商品',
					render: true,
				},
				{
					prop: 'type',
					label: '类型',
					formatter: (row, column) => {
						switch (row.type) {
							case 'FAKE':
								return '人工添加'
								break
							default:
								return '用户评论'
								break
						}
					},
				},
				{
					prop: 'status',
					label: '状态',
					formatter: (row, column) => {
						switch (row.status) {
							case 'WAIT_CHECK':
								return '待审核'
							case 'BAN':
								return '屏蔽'
								break
							case 'NOT_AGREE':
								return '不通过'
								break
							default:
								return '正常'
								break
						}
					},
				},
				{ prop: 'operator', label: '审核操作人' },
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.status === 'WAIT_CHECK' && val.type !== 'FAKE') {
									return false
								} else {
									return '查看'
								}
							},
							method: val => {
								getDetail({ id: val.id }).then(res => {
									if (res.code === 200) {
										this.detail = res.data
										this.images = this.detail.images.split(',')
										this.images.splice(this.images.length - 1, 1)
										this.dialogVisible = true
										this.isCheck = false
									} else {
										this.$message.error(res.msg)
									}
								})
							},
						},
						{
							name: val => {
								// 首先判断类型
								if (val.type === 'FAKE') {
									return '删除'
								}
								// 再判断状态
								switch (val.status) {
									case 'WAIT_CHECK':
										return '审核'
										break
									case 'BAN':
										return '解除屏蔽'
										break
									case 'NOT_AGREE':
										return false
										break
									default:
										return '屏蔽'
										break
								}
							},
							method: val => {
								if (val.type === 'FAKE') {
									return this.$confirm('确定删除该条评论吗?', '提示', {
										type: 'warning',
									}).then(() => {
										delComment({ id: val.id }).then(res => {
											if (res.code === 200) {
												Message.success('删除成功！')
												this.$refs.table.reset()
											}
										})
									})
								}
								switch (val.status) {
									case 'WAIT_CHECK':
										getDetail({ id: val.id }).then(res => {
											if (res.code === 200) {
												this.detail = res.data
												this.detail.images = this.detail.images.split(',')
												this.detail.images.splice(
													this.detail.images.length - 1,
													1
												)
												this.isCheck = true
												this.dialogVisible = true
											} else {
												this.$message.error(res.msg)
											}
										})
										break
									case 'BAN':
										this.handleCancelBan(val.id)
										break
									case 'NOT_AGREE':
										return false
										break
									default:
										this.handleBan(val.id)
										break
								}
							},
						},
					],
				},
			],
		}
	},
	computed: {
		getList() {
			return getCommentList
		},
	},
	methods: {
		parseTime(time) {
			return parseTime(time)
		},
		// 不通过
		handleNoAgree() {
			noAgree({ id: this.detail.id }).then(res => {
				if (res.code === 200) {
					this.$refs.table.reset()
					this.dialogVisible = false
					this.$message.success('操作成功')
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		// 屏蔽
		handleBan(id) {
			ban({ id: this.detail.id || id }).then(res => {
				if (res.code === 200) {
					this.$refs.table.reset()
					this.dialogVisible = false
					this.$message.success('操作成功')
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		// 取消屏蔽
		handleCancelBan(id) {
			cancelBan({ id: this.detail.id || id }).then(res => {
				if (res.code === 200) {
					this.$refs.table.reset()
					this.dialogVisible = false
					this.$message.success('操作成功')
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		// 通过
		handleAgree() {
			agree({ id: this.detail.id }).then(res => {
				if (res.code === 200) {
					this.$refs.table.reset()
					this.dialogVisible = false
					this.$message.success('操作成功')
				} else {
					this.$message.error(res.msg)
				}
			})
		},
		// 选择时间
		onChangTime(time) {
			this.ruleForm.startTime = time[0]
			this.ruleForm.endTime = time[1]
		},
		// 查询
		search() {
			// delete this.ruleForm.time
			this.$refs.table.update(this.ruleForm)
		},
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.ruleForm.startTime = null
			this.ruleForm.endTime = null
			// this.$refs.table.reset()
		},
		getStatus(state) {
			switch (state) {
				case 'WAIT_CHECK':
					return '待审核'
					break
				case 'AGREE':
					return '正常'
					break
				case 'BAN':
					return '屏蔽'
					break
				case 'NOT_AGREE':
					return '不通过'
					break
				default:
					return ''
			}
		},
	},
}
</script>

<style lang="scss">
.commentManagement {
	padding: 20px;
}
.rate {
	display: inline;
}
p {
	margin: 8px 0;
}
.detail_item {
	margin: 10px 0;
	h4 {
		display: inline-block;
		width: 100px;
	}
}
.pic {
	width: 100px;
	height: 100px;
}
.price {
	color: red;
}
.originPrice {
	text-decoration: line-through;
}
.detail_goods {
	display: flex;
	margin-top: 10px;
	// cursor: pointer;
}
.googds {
	padding-left: 10px;
}

.pics {
	width: 100px;
	height: 100px;
	margin: 10px 5px;
}
a {
	display: flex;
}
.userInfo {
	display: flex;
	justify-content: space-between;
	.userImg {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20px;
		.avatar {
			width: 100%;
			height: 100%;
		}
	}
}
.tip_item {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.el-tooltip__popper {
	max-width: 500px;
}
</style>
