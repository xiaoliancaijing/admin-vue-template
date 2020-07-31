<!--
 * @Author:wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2020-06-28 19:15:43
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 单纯 图片上传不做剪切 -->
    <!-- <UploadImg v-model="uploadImgList" :limit="2"></UploadImg>
    <button @click="getImgList">获取消息</button>-->

    <!-- 图片剪切上传 -->
    <!-- <Upload v-model="img" :limit="5"></Upload>
    <div>{{img}}</div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Upload from "@/components/upload";
import UploadImg from "@/components/upload/index";
export default {
  components: {
    // Upload
    UploadImg
  },
  data() {
    return {
      img: "",
      uploadImgList: [
        "http://cdn.test.xiang360.com/qn850a0dc811343c98f6e3d3813b3babac.jpg"
      ]
    };
  },
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"])
  },
  methods: {
    getImgList() {
      console.log(this.uploadImgList);
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
