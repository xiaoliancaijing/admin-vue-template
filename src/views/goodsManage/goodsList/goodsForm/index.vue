<!--
 * @Author: 刘家辰
 * @Date: 2020-06-17 12:28:12
 * @LastEditTime: 2020-07-09 11:39:21
 * @LastEditors: 刘家辰
 * @Description: 
--> 
<template>
  <el-card class="goods">
    <el-steps :active="active" finish-status="success" :align-center="true">
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <el-tabs v-model.trim="tabs" class="goodsTbs">
      <el-tab-pane name="first" :disabled="true">
        <First ref="fristForm" :detailData="detailData" />
      </el-tab-pane>
      <el-tab-pane name="second" :disabled="true">
        <Second ref="secondForm" :detailData="detailData" />
      </el-tab-pane>
    </el-tabs>
    <div v-if="active === 0" class="opreation">
      <el-button style="margin-top: 12px;" @click="()=>this.$router.back()">取消</el-button>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    </div>
    <div v-else class="opreation">
      <el-button style="margin-top: 12px;" @click="prev">返回上一步</el-button>
      <el-button style="margin-top: 12px;" @click="create">确定</el-button>
    </div>
  </el-card>
</template>

<script>
import First from "./addInformation.vue";
import Second from "./addSku.vue";
import { createGoods, editGoods, getGoodsDetail } from "@/api/goods";
import { Message } from "element-ui";
export default {
  components: {
    First,
    Second
  },
  data() {
    return {
      active: 0,
      tabs: "first",
      goodsId: this.$route.query.eId || null,
      detailData: ""
    };
  },
  created() {
    if (this.goodsId) {
      getGoodsDetail({ id: this.goodsId }).then(res => {
        if (res.success) {
          this.detailData = res.data;
        }
      });
    }
  },
  methods: {
    next() {
      this.$refs.fristForm.$refs.goodsForm.validate(valid => {
        if (valid) {
          this.active = 1;
          this.tabs = "second";
          const { catId } = this.$refs.fristForm.goodsForm.catObj;
          const { parentCatId } = this.$refs.fristForm.goodsForm.parentCatObj;
          this.$refs.secondForm.catId = catId;
          this.$refs.secondForm.parentCatId = parentCatId;
          if (!this.goodsId) {
            if (catId) {
              this.$refs.secondForm.getCatSpec({ catId });
              this.$refs.secondForm.getCatSkus({ catId });
            }
          } else {
            // 编辑
            this.$refs.secondForm.getCatSkus({ catId });
          }
        }
      });
    },
    prev() {
      this.active = 0;
      this.tabs = "first";
    },
    // 创建商品 /编辑
    create() {
      // 第一步
      this.$refs.secondForm.$refs.infomationForm.validate(valid => {
        if (valid) {
          // sku 表单验证
          let SKUdata = this.$refs.secondForm.SKUdata;
          let catSpec = this.$refs.secondForm.catSpecList;
          if (!SKUdata.length) {
            return Message.error("sku不能为空！");
          }
          for (let index = 0; index < SKUdata.length; index++) {
            if (!SKUdata[index].originPrice) {
              return Message.error("商品划线价不能为空！");
            } else if (!SKUdata[index].price) {
              return Message.error("商品未划线价不能为空！");
            } else if (!SKUdata[index].stock) {
              return Message.error("商品库存不能为空！");
            } else if (!SKUdata[index].warningStock) {
              return Message.error("库存预警值不能为空！");
            } else if (!SKUdata[index].img) {
              return Message.error("展示图不能为空！");
            }
          }
          if (!catSpec.length) {
            return Message.error("参数不能为空！");
          }
          for (let index = 0; index < catSpec.length; index++) {
            if (!catSpec[index].value) {
              return Message.error("参数描述不能为空！");
            }
          }

          let {
            afterService,
            catObj,
            supplierObj,
            brandObj,
            parentCatObj,
            id,
            images
          } = this.$refs.fristForm.goodsForm;
          let { SKUcolumn, catSpecList, goodsForm } = this.$refs.secondForm;
          let { detail } = this.$refs.secondForm.infomationForm;
          let afterServiceStr = "";
          let imagesStr = "";
          let detailStr = "";
          afterService.forEach(item => {
            afterServiceStr += item + ",";
          });
          images.forEach(item => {
            imagesStr += item + ",";
          });
          detail.forEach(item => {
            detailStr += item + ",";
          });
          let itemSaveDto = { item: {}, itemSkuList: [] };
          itemSaveDto.item = {
            ...this.$refs.fristForm.goodsForm,
            ...catObj,
            ...supplierObj,
            ...brandObj,
            ...parentCatObj,
            ...goodsForm
          };
          itemSaveDto.item.afterService = afterServiceStr;
          itemSaveDto.item.images = imagesStr;
          itemSaveDto.item.detail = detailStr;
          // 第二步
          let sku = [];
          SKUcolumn.forEach((item, index) => {
            if (item.prop == "sku" + index) {
              sku.push(item.label);
            }
          });
          this.$refs.secondForm.SKUdata.forEach(item => {
            let name = "";
            let properties = "";
            let skus = []; //sku0 sku1 sku2
            Object.keys(item).forEach(j => {
              if (/^sku/.test(j)) {
                skus.push(j);
              }
            });
            skus.forEach((y, index) => {
              properties += sku[index] + ":" + item[`${y}`] + ";";
            });
            skus.forEach(y => {
              name += item[`${y}`] + " ";
            });
            itemSaveDto.itemSkuList.push({
              img: item.img,
              originPrice: item.originPrice,
              price: item.price,
              stock: item.stock,
              warningStock: item.warningStock,
              properties,
              name,
              id: item.id ? item.id : -1
            });
          });
          let catSpecParam = catSpecList.map(item => {
            return { name: item.name, value: item.value };
          });
          itemSaveDto.item.specParamJSON = JSON.stringify(catSpecParam);
          if (this.goodsId) {
            editGoods({ id, ...itemSaveDto }).then(res => {
              if (res.success) {
                Message.success("操作成功！");
                this.$router.push("/goodsManage/goodsList");
              }
            });
          } else {
            createGoods({ ...itemSaveDto }).then(res => {
              if (res.success) {
                Message.success("添加成功！");
                this.$router.push("/goodsManage/goodsList");
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style>
.goodsTbs .el-tabs__header {
  display: none;
}
.goods .opreation {
  width: 200px;
  margin: 0 auto;
}
</style>