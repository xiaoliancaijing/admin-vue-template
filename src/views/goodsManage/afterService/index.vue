<!--
 * @Author: 刘家辰
 * @Date: 2020-06-16 18:50:04
 * @LastEditTime: 2020-07-03 18:24:04
 * @LastEditors: 刘家辰
 * @Description: 
-->
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="运费规则">
      <freightRules />
    </el-tab-pane>
    <el-tab-pane label="支持服务">
      <div>
        <el-row>
          <el-col :span="12">
            <el-button
              @click="addVisible = true;adminForm = {};parentId = 0;"
              type="primary"
              size="small"
            >+添加服务</el-button>
          </el-col>
        </el-row>
      </div>
      <xtable :loadData="getService" :column="column" ref="adminList">
        <template v-slot:icon="{ scope }">
          <el-image :src="scope.icon" class="admin_avater" :preview-src-list="[scope.icon]" />
        </template>
      </xtable>
      <!-- 添加模态窗 -->
      <el-dialog
        title="新增服务"
        :visible.sync="addVisible"
        :before-close="() => (addVisible = false)"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        width="20%"
      >
        <el-form :model="adminForm" :rules="rules" label-width="100px" ref="adminForm">
          <el-row>
            <el-col>
              <el-form-item label="图标" prop="icon" required>
                <CropperImg v-model.trim="adminForm.icon" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="服务名称" prop="name" required>
                <el-input
                  v-model.trim="adminForm.name"
                  maxlength="10"
                  placeholder="请输入展示顺序"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="服务说明" prop="description" required>
                <el-input
                  v-model.trim="adminForm.description"
                  maxlength="200"
                  placeholder="请输入展示顺序"
                  type="textarea"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="create">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑模态框 -->
      <el-dialog
        title="编辑服务"
        :visible.sync="editVisible"
        :before-close="() => (editVisible = false)"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        width="20%"
      >
        <el-form :model="adminForm" :rules="rules" label-width="100px" ref="adminForm">
          <el-row>
            <el-col>
              <el-form-item label="图标" prop="icon" required>
                <CropperImg v-model.trim="adminForm.icon"></CropperImg>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="服务名称" prop="name" required>
                <el-input
                  v-model.trim="adminForm.name"
                  maxlength="10"
                  placeholder="请输入展示顺序"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="服务说明" prop="description" required>
                <el-input
                  v-model.trim="adminForm.description"
                  maxlength="200"
                  placeholder="请输入展示顺序"
                  type="textarea"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </span>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import xtable from "@/components/Table";
import CropperImg from "@/components/cropperImg/index";
import freightRules from "../freightRules/index";
import { getService, createService, editService } from "@/api/afterService";
import { parseTime } from "@/utils";
import { Message } from "element-ui";
export default {
  components: {
    xtable,
    CropperImg,
    freightRules
  },
  data() {
    return {
      column: [
        {
          prop: "icon",
          label: "图标",
          render: true
        },
        {
          prop: "name",
          label: "服务名称"
        },
        {
          prop: "createTime",
          label: "创建时间",
          formatter: (row, column, cellValue, index) => {
            return parseTime(cellValue);
          }
        },
        {
          prop: "description",
          label: "内容描述"
        },
        {
          prop: "actives",
          label: "操作",
          actives: [
            {
              name: "编辑",
              method: val => {
                this.editVisible = true;
                this.adminForm = { ...val };
              }
            }
          ]
        }
      ],
      addVisible: false,
      editVisible: false,
      adminForm: {
        name: "",
        description: "",
        icon: ""
      },
      parentId: 0,
      rules: {
        name: {
          type: "string",
          required: true,
          message: "请输入正确的服务名称,不能为标点、特殊符号",
          Whitespace: true,
          pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
        },
        description: {
          type: "string",
          required: true,
          message: "服务说明不能为空"
        },
        icon: { type: "string", required: true, message: "图标不能为空" }
      },
      freightForm: {
        freeShip: "",
        farePrice: "",
        fare: "",
        priceAchieve: ""
      },
      freightColumn: [
        {
          prop: "",
          label: "地区名称（省）"
        },
        {
          prop: "",
          label: "运费"
        },
        {
          prop: "",
          label: "操作"
        }
      ]
    };
  },
  computed: {
    getService() {
      return getService;
    }
  },
  methods: {
    reset() {
      this.$refs.adminList.reset();
    },
    //创建
    create() {
      this.$refs.adminForm.validate(valid => {
        if (valid) {
          createService({ ...this.adminForm, parentId: this.parentId }).then(
            res => {
              if (res.success) {
                Message.success("创建成功！");
                this.addVisible = false;
                this.reset();
                if (this.parentId) {
                  window.location.reload();
                }
              }
            }
          );
        }
      });
    },
    //编辑
    edit() {
      this.$refs.adminForm.validate(valid => {
        if (valid) {
          editService(this.adminForm).then(res => {
            if (res.success) {
              Message.success("修改成功！");
              this.editVisible = false;
              this.reset();
            }
          });
        }
      });
    },
    // 禁用
    ban(id) {
      banCat({ id }).then(res => {
        if (res.success) {
          Message.success("操作成功！");
        }
      });
    },
    // 保存
    submitForm() {}
  }
};
</script>

<style lang="scss" scoped>
.admin_avater {
  height: 40px;
  width: 40px;
}
</style>
