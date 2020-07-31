<!--
 * @Author: 刘家辰
 * @Date: 2020-06-17 12:01:15
 * @LastEditTime: 2020-07-10 14:55:30
 * @LastEditors: 刘家辰
 * @Description: 
-->
<template>
  <el-card :body-style="{ padding: '20px' }">
    <el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
      <el-form-item prop="name">
        <el-input
          v-model.trim="searchfrom.name"
          size="small"
          placeholder="请输入商品名称"
          prefix-icon="el-icon-search"
        ></el-input>
      </el-form-item>
      <el-form-item prop="id">
        <el-input
          v-model.trim="searchfrom.id"
          placeholder="请输入商品编码"
          prefix-icon="el-icon-search"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="品类" prop="catName">
        <el-cascader
          :props="catProps"
          v-model.trim="searchfrom.catName"
          clearable
          size="small"
          @change="onChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="品牌" prop="brandId">
        <el-select
          v-model.trim="searchfrom.brandId"
          placeholder="品牌名称"
          size="small"
          @focus="getBrand"
        >
          <el-option label="全部" value />
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select
          v-model.trim="searchfrom.supplierId"
          placeholder="供应商名称"
          size="small"
          @focus="getSupper"
        >
          <el-option label="全部" value />
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上/下架" prop="putOn">
        <el-select v-model.trim="searchfrom.putOn" placeholder="全部" size="small">
          <el-option label="全部" value></el-option>
          <el-option label="上架" :value="true"></el-option>
          <el-option label="下架" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上新" prop="newFlag">
        <el-select v-model.trim="searchfrom.newFlag" placeholder="全部" size="small">
          <el-option label="全部" value></el-option>
          <el-option label="上新" :value="true"></el-option>
          <el-option label="未上新" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')" size="small">重置</el-button>
        <el-button type="primary" @click="add" size="small" icon="el-icon-plus">新增</el-button>
      </el-form-item>
    </el-form>
    <xtable :loadData="getGoods" :column="column" ref="adminList">
      <template v-slot:cover="{ scope }">
        <el-image :src="scope.cover" class="admin_avater" :preview-src-list="[scope.cover]" />
      </template>
      <template v-slot:miniQrCodeLink="{ scope }">
        <el-image
          :src="scope.miniQrCodeLink"
          class="admin_avater"
          :preview-src-list="[scope.miniQrCodeLink]"
        />
      </template>
      <template v-slot:putOn="{ scope }">
        <el-switch
          v-model.trim="scope.putOn"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="putOnGoods(scope.id)"
        ></el-switch>
      </template>
      <template v-slot:newFlag="{ scope }">
        <el-switch
          v-model.trim="scope.newFlag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="newFlagGoods(scope.id)"
        ></el-switch>
      </template>
    </xtable>
  </el-card>
</template>

<script>
import xtable from "@/components/Table";
import { parseTime } from "@/utils";
import { getAllCat } from "@/api/cat";
import { getGoods, putnewGoods, putawayGoods, isEdit } from "@/api/goods";
import { getList } from "@/api/supplier";
import { getBrand } from "@/api/brand";
import { Message } from "element-ui";
export default {
  components: {
    xtable
  },
  data() {
    return {
      catProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (!node.data) {
            getAllCat().then(res => {
              const nodes = Array.from(res.data.list).map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  leaf: level >= 1
                };
              });
              resolve(nodes);
            });
          } else {
            getAllCat({ parentId: node.data.value }).then(res => {
              const nodes = Array.from(res.data.list).map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  leaf: level >= 1
                };
              });
              resolve(nodes);
            });
          }
        }
      },
      column: [
        {
          prop: "createTime",
          label: "创建时间",
          formatter: (row, column) => {
            return parseTime(row.createTime);
          }
        },
        {
          prop: "cover",
          label: "商品图片",
          render: true
        },
        {
          prop: "name",
          label: "商品名称"
        },
        {
          prop: "id",
          label: "商品编码"
        },
        {
          prop: "catName",
          label: "品类",
          formatter: (row, column) => {
            return `${row.parentCatName}-${row.catName}`;
          }
        },
        {
          prop: "supplierName",
          label: "供应商"
        },
        {
          prop: "brandName",
          label: "品牌"
        },
        {
          prop: "stock",
          label: "库存"
        },
        {
          prop: "saleCount",
          label: "累计销量"
        },
        {
          prop: "miniQrCodeLink",
          label: "小程序二维码",
          render: true
        },
        {
          prop: "putOn",
          label: "上/下架",
          render: true
        },
        {
          prop: "newFlag",
          label: "上新",
          render: true
        },
        {
          prop: "actives",
          label: "操作",
          actives: [
            {
              name: "查看",
              method: val => {
                this.$router.push({
                  path: "/goodsManage/goodsList/goodsDetail",
                  query: { id: val.id }
                });
              }
            },
            {
              name: "编辑",
              method: val => {
                // 当前商品是否可编辑
                isEdit({ id: val.id }).then(res => {
                  if (res.success) {
                    this.$router.push({
                      path: "/goodsManage/goodsList/goodsForm",
                      query: { eId: val.id }
                    });
                  }
                });
              }
            }
          ]
        }
      ],
      searchfrom: {
        name: "",
        id: "",
        catId: "",
        brandId: "",
        supplierId: "",
        putOn: "",
        newFlag: "",
        catName: []
      },
      loading: false, //远程加载
      parentCatList: [], //一级类目
      catList: [], //二级类目
      supplierList: [], //供应商列表
      brandList: [], //品牌列表
      addVisible: false,
      editVisible: false,
      passWordVisible: false
    };
  },
  computed: {
    getGoods() {
      return getGoods;
    }
  },
  methods: {
    //   添加
    add() {
      this.$router.push("/goodsManage/goodsList/goodsForm");
    },
    // 重置
    resetForm(formName) {
      // debugger
      this.$refs[formName].resetFields();
      this.$refs.adminList.reset();
      console.log(this.searchfrom);
      this.searchfrom = {
        name: "",
        id: "",
        catId: "",
        brandId: "",
        supplierId: "",
        putOn: "",
        newFlag: "",
        catName: []
      };
    },
    onChange(value) {
      console.log(value);
      this.searchfrom.catId = value[1];
      // delete this.searchfrom.catName
    },
    //搜索
    onClickSearch() {
      console.log(this.searchfrom);
      delete this.searchfrom.catName;
      this.$refs.adminList.update({ ...this.searchfrom });
    },
    //上架
    putOnGoods(id) {
      putawayGoods({ id })
        .then(res => {
          if (res.success) {
            Message.success("操作成功！");
          }
        })
        .catch(() => {
          this.$refs.adminList.update();
        });
    },
    // 上新
    newFlagGoods(id) {
      putnewGoods({ id }).then(res => {
        if (res.success) {
          Message.success("操作成功！");
        }
      });
    },
    // 获取供应商
    getSupper() {
      this.loading = true;
      getList({ ...this.listQuery }).then(res => {
        if (res.success) {
          this.supplierList = res.data.list;
          this.loading = false;
        }
      });
    },
    // 获取品牌
    getBrand() {
      this.loading = true;
      getBrand({ ...this.listQuery }).then(res => {
        if (res.success) {
          this.brandList = res.data.list;
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.admin_avater {
  height: 40px;
  width: 40px;
}
</style>
