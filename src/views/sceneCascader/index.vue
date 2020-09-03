<!--
 * @Author: tangrenjie
 * @Date: 2020-09-03 12:34:57
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-03 13:54:10
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
    return {
        code: 0,
        data: [],
    };
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

<style>
</style>