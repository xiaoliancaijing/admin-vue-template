<template>
    <div class="tree">
        <el-tree
            v-bind="$attrs"
            :data="treeData"
            node-key="id"
            :props="treeProp"
            default-expand-all
            :highlight-current="true"
            @node-click="handleNodeClick"
        >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="node_label">{{ node.label }}</span>
                <span class="btu">
                    <el-button
                        type="text"
                        size="medium"
                        style="margin-left:10px"
                        @click.stop="() => addDept(data, node)"
                    >
                        <i style="font-size: 18px; " class="el-icon-circle-plus-outline"></i>
                    </el-button>
                    <el-button
                        type="text"
                        size="medium"
                        style="margin-left:10px"
                        @click.stop="() => editDept(data, node)"
                    >
                        <i style="font-size: 18px;color: #000; " class="el-icon-edit"></i>
                    </el-button>
                    <el-button type="text" size="medium" @click.stop="() => remove(node, data)">
                        <i style="font-size: 18px; color:red" class="el-icon-delete"></i>
                    </el-button>
                </span>
            </span>
        </el-tree>
    </div>
</template>

<script>
export default {
    name: "employeeTree",
    props: {
        apiSource: {
            type: Function,
            required: true,
        },
        treeProp: {
            type: Object,
            default() {
                return {
                    label: "deptName", // 指定节点标签为节点对象的某个属性值
                    children: "children", // 指定子树为节点对象的某个属性值
                };
            },
        },
        fixedParams: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            treeData: [],
            params: {}, // 请求的参数
        };
    },
    mounted() {
        console.log(3333333);
        this.getData();
    },
    methods: {
        getData(params) {
            const reqParams = params || this.params;
            this.params = reqParams;
            this.apiSource({
                ...reqParams,
                ...this.fixedParams,
            }).then((res) => {
                const { data } = res;
                this.treeData = data;
            });
        },
        // 节点被点击时的回调
        handleNodeClick(data, node, val) {
            this.$emit("nodeClick", { data, node, val });
        },
        // 添加部门 Btu 事件
        addDept(data, node) {
            // 重置模态窗数据
            this.$emit("addClick", { data, node });
        },
        // 编辑部门 Btu 事件
        editDept(data, node) {
            this.$emit("editClick", { data, node });
        },
        // 编辑部门 Btu 事件
        remove(data, node) {
            this.$emit("remove", { data, node });
        },
        recresh() {
            this.getData();
        },
    },
};
</script>

<style lang="scss" scoped>
.tree {
    display: inline-block;
}
.btu {
    visibility: hidden;
}
.el-tree-node__content:hover .btu {
    visibility: visible;
}
</style>