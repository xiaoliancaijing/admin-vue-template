<!--
 * @Author: 刘家辰
 * @Date: 2020-06-17 12:22:39
 * @LastEditTime: 2020-07-22 15:25:33
 * @LastEditors: wei.chen
 * @Description: 
-->
<template>
	<el-form
		ref="goodsForm"
		:model="goodsForm"
		:rules="rules"
		class="goodsForm"
		label-position="right"
		label-width="100px"
	>
		<el-form-item label="选择类目" :required="true" prop="parentCatObj.parentCatId">
			<el-select
				v-model.trim="goodsForm.parentCatObj"
				value-key="parentCatId"
				placeholder="选择商品一级类目"
				@focus="getParentCat('parent')"
				:loading="loading"
				@change="clearCat"
				size="small"
			>
				<el-option
					:label="item.name"
					:value="{ parentCatId: item.id, parentCatName: item.name }"
					v-for="item in parentCatList"
					:key="'parentCat_' + item.id"
				></el-option>
			</el-select>
		</el-form-item>
		<el-form-item :required="true" prop="catObj.catId">
			<el-select
				v-model.trim="goodsForm.catObj"
				value-key="catId"
				placeholder="选择商品二级类目"
				@focus="getParentCat"
				:loading="loading"
				size="small"
			>
				<el-option
					:label="item.name"
					:value="{ catId: item.id, catName: item.name }"
					v-for="item in catList"
					:key="'cat_' + item.id"
				></el-option>
			</el-select>
			<router-link to="/goodsManage/catManage" class="href">+去添加</router-link>
		</el-form-item>
		<el-form-item label="供应商" :required="true" prop="supplierObj.supplierId">
			<el-select
				v-model.trim="goodsForm.supplierObj"
				value-key="supplierId"
				placeholder="供应商名称"
				@focus="getSupper"
				:loading="loading"
				size="small"
			>
				<el-option
					:label="item.name"
					:value="{ supplierId: item.id, supplierName: item.name }"
					v-for="item in supplierList"
					:key="'supplier_' + item.id"
				></el-option>
			</el-select>
			<router-link to="/goodsManage/supplierManage" class="href">+去添加</router-link>
		</el-form-item>
		<el-form-item label="品牌">
			<el-select
				v-model.trim="goodsForm.brandObj"
				value-key="brandId"
				placeholder="品牌"
				@focus="getBrand"
				:loading="loading"
				size="small"
			>
				<el-option
					:label="item.name"
					:value="{ brandId: item.id, brandName: item.name }"
					v-for="item in brandList"
					:key="'brand_' + item.id"
				></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="商品上新">
			<el-radio-group v-model.trim="goodsForm.newFlag">
				<el-radio :label="true">是</el-radio>
				<el-radio :label="false">否</el-radio>
			</el-radio-group>
		</el-form-item>
		<!-- <el-form-item label="商品标题" :required="true" prop="title">
      <el-input
        v-model.trim="goodsForm.title"
        placeholder="标题用于前台商品信息展示"
        maxlength="40"
        size="small"
      ></el-input>
    </el-form-item>-->
		<el-form-item label="商品编码" v-if="goodsForm.id">
			<el-input
				v-model.trim="goodsForm.id"
				placeholder="请输入自定义编码"
				:disabled="true"
				size="small"
			></el-input>
		</el-form-item>
		<el-form-item label="商品名称" :required="true" prop="name">
			<el-input
				v-model.trim="goodsForm.name"
				placeholder="请输入商品名称"
				maxlength="60"
				size="small"
			></el-input>
		</el-form-item>
		<el-form-item label="商品简介" :required="true" prop="summary">
			<el-input
				type="textarea"
				v-model.trim="goodsForm.summary"
				maxlength="60"
				size="small"
				style="width:40%"
			></el-input>
		</el-form-item>
		<el-form-item label="支持服务" :required="true" prop="afterService">
			<el-checkbox-group v-model.trim="goodsForm.afterService">
				<el-checkbox
					:label="item.name"
					v-for="item in serviceList"
					:key="'service_' + item.id"
				>
					{{ item.name }}
				</el-checkbox>
			</el-checkbox-group>
			<router-link to="/goodsManage/serviceManage" class="href">+去添加</router-link>
		</el-form-item>
		<el-form-item label=" 计量单位">
			<el-input
				v-model.trim="goodsForm.unit"
				placeholder="请输入计量单位"
				maxlength="4"
				size="small"
			></el-input>
		</el-form-item>
		<el-form-item label="商品轮播图" :required="true" prop="images">
			<UploadImg v-model.trim="goodsForm.images" :limit="9"></UploadImg>
		</el-form-item>
		<el-form-item label="商品封面图" :required="true" prop="cover">
			<UploadImg v-model.trim="goodsForm.cover"></UploadImg>
		</el-form-item>
	</el-form>
</template>

<script>
import CropperImg from '@/components/cropperImg/index'
import UploadImg from '@/components/upload/index'
import { getAllCat } from '@/api/cat'
import { getList, getSupplierBrand } from '@/api/supplier'
import { getService } from '@/api/afterService'
import { Message } from 'element-ui'
export default {
	components: {
		CropperImg,
		UploadImg,
	},
	props: ['detailData'],
	data() {
		return {
			// 类目 供应商 品牌列表参数 TODO 如果数据过多 后期需要优化
			listQuery: {
				pageIndex: 1,
				pageSize: 100,
			},
			parentCatList: [], // 类目一
			catList: [], //类目二
			supplierList: [], //供应商列表
			brandList: [], //品牌列表
			serviceList: [], //服务列表
			loading: false, //远程加载
			goodsForm: {
				parentCatObj: {
					parentCatId: '',
					parentCatName: '',
				},
				catObj: {
					catId: '',
					catName: '',
				},
				supplierObj: {
					supplierId: '',
					supplierName: '',
				},
				brandObj: {
					brandId: '',
					brandName: '',
				},
				newFlag: false,
				name: '',
				summary: '',
				afterService: [],
				unit: '',
				cover: '',
				images: [],
				id: '', //商品编码
			},
			data: '',
			rules: {
				name: {
					type: 'string',
					required: true,
					message: '商品名称不能为空！',
					trigger: 'blur',
				},
				summary: {
					type: 'string',
					required: true,
					message: '商品简介不能为空！',
					trigger: 'blur',
				},
				afterService: {
					required: true,
					message: '支持服务不能为空！',
				},
				cover: { type: 'url', required: true, message: '封面图不能为空！' },
				images: {
					required: true,
					message: '轮播图不能为空！',
				},
				'catObj.catId': {
					required: true,
					message: '二级类目不能为空！',
				},
				'parentCatObj.parentCatId': {
					required: true,
					message: '一级类目不能为空！',
				},
				'supplierObj.supplierId': {
					required: true,
					message: '供应商不能为空！',
				},
			},
		}
	},
	created() {
		this.getService()
	},
	watch: {
		detailData(newValue, oldValue) {
			if (newValue === oldValue) {
				return false
			}
			this.data = newValue
			let {
				parentCatId,
				parentCatName,
				catId,
				catName,
				supplierId,
				supplierName,
				brandId,
				brandName,
				newFlag,
				name,
				summary,
				afterService,
				unit,
				cover,
				images,
				id,
			} = this.data
			afterService = afterService.split(',')
			afterService.splice(afterService.length - 1, 1)
			let arr = images.split(',')
			arr.splice(arr.length - 1, 1)
			images = arr
			this.goodsForm = {
				parentCatObj: {
					parentCatId,
					parentCatName,
				},
				catObj: {
					catId,
					catName,
				},
				supplierObj: {
					supplierId,
					supplierName,
				},
				brandObj: {
					brandId,
					brandName,
				},
				newFlag,
				name,
				summary,
				afterService,
				unit,
				cover,
				images,
				id,
			}
			// 这里必须在渲染列表中默认写入值 才能显示 important
			this.catList = [{ name: catName, id: catId }]
			this.parentCatList = [{ name: parentCatName, id: parentCatId }]
			this.brandList = [{ name: brandName, id: brandId }]
			this.supplierList = [{ name: supplierName, id: supplierId }]
		},
	},
	methods: {
		// 获取类目
		getParentCat(val) {
			if (val === 'parent') {
				this.loading = true
				getAllCat({
					...this.listQuery,
				}).then(res => {
					if (res.success) {
						this.parentCatList = res.data.list
						this.loading = false
					}
				})
			} else {
				if (this.goodsForm.parentCatObj.parentCatId) {
					this.loading = true
					getAllCat({
						...this.listQuery,
						parentId: this.goodsForm.parentCatObj.parentCatId,
					}).then(res => {
						if (res.success) {
							this.catList = res.data.list
							this.loading = false
						}
					})
				} else {
					return Message.warning('请先选择一级类目！')
				}
			}
		},
		// 获取供应商
		getSupper() {
			this.loading = true
			getList({ ...this.listQuery }).then(res => {
				if (res.success) {
					this.supplierList = res.data.list
					this.loading = false
				}
			})
		},
		// 获取品牌
		getBrand() {
			if (!this.goodsForm.supplierObj.supplierId) {
				return Message.warning('请先选择供应商！')
			}
			this.loading = true
			getSupplierBrand({
				...this.listQuery,
				id: this.goodsForm.supplierObj.supplierId,
			}).then(res => {
				if (res.success) {
					this.brandList = res.data
					this.loading = false
				}
			})
		},
		// 获取支持服务
		getService() {
			getService({ ...this.listQuery }).then(res => {
				if (res.success) {
					this.serviceList = res.data.list
					this.loading = false
				}
			})
		},
		// 重新选择一级类目后 清空二级类目
		clearCat() {
			this.goodsForm.catObj = { catId: '', catName: '' }
		},
	},
}
</script>

<style lang="scss" scoped>
.goodsForm {
	padding-top: 50px;
	width: 60%;
	margin: 0 auto;
}
.href {
	color: dodgerblue;
	&:hover {
		color: dodgerblue;
	}
}
</style>
