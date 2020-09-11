<!--
 * @Author: tangrenjie
 * @Date: 2020-09-03 12:34:57
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-11 11:49:04
 * @Descripttion: 
-->

<template>
    <div class="scene">
        <SceneCascader
            v-model="scene"
            @change="changeScene"
            :apiSource="apiSource"
            placeholder="请选择"
        />
    </div>
</template>

<script>
// 保留了Cascader的属性绑定，可以传elementUI的相关属性，例如上边的placeholder
import SceneCascader from "@/components/Business/SceneCascader";
function apiSource() {
    return Promise.resolve({
        code: 0,
        data: [
            {
                createTime: null,
                updateTime: null,
                id: -1,
                pid: null,
                deptName: "我的数据",
                children: [],
            },
            {
                createTime: null,
                updateTime: null,
                id: 0,
                pid: null,
                deptName: "全部数据",
                children: [],
            },
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
    });
}
export default {
    components: {
        SceneCascader,
    },
    data() {
        return {
            scene: "",
            apiSource,
        };
    },
    methods: {
        changeScene(vvv) {
            console.log("值改变了", vvv);
        },
    },
};
</script>

<style lang="scss" scoped>
.scene {
    padding: 20px;
    height: 100vh;
}
</style>