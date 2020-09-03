<!--
 * @Author: tangrenjie
 * @Date: 2020-09-03 10:51:39
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-03 14:10:16
 * @Descripttion: 
-->
<template>
    <el-cascader
        v-bind="$attrs"
        :options="options"
        :props="customProps"
        :clearable="clearable"
        @change="changeVal"
        :value="value"
        :show-all-levels="false"
        :size="size"
    ></el-cascader>
</template>

<script>
export default {
    namne: "SceneCascader",
    model: {
        prop: "value", //绑定的值，通过父组件传递
        event: "input", //自定义时间名
    },
    props: {
        apiSource: {
            type: Promise | Function, // Api请求,
            required: true,
        },
        value: Number | String,
        size: {
            type: String,
            default() {
                return "small";
            },
        },
        clearable: {
            type: Boolean,
            default() {
                return true;
            },
        },
        // 自定义渲染
        renderProps: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            options: [],
            customProps: {
                checkStrictly: true,
                emitPath: false,
                ...this.renderProps,
            },
        };
    },
    methods: {
        async init() {
            if (!this.apiSource) {
                throw new Error("apiSource必填哟");
                return;
            }
            // 兼容自定义的 Function， 用于mock
            let api = this.apiSource;
            if (typeof api === "function") {
                api = Promise.resolve(this.apiSource);
            }
            api().then((res) => {
                const { data } = res;
                this.options = data;
            });
        },
        changeVal(val) {
            this.$emit("input", val); // 用于双向绑定，感知不到
            this.$emit("change", val); // 用于其他操作
        },
    },
};

// 删除children为空的

// 方法1
function transfer(arr) {
    arr.forEach((item) => {
        if (
            item.children &&
            Array.isArray(item.children) &&
            item.children.length
        ) {
            transfer(item.children);
        } else {
            delete item.children;
            return;
        }
    });
}
</script>

<style>
</style>