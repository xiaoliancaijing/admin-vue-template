<!--
 * @Author: 刘家辰
 * @Date: 2020-06-12 15:11:11
 * @LastEditTime: 2020-07-03 18:14:45
 * @LastEditors: 刘家辰
 * @Description: 系统账号管理
-->
<template>
  <el-card :body-style="{ padding: '20px' }">
    <el-form :inline="true" :model="searchParams" ref="searchParams" class="demo-form-inline">
      <el-form-item prop="name">
        <el-input
          v-model.trim="searchParams.name"
          placeholder="请输入姓名"
          prefix-icon="el-icon-search"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model.trim="searchParams.phone"
          placeholder="请输入手机号"
          prefix-icon="el-icon-search"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        <el-button type="primary" @click="resetForm('searchParams')" size="small">重置</el-button>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addAccountNumber('adminForm')"
          size="small"
        >添加账号</el-button>
      </el-form-item>
    </el-form>
    <xtable :loadData="getAllOperator" :column="column" ref="adminList">
      <template v-slot:avatar="{ scope }">
        <el-image :src="scope.avatar" class="admin_avater" :preview-src-list="[scope.avatar]" />
      </template>
    </xtable>
    <!-- 添加模态窗 -->
    <el-dialog
      title="新增人员"
      :visible.sync="addVisible"
      @close="beforeClose('adminForm')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="40%"
      custom-class="dialogStyle"
    >
      <el-form
        :model="adminForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        ref="adminForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员名称" prop="name">
              <el-input v-model.trim="adminForm.name" maxlength="20" placeholder="姓名" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone" required>
              <el-input v-model.trim="adminForm.phone" maxlength="11" placeholder="电话" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位" prop="job" required>
              <el-input v-model.trim="adminForm.job" maxlength="20" placeholder="职位" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初始密码" prop="passWord" required>
              <el-input
                v-model.trim="adminForm.passWord"
                maxlength="16"
                type="password"
                placeholder="请输入初始密码"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" required>
              <el-input
                v-model.trim="adminForm.remark"
                maxlength="50"
                placeholder="备注"
                type="textarea"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像" prop="avatar" required>
              <CropperImg v-model.trim="adminForm.avatar"></CropperImg>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtu('adminForm')" size="small">取 消</el-button>
        <el-button type="primary" @click="create" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog
      title="编辑人员"
      :visible.sync="editVisible"
      @close="beforeClose('editForm')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      custom-class="dialogStyle"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        ref="editForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员名称" prop="name" required>
              <el-input v-model.trim="editForm.name" maxlength="20" placeholder="姓名" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone" required>
              <el-input v-model.trim="editForm.phone" maxlength="11" placeholder="电话" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位" prop="job" required>
              <el-input v-model.trim="editForm.job" maxlength="20" placeholder="职位" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" required>
              <el-input
                v-model.trim="editForm.remark"
                maxlength="50"
                type="textarea"
                placeholder="备注"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="头像" prop="avatar" required>
              <CropperImg v-model.trim="editForm.avatar"></CropperImg>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtu('editForm')">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passWordVisible"
      :before-close="() => (passWordVisible = false)"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      custom-class="dialogStyle"
    >
      <el-form
        :model="passWordForm"
        :rules="passwordRules"
        label-width="100px"
        class="demo-ruleForm"
        ref="passWordForm"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="修改密码" prop="passWord" required>
              <el-input
                v-model.trim="passWordForm.passWord"
                maxlength="18"
                type="password"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="确认密码" prop="okpassWord" required>
              <el-input
                v-model.trim="passWordForm.okpassWord"
                maxlength="18"
                type="password"
                size="small"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passWordVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassWord">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import xtable from "@/components/Table";
import CropperImg from "@/components/cropperImg/index";

import {
  getAllOperator,
  createOperator,
  delOperator,
  banOperator,
  editOperator,
  changePassword
} from "@/api/admin";
import { Message } from "element-ui";
import { isPhone } from "@/utils/validate";
export default {
  components: {
    xtable,
    CropperImg
  },
  data() {
    return {
      column: [
        {
          prop: "name",
          label: "姓名"
        },
        {
          prop: "phone",
          label: "手机号"
        },
        {
          prop: "job",
          label: "职位"
        },
        {
          prop: "remark",
          label: "备注"
        },
        {
          prop: "avatar",
          label: "头像",
          render: true
        },
        {
          prop: "banned",
          label: "状态",
          formatter: (row, column, cellValue, index) => {
            return cellValue ? "禁用" : "启用";
          },
          width: 120
        },
        {
          prop: "actives",
          label: "操作",
          actives: [
            {
              name: "编辑",
              method: val => {
                this.editVisible = true;
                this.editForm = { ...val };
              }
            },
            {
              name: "删除",
              method: val => {
                this.$confirm("确定删除账号?", "提示", {
                  type: "warning"
                }).then(() => {
                  delOperator({ ...val }).then(res => {
                    if (res.success) {
                      this.$message({
                        type: "success",
                        message: "删除成功！"
                      });
                      this.reset();
                    }
                  });
                });
              }
            },
            {
              name: row => {
                return row.banned ? "启用" : "禁用";
              },
              method: val => {
                let banned = val.banned ? "启用" : "禁用";
                this.$confirm(`确定${banned}账号?`, "提示", {
                  type: "warning"
                }).then(() => {
                  banOperator({ ...val }).then(res => {
                    if (res.success) {
                      this.$message({
                        type: "success",
                        message: "操作成功！"
                      });
                      this.reset();
                    }
                  });
                });
              }
            },
            {
              name: "修改密码",
              method: val => {
                this.passWordForm = {
                  id: "",
                  passWord: "",
                  okpassWord: ""
                };
                this.passWordVisible = true;
                this.passWordForm.id = val.id;
              }
            }
          ]
        }
      ],
      searchParams: { name: "", phone: "" },
      addVisible: false,
      editVisible: false,
      passWordVisible: false,
      adminForm: {
        name: "",
        phone: "",
        job: "",
        passWord: "",
        remark: "",
        avatar: ""
      },
      editForm: {
        name: "",
        phone: "",
        job: "",
        passWord: "",
        remark: "",
        avatar: ""
      },
      passWordForm: {
        id: "",
        passWord: "",
        okpassWord: ""
      },
      rules: {
        name: {
          type: "string",
          required: true,
          message: "名称不能为空"
        },
        phone: {
          type: "string",
          required: true,
          validator: (rule, value, callback) => {
            if (isPhone(value)) {
              callback();
            } else {
              callback(new Error("请输入正确的手机号"));
            }
          }
        },
        job: {
          type: "string",
          required: true,
          message: "职位不能为空"
        },
        passWord: {
          type: "string",
          required: true,
          message: "密码不能为空"
        },
        remark: {
          type: "string",
          required: true,
          message: "备注不能为空"
        },
        avatar: {
          type: "string",
          required: true,
          message: "头像不能为空"
        }
      },
      passwordRules: {
        passWord: {
          type: "string",
          required: true,
          message: "密码不能为空"
        },
        okpassWord: {
          type: "string",
          required: true,
          message: "密码不能为空"
        }
      }
    };
  },
  computed: {
    getAllOperator() {
      return getAllOperator;
    }
  },
  methods: {
    reset() {
      this.$refs.adminList.reset();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.adminList.reset();
    },
    // 搜索查询
    onSubmit() {
      this.$refs.adminList.update({ ...this.searchParams });
    },
    //创建
    create() {
      this.$refs.adminForm.validate(valid => {
        if (valid) {
          createOperator(this.adminForm).then(res => {
            if (res.success) {
              Message.success("创建成功！！");
              this.addVisible = false;
              this.reset();
            }
          });
        }
      });
    },
    //编辑
    edit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editOperator(this.editForm).then(res => {
            if (res.success) {
              Message.success("修改成功！！");
              this.editVisible = false;
              this.reset();
            }
          });
        }
      });
    },
    // 修改密码
    changePassWord() {
      this.$refs.passWordForm.validate(valid => {
        if (this.passWordForm.passWord !== this.passWordForm.okpassWord) {
          return Message.error("两次密码输入不一致 请重新输入");
        }
        if (valid) {
          changePassword(this.passWordForm).then(res => {
            if (res.success) {
              Message.success("修改成功！！");
              this.passWordVisible = false;
              this.reset();
            }
          });
        }
      });
    },
    // 添加账号Dialog取消
    cancelBtu(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
      this.editVisible = false;
    },
    // 添加账号按钮
    addAccountNumber(formName) {
      this.addVisible = true;
    },
    // 关闭默态窗前的回调函数
    beforeClose(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
      this.editVisible = false;
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
