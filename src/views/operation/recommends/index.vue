<!--
 * @Author: 刘家辰
 * @Date: 2020-06-24 15:05:32
 * @LastEditTime: 2020-07-10 12:25:54
 * @LastEditors: 刘家辰
 * @Description: 商品推荐
-->
<template>
  <div class="goodsRecommend">
    <el-card :body-style="{ padding: '20px' }">
      <el-tabs v-model.trim="type" @tab-click="checkTabs">
        <el-tab-pane label="臻品优选" name="BEST"></el-tab-pane>
        <el-tab-pane label="热搜推荐" name="SEARCH"></el-tab-pane>
        <el-tab-pane label="热销商品" name="HOT"></el-tab-pane>
      </el-tabs>
      <el-row>
        <el-col>
          <el-form ref="searchForm" :model="searchParams" :inline="true" v-if="type == 'BEST'">
            <el-form-item label="搜索选项" prop="itemName">
              <el-input
                v-model.trim="searchParams.itemName"
                size="small"
                placeholder="请输入商品名称"
                prefix-icon="el-icon-search"
              />
            </el-form-item>
            <el-form-item label="状态" prop="banned">
              <el-select v-model.trim="searchParams.banned" size="small">
                <el-option label="全部" value></el-option>
                <el-option label="启用" :value="false"></el-option>
                <el-option label="禁用" :value="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="search" type="primary" size="small">搜索</el-button>
              <el-button @click="reset" type="primary" size="small">重置</el-button>
            </el-form-item>
          </el-form>
          <el-button
            @click="
							addVisible = true
							chooseGoods = []
						"
            type="primary"
            size="small"
          >+添加商品</el-button>
        </el-col>
      </el-row>
      <xtable
        :loadData="getGoodsRecommends"
        :column="type == 'BEST' ? column : hotColumn"
        ref="adminList"
        :params="{ type }"
      >
        <template v-slot:banned="{ scope }" v-if="type == 'BEST'">
          <el-switch
            v-model.trim="scope.banned"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="false"
            :inactive-value="true"
            @change="ban(scope.id)"
          ></el-switch>
        </template>
        <template v-slot:cover="{ scope }">
          <el-image
            :src="scope.cover"
            style="width:50px;height:50px"
            :preview-src-list="[scope.cover]"
          />
        </template>
      </xtable>
    </el-card>
    <el-dialog
      title="添加商品"
      :visible.sync="addVisible"
      :before-close="() => (addVisible = false)"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      custom-class="dialogStyle"
      width="1000px"
    >
      <el-form ref="goodSearchForm" :model="goodsParmas" :inline="true">
        <el-form-item prop="name">
          <el-input
            v-model.trim="goodsParmas.name"
            size="small"
            placeholder="请输入商品名称"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item prop="actType">
          <el-select v-model.trim="searchParams.actType" size="small" placeholder="选择活动类型">
            <el-option label="限时抢购" value="TIME"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="catId">
          <el-cascader :props="props" size="small" v-model.trim="goodsParmas.catId"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchGoods">搜索</el-button>
          <el-button type="primary" size="small" @click="resetGoods">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="goodsTable">
        <xtable :loadData="getGoods" ref="goodsForm" :column="goodsColumn" :select="select">
          <template v-slot:cover="{ scope }">
            <el-image
              :src="scope.cover"
              style="width:50px;height:50px"
              :preview-src-list="[scope.cover]"
            />
          </template>
        </xtable>
        <div>
          <el-table :data="chooseGoods" ref="chooseForm" style="margin-top:20px" :border="true">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="item in chooseColumn"
              :key="'choose_' + item.prop"
            >
              <template v-slot="scope" v-if="item.prop == 'cover'">
                <el-image
                  :src="scope.row.cover"
                  style="width:50px;height:50px"
                  :preview-src-list="[scope.row.cover]"
                />
              </template>
              <template v-slot="scope" v-else-if="item.prop == 'actives'">
                <el-button @click="delChoose(scope)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="listQuery.pageIndex"
            :page-size.sync="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pageSizes"
            :total="chooseGoods.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="create" size="small">确认选择</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import xtable from "@/components/Table";
import {
  getGoodsRecommends,
  delGoodsRecommends,
  createGoodsRecommends,
  banGoodsRecommends,
  sortGoodsRecommends
} from "@/api/recommends";
import { getGoods } from "@/api/goods";
import { getAllCat } from "@/api/cat";
import { Message } from "element-ui";
import { parseTime } from "@/utils";
export default {
  components: {
    xtable
  },
  data() {
    return {
      parentId: 0, //一级类目选择id
      addVisible: false,
      type: "BEST",
      searchParams: {
        itemName: "",
        banned: ""
      },
      goodsParmas: {
        name: "",
        catId: "",
        actType: ""
      },
      chooseGoods: [],
      listQuery: {
        pageIndex: 1,
        pageSize: 20
      },
      pageSizes: [10, 20, 30, 50],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          getAllCat({
            pageIndex: 1,
            pageSize: 100,
            parentId: node.value
          }).then(res => {
            let parentCatList = [];
            if (res.success) {
              res.data.list.forEach(item => {
                let obj = {};
                obj.label = item.name;
                obj.value = item.id;
                if (item.parentId) {
                  obj.leaf = true;
                }
                parentCatList.push(obj);
              });
            }
            resolve(parentCatList);
          });
        }
      },
      // 臻品优选
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
        { prop: "itemName", label: "商品名称" },
        {
          prop: "sort",
          label: "顺序"
        },
        {
          prop: "banned",
          label: "启用/禁用",
          render: true
        },
        {
          prop: "actives",
          label: "操作",
          actives: [
            {
              name: "移除",
              method: val => {
                this.$confirm("确定移除?", "提示", {
                  type: "warning"
                }).then(() => {
                  delGoodsRecommends({ ...val }).then(res => {
                    if (res.success) {
                      this.$message({
                        type: "success",
                        message: "移除成功！"
                      });
                      this.reset();
                    }
                  });
                });
              }
            },
            {
              name: "修改顺序",
              method: val => {
                this.$prompt("修改展示顺序", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  inputPattern: /^[0-9]{1,5}$/,
                  inputErrorMessage: "请输入1-99999的数字",
                  inputPlaceholder: "请输入展示顺序"
                }).then(({ value }) => {
                  sortGoodsRecommends({ sort: value, id: val.id }).then(res => {
                    if (res.success) {
                      Message.success("操作成功！");
                      this.$refs.adminList.reset();
                    }
                  });
                });
              }
            }
          ]
        }
      ],
      hotColumn: [
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
        { prop: "itemName", label: "商品名称" },
        {
          prop: "sort",
          label: "顺序"
        },
        {
          prop: "actives",
          label: "操作",
          actives: [
            {
              name: "移除",
              method: val => {
                this.$confirm("确定移除?", "提示", {
                  type: "warning"
                }).then(() => {
                  delGoodsRecommends({ ...val }).then(res => {
                    if (res.success) {
                      this.$message({
                        type: "success",
                        message: "移除成功！"
                      });
                      this.checkTabs();
                    }
                  });
                });
              }
            },
            {
              name: "修改顺序",
              method: val => {
                this.$prompt("修改展示顺序", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  inputPattern: /^[0-9]{1,5}$/,
                  inputErrorMessage: "请输入1-99999的数字",
                  inputPlaceholder: "请输入展示顺序"
                }).then(({ value }) => {
                  sortGoodsRecommends({ sort: value, id: val.id }).then(res => {
                    if (res.success) {
                      Message.success("操作成功！");
                      this.checkTabs();
                    }
                  });
                });
              }
            }
          ]
        }
      ],
      goodsColumn: [
        {
          prop: "name",
          label: "商品名称"
        },
        {
          prop: "cover",
          label: "商品图片",
          render: true
        }
      ],
      chooseColumn: [
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
          prop: "actives",
          label: "操作",
          actives: [
            {
              name: "删除",
              method: val => {
                this.$confirm("确定删除?", "提示", {
                  type: "warning"
                }).then(() => {
                  delGoodsRecommends({ ...val }).then(res => {
                    if (res.success) {
                      this.$message({
                        type: "success",
                        message: "删除成功！"
                      });
                      this.checkTabs();
                    }
                  });
                });
              }
            }
          ]
        }
      ]
    };
  },
  computed: {
    getGoodsRecommends() {
      return getGoodsRecommends;
    },
    getGoods() {
      return getGoods;
    }
  },
  methods: {
    checkTabs() {
      this.$refs.adminList.update({ type: this.type });
    },
    reset() {
      this.$refs.adminList.update({ type: this.type });
      this.$refs.searchForm.resetFields();
    },
    search() {
      this.$refs.adminList.update({ type: this.type, ...this.searchParams });
    },
    //创建
    create() {
      let arr = this.chooseGoods.map(item => {
        return { itemId: item.id, itemName: item.name };
      });
      if (!arr.length) {
        return Message.warning("请先选择商品！");
      }
      createGoodsRecommends({ items: arr, type: this.type }).then(res => {
        if (res.success) {
          Message.success("创建成功！");
          this.addVisible = false;
          this.$refs.goodSearchForm.resetFields();
          this.checkTabs();
        }
      });
    },
    // 禁用
    ban(id) {
      banGoodsRecommends({ id }).then(res => {
        if (res.success) {
          Message.success("操作成功！");
        }
      });
    },
    searchGoods() {
      let { catId, name, actType } = this.goodsParmas;
      catId = catId[1]; //只取二级类目
      this.$refs.goodsForm.update({ catId, name, actType });
    },
    resetGoods() {
      this.$refs.goodSearchForm.resetFields();
    },
    select(val) {
      let arr = [];
      val.forEach(item => {
        arr.unshift(item);
      });
      this.chooseGoods = arr;
    },
    delChoose(scope) {
      let arr = this.chooseGoods.filter(item => {
        return item.id !== scope.row.id;
      });
      this.chooseGoods = arr;
    },
    // 已选择的列表
    // 修改每页展示条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
    },
    // 页数
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
    }
  }
};
</script>

<style lang="scss">
.goodsRecommend {
  // .el-table td {
  //   padding: 0;
  // }
  .el-dialog__body {
    height: 650px;
    overflow-y: auto;
  }
  .goodsTable {
    display: flex;
    justify-content: space-between;
  }
}
</style>
