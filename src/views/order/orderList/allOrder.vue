<!--
 * @Author: peng.wan
 * @Date: 2020-06-18 15:18:11
 * @LastEditors: 刘家辰
 * @LastEditTime: 2020-07-04 10:27:26
 * @Descripttion: 
--> 
<!--
 * @Author: tianhao
 * @Date: 2020-06-16 15:22:52
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-16 15:58:39
 * @Descripttion: 
--> 
<template>
  <div class="waitDelivered">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="搜索条件:">
        <el-input
          placeholder="请输入订单编号/手机号"
          prefix-icon="el-icon-search"
          v-model.trim="formInline.user"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="下单时间:">
        <el-date-picker
          v-model.trim="formInline.region"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <Table :loadData="getList" ref="table" :column="column"></Table>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
export default {
  components: {
    Table
  },
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      column: [
        { prop: "name", label: "下单时间" },
        { prop: "name", label: "订单编号" },
        { prop: "name", label: "收货人" },
        { prop: "name", label: "收货人手机号" },
        { prop: "name", label: "商品售价" },
        { prop: "name", label: "数量" },
        { prop: "name", label: "应付" },
        { prop: "name", label: "实付" },
        { prop: "name", label: "订单状态" },
        {
          prop: "action",
          label: "操作",
          actives: [
            {
              name: "详情",
              method: val => {
                this.dialogVisible = true;
                this.isAdd = false;
                this.ruleForm = { ...val };
              }
            },
            {
              name: "发货",
              method: val => {
                this.dialogVisible = true;
                this.isAdd = false;
                this.ruleForm = { ...val };
              }
            },
            {
              name: "退款",
              method: val => {
                this.dialogVisible = true;
                this.isAdd = false;
                this.ruleForm = { ...val };
              }
            }
          ]
        }
      ]
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    getList() {}
  }
};
</script>

<style>
</style>