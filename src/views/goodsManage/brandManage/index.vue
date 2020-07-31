<!--
 * @Author: tianhao
 * @Date: 2020-06-12 14:43:02
 * @LastEditors: 刘家辰
 * @LastEditTime: 2020-07-03 10:04:42
-->
<template>
  <div class="brandManage">
    <el-button size="small" type="primary" @click="hanleAdd">+添加</el-button>
    <Table ref="table" :loadData="getBrand" :column="column"></Table>
    <el-dialog
      :title="isAdd ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      @close="handleCel"
      width="300px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌logo" prop="logo">
          <CropperImg v-model.trim="ruleForm.logo"></CropperImg>
        </el-form-item>
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model.trim="ruleForm.name" maxlength="10" placeholder="请输入内容" size="small"></el-input>
        </el-form-item>
        <el-form-item label="关联供应商" prop="supplierId">
          <el-select v-model.trim="ruleForm.supplierId" placeholder="请选择" size="small">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCel">取 消</el-button>
        <el-button type="primary" @click="handleOk('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { url } from "@/config/index";
import CropperImg from "@/components/cropperImg/index";
import { getBrand, addBrand, editBrand } from "@/api/brand";
import { getList } from "@/api/supplier";
import { parseTime } from "@/utils";
export default {
  components: {
    Table,
    CropperImg
  },
  data() {
    return {
      column: [
        { prop: "name", label: "品牌名称" },
        {
          prop: "createTime",
          label: "创建时间",
          formatter: (row, column) => {
            return parseTime(row.createTime);
          }
        },
        { prop: "itemCount", label: "关联商品数" },
        { prop: "supplierName", label: "关联供应商" },
        {
          prop: "action",
          label: "操作",
          actives: [
            {
              name: "编辑",
              method: val => {
                this.dialogVisible = true;
                this.isAdd = false;
                this.getOptions();
                this.ruleForm = { ...val };
                console.log(val);
              }
            }
          ]
        }
      ],
      isAdd: false, //编辑或新增
      dialogVisible: false,
      rules: {
        logo: [{ required: true, message: "请上传品牌logo" }],
        name: [
          { required: true, message: "请输入活动名称" },
          { max: 10, message: "最大长度10个字符" }
        ],
        supplierId: [
          { required: true, message: "请选择关联供应商", trigger: "change" }
        ]
      },
      options: [],
      ruleForm: {},
      format: ""
    };
  },
  created() {
    // this.getqiniuToken();
    // this.getList();
  },
  computed: {
    getBrand() {
      return getBrand;
    }
  },
  methods: {
    handleCel() {
      this.ruleForm = {};
      console.log(this.ruleForm);
      this.dialogVisible = false;
    },
    hanleAdd() {
      this.isAdd = true;
      this.dialogVisible = true;
      this.getOptions();
    },
    getOptions() {
      getList({ pageIndex: 1, pageSize: 100 }).then(res => {
        if (res.code === 200) {
          this.options = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleOk(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid, item) => {
        if (valid) {
          // 查询选中的id对应的name
          for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].id === this.ruleForm.supplierId) {
              this.ruleForm.supplierName = this.options[i].name;
              break;
            }
          }
          if (this.isAdd) {
            addBrand(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.dialogVisible = false;
                this.$refs.table.reset();
                this.ruleForm = {};
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            editBrand(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.dialogVisible = false;
                this.$refs.table.reset();
                this.ruleForm = {};
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.brandManage {
  padding: 20px;
  background-color: #fff;
}
.midInput {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
