<!--
 * @Author: tianhao
 * @Date: 2020-06-16 17:32:34
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-17 11:07:21
 * @Descripttion: 
--> 
<!--
 * @Author: tianhao
 * @Date: 2020-06-16 16:25:07
 * @LastEditors: tianhao
 * @LastEditTime: 2020-06-16 17:31:34
 * @Descripttion: 
 已取消、待付款、待发货
 需要传入参数:
 待付款  type:"waitPaid",  待发货 type:"waitDelivered"
--> 
<template>
  <div class="order_detail">
    <el-steps :active="active" finish-status="success">
      <el-step title="提交订单"></el-step>
      <el-step title="支付订单"></el-step>
      <el-step title="平台发货"></el-step>
      <el-step title="确认收货"></el-step>
      <el-step title="完成评价"></el-step>
    </el-steps>
    <div class="state">
      <el-row>
        <div class="order_state">
          当前订单状态：已发货(用户延长收货)
          <div class="actionBtn" v-if="isClose">
            <el-button size="small" type="primary">关闭订单</el-button>
          </div>
          <div class="actionBtn" v-if="isSend">
            <el-button size="small" type="primary">发货</el-button>
            <el-button size="small" type="primary">退款</el-button>
          </div>
        </div>
        <div class="btn">
          <el-button size="small" type="primary">订单追踪</el-button>
        </div>
      </el-row>
    </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="text item">
        <el-form class="demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="发货时间">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单编号">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="交易流水号">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="会员昵称">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="交易流水号">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单来源">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单类型">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="活动营销">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="配送方式"></el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物流单号"></el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="自动确认收货时间"></el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单返现"></el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>收货人信息</span>
      </div>
      <div class="text item">
        <el-form class="demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="收货人">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮政编码">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货地址">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <div class="text item">
        <el-form class="demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品名称">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="售价（元）">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="购买数量">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发货数量">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="小计">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="活动价（元）">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>费用信息</span>
      </div>
      <div class="text item">
        <el-form class="demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商品名称">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运费">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运费规则">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优惠券">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="活动">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="活动优惠">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单总金额">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应付款金额">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作记录</span>
      </div>
      <div class="text item">
        <el-form class="demo-form-inline">
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作者">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作时间">{{formInline.user}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作内容">{{formInline.user}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: 0,
      isClose: false,
      isSend: false,
      tableData: [],
      formInline: {
        user: "芜湖起飞",
        region: ""
      }
    };
  },
  created() {
    if (this.type === "waitPaid") {
      this.isClose = true;
    } else if (this.type === "waitDelivered") {
      this.isSend = true;
    }
  },
  methods: {
    next() {
      if (this.active++ > 4) this.active = 0;
    }
  }
};
</script>

<style lang="scss">
.order_detail {
  padding: 20px;
}
.state {
  border: 1px solid #ccc;
  margin: 20px 0;
  padding: 10px 0;
  .order_state {
    display: inline-block;
    height: 31px;
    line-height: 35px;
  }
  .btn {
    float: right;
  }
  .actionBtn {
    float: right;
    margin-left: 10px;
  }
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  margin-bottom: 20px;
}
.demo-form-inline {
  width: 100%;
}
</style>