<!--
 * @Author: hao.tian
 * @Date: 2020-07-31 17:33:17
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-03 12:42:37
 * @Descripttion: 表格Demo
-->
<template>
    <div class="form">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="审批人" prop="name">
                <el-input v-model="formInline.name" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <Table
            ref="Table"
            :callbackData="getData"
            :select="choose"
            :single="true"
            :column="tableInit"
        ></Table>
    </div>
</template>

<script>
import Table from "@/components/Basic/Table/index";
import { getList } from "@/api/test";
export default {
    components: {
        Table,
    },
    data() {
        return {
            tableInit: {
                column: [
                    {
                        prop: "updateTime",
                        label: "添加时间",
                        formatter: (row, column) => {},
                    },
                    {
                        prop: "teacherId",
                        label: "老师ID",
                    },
                    {
                        prop: "src",
                        label: "形象照",
                        render: true,
                    },
                    {
                        prop: "name",
                        label: "老师姓名",
                    },

                    {
                        prop: "phone",
                        label: "手机号码",
                    },
                    {
                        prop: "summary",
                        label: "简介",
                        width: "400",
                    },
                    {
                        prop: "position",
                        label: "职称",
                    },
                    {
                        prop: "action",
                        label: "操作",
                        actives: [
                            {
                                name: "编辑",
                                method: (val) => {
                                    this.isAdd = false;
                                    this.dialogVisible = true;
                                    this.ruleForm = { ...val };
                                },
                            },
                            {
                                name: "删除",
                                method: (val) => {
                                    this.$confirm(
                                        "此操作将永久删除, 是否继续?",
                                        "提示",
                                        {
                                            confirmButtonText: "确定",
                                            cancelButtonText: "取消",
                                            type: "warning",
                                        }
                                    ).then(() => {
                                        deleteItem({ id: val.id }).then(
                                            (res) => {
                                                if (res.code === 200) {
                                                    this.$message.success(
                                                        "操作成功"
                                                    );
                                                    this.resetForm();
                                                } else {
                                                    this.$message.error(
                                                        res.msg
                                                    );
                                                }
                                            }
                                        );
                                    });
                                },
                            },
                        ],
                    },
                ],
                data: {
                    totalElements: 1,
                    list: [],
                },
                request: getList(),
            },
            formInline: {
                name: "",
            },
        };
    },
    methods: {
        choose(val) {
            console.log(val);
        },
        onSubmit() {
            this.$refs.update({ ...this.formInline });
        },
        getData(res) {
            console.log(res);
        },
    },
};
</script>

<style scoped>
.form {
    padding: 20px;
}
</style>
