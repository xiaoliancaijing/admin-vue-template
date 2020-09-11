<!--
 * @Author: tangrenjie
 * @Date: 2020-09-11 15:08:53
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-11 15:48:31
 * @Descripttion: 
-->
<template>
    <div class="demo-tree">
        <EmployeeTree
            :apiSource="apiSource"
            @nodeClick="nodeClick"
            @editClick="editClick"
            @addClick="addClick"
            @remove="remove"
            ref="treeData"
        />
        <!--添加/编辑部门节点弹框-------------------start-->
        <el-dialog
            :title="dialogTitle"
            :visible.sync="treeDialogVisible"
            class="tree-operate-dialog"
            width="400px"
            @close="treeDialogVisible=false"
            :close-on-click-modal="false"
            :destroy-on-close="true"
        >
            <el-form ref="treeForm" :model="treeForm" label-width="100px" :rules="rules">
                <el-form-item :label="dialogTitle" prop="deptName">
                    <el-input maxlength="10" v-model.trim="treeForm.deptName"></el-input>
                </el-form-item>
                <el-form-item label="上级部门">
                    <span>{{ deptName }}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveTree">确 定</el-button>
                <el-button @click="treeDialogVisible=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--添加/编辑部门节点弹框-------------------end-->
    </div>
</template>

<script>
import EmployeeTree from "@/components/Business/employeeTree";
function apiSource() {
    return Promise.resolve({
        code: 0,
        data: [
            {
                createTime: null,
                updateTime: null,
                id: 0,
                pid: null,
                deptName: "广告事业部",
                children: [
                    {
                        createTime: 1598950494000,
                        updateTime: 1598950494000,
                        id: 1,
                        pid: 0,
                        deptName: "陈鑫的测试部门",
                        children: [],
                    },
                    {
                        createTime: 1599533608000,
                        updateTime: 1599533608000,
                        id: 2,
                        pid: 0,
                        deptName: "运营部",
                        children: [
                            {
                                createTime: 1599551002000,
                                updateTime: 1599551002000,
                                id: 3,
                                pid: 2,
                                deptName: "运营一部",
                                children: [],
                            },
                        ],
                    },
                    {
                        createTime: 1599555894000,
                        updateTime: 1599555894000,
                        id: 4,
                        pid: 0,
                        deptName: "陈伟测试部门",
                        children: [],
                    },
                    {
                        createTime: 1599640569000,
                        updateTime: 1599720362000,
                        id: 8,
                        pid: 0,
                        deptName: "test在",
                        children: [],
                    },
                    {
                        createTime: 1599708363000,
                        updateTime: 1599708363000,
                        id: 9,
                        pid: 0,
                        deptName: "测试部",
                        children: [
                            {
                                createTime: 1599794104000,
                                updateTime: 1599794134000,
                                id: 13,
                                pid: 9,
                                deptName: "测试三部",
                                children: [],
                            },
                            {
                                createTime: 1599794145000,
                                updateTime: 1599794145000,
                                id: 14,
                                pid: 9,
                                deptName: "测试一部",
                                children: [],
                            },
                        ],
                    },
                    {
                        createTime: 1599708826000,
                        updateTime: 1599708826000,
                        id: 11,
                        pid: 0,
                        deptName: "测试2部",
                        children: [],
                    },
                ],
            },
        ],
    });
}
export default {
    name: "tree-demo",
    components: {
        EmployeeTree,
    },
    data() {
        return {
            apiSource,
            // 新建/编辑部门 模态窗数据
            treeForm: {
                pid: "", // 部门 id
                deptName: "", // 部门名称
            },
            // 校检
            rules: {
                deptName: [
                    {
                        required: true,
                        message: "请输入部门名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 40,
                        message: "长度在 3 到 40 个字符",
                        trigger: "blur",
                    },
                ],
            },
            deptName: "", // 模态窗展示上级部门名称
            dialogTitle: "", // 新建/编辑部门 模态窗标题
            treeDialogVisible: false, // 新建/编辑部门 模态窗 状态
        };
    },
    methods: {
        nodeClick({ data, node }) {
            console.log("nodeClick", data, node);
        },
        editClick({ data, node }) {
            // 重置模态窗数据
            this.treeForm = {
                pid: "",
                deptName: "",
            };
            this.dialogTitle = "编辑部门";
            this.treeDialogVisible = true;
            this.treeForm.deptId = data.id;
            this.treeForm.deptName = data.deptName;
            this.deptName = node.parent.label || "无";
        },
        addClick({ data, node }) {
            // 重置模态窗数据
            this.treeForm = {
                pid: "",
                deptName: "",
            };
            this.dialogTitle = "新建部门";
            this.treeDialogVisible = true;
            this.deptName = node.label;
            this.treeForm.pid = data.id;
        },
        remove({ data, node }) {
            this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    Message.success("删除成功！！！");
                    this.$refs.treeData.recresh();
                })
                .catch(() => {});
        },
        saveTree() {
            this.$refs.treeForm.validate(async (valid) => {
                if (valid) {
                    Message.success("保存成功");
                    this.treeDialogVisible = false;
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
</style>