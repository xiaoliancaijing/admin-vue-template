<!--
 * @Author: 刘家辰
 * @Date: 2020-06-22 15:59:20
 * @LastEditTime: 2020-07-13 11:37:54
 * @LastEditors: 刘家辰
 * @Description: 
--> 
<template>
  <div class="goodsDetail">
    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">基本信息</span>
      </div>
      <div class="baseInfomation">
        <el-carousel height="300px" class="swiper" :autoplay="false" indicator-position="outside">
          <el-carousel-item v-for="(item,index) in swiperData" :key="'swiper_'+index">
            <div style="position:relative">
              <img :src="item" />
              <span class="swiper_title" v-if="!index">封面图</span>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="info">
          <p>
            <span class="title">商品名称：</span>
            {{detailData.name}}
          </p>
          <p>
            <span class="title">编码：</span>
            {{detailData.id}}
          </p>
          <p>
            <span class="title">简介：</span>
            {{detailData.summary}}
          </p>
          <p>
            <span class="title">品类：</span>
            {{detailData.parentCatName+"-"+detailData.catName}}
          </p>
          <p>
            <span class="title">品牌：</span>
            {{detailData.brandName}}
          </p>
          <p>
            <span class="title">供应商：</span>
            {{detailData.supplierName}}
          </p>
          <p>
            <span class="title">支持服务：</span>
            <span v-for="(item,index) in afterService" :key="'service_'+index">{{item}}</span>
          </p>
          <p>
            <span class="title">计量单位：</span>
            {{detailData.unit}}
          </p>
          <p>
            <span class="title">上新：</span>
            {{detailData.newFlag?"是":"否"}}
          </p>
        </div>
        <div class="goods_code">
          <img :src="detailData.miniQrCodeLink" />
          <p>-打开微信扫描二维码-</p>
        </div>
      </div>
    </el-card>
    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">规格信息</span>
      </div>
      <el-table :data="SKUdata">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="item in SKUcolumn"
          :key="item.prop"
        >
          <template v-slot="scope" prop="img" v-if="item.prop ==='img'">
            <el-image :src="scope.row.img" class="table_img" :preview-src-list="[scope.row.img]" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">商品参数</span>
      </div>
      <el-table
        :data="JSON.parse(detailData.specParamJSON?detailData.specParamJSON:null)"
        max-height="250"
      >
        <el-table-column prop="name" label="参数名称"></el-table-column>
        <el-table-column prop="value" label="参数描述"></el-table-column>
      </el-table>
    </el-card>
    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">详情描述</span>
      </div>
      <img v-for="item in detailImgs" :key="item" :src="item" class="detailImg" />
    </el-card>
  </div>
</template>

<script>
import { getGoodsDetail } from "@/api/goods";
import { getSku } from "@/utils";

export default {
  data() {
    return {
      detailData: "",
      swiperData: [],
      afterService: "",
      detailImgs: "",
      SKUdata: [],
      SKUcolumn: []
    };
  },
  created() {
    getGoodsDetail({ id: this.$route.query.id }).then(res => {
      if (res.success) {
        this.detailData = res.data;
        this.swiperData.push(res.data.cover);
        // 删除空的
        let arr1 = this.detailData.images.split(",");
        arr1.splice(arr1.length - 1, 1);
        this.swiperData = [this.swiperData, ...arr1];
        this.afterService = this.detailData.afterService.split(",");
        this.detailImgs = this.detailData.detail.split(",");
        this.detailImgs.splice(this.detailImgs.length - 1, 1);
        let arr = []; //表头
        let { itemSkuList } = this.detailData;
        let skuObj = getSku(itemSkuList);
        for (let j = 0; j < itemSkuList.length; j++) {
          let arr = itemSkuList[j].name.split(" ");
          let obj = {};
          for (let i = 0; i < arr.length - 1; i++) {
            obj[`sku${i}`] = arr[i];
          }
          obj.originPrice = itemSkuList[j].originPrice;
          obj.price = itemSkuList[j].price;
          obj.stock = itemSkuList[j].stock;
          obj.warningStock = itemSkuList[j].warningStock;
          obj.img = itemSkuList[j].img;
          this.SKUdata.push(obj);
        }
        //动态表头
        for (let i = 0; i < skuObj.names.length; i++) {
          let obj = {};
          obj.prop = `sku${i}`;
          obj.label = skuObj.names[i];
          arr.push(obj);
        }
        this.SKUcolumn = [
          ...arr,
          {
            prop: "originPrice",
            label: "划线价"
          },
          {
            prop: "price",
            label: "未划线价"
          },
          {
            prop: "stock",
            label: "商品库存"
          },
          {
            prop: "warningStock",
            label: "库存预警值"
          },
          {
            prop: "img",
            label: "展示图"
          }
        ];
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.goodsDetail {
  .baseInfomation {
    display: flex;
    p {
      color: gray;
      font-size: 14px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
    .label {
      font-weight: bold;
    }
    .info {
      margin-left: 80px;
      max-width: 50%;
    }
    .goods_code {
      > img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        display: block;
      }
      position: absolute;
      right: 50px;
    }
    img {
      height: 300px;
      width: 300px;
    }
    .swiper_title {
      display: inline-block;
      background-color: red;
      color: #ffffff;
      text-align: center;
      position: absolute;
      top: 282px;
      left: 0;
      width: 300px;
    }
  }
  .swiper {
    width: 300px;
  }
  .chooseImg {
    width: 100px;
    height: 100px;
  }
  .table_img {
    height: 50px;
    width: 50px;
  }
  .detailImg {
    width: 300px;
    height: 300px;
  }
}
</style>
