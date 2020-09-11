<!--
 * @Author: tangrenjie
 * @Date: 2020-09-03 10:51:39
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-11 11:47:48
 * @Descripttion: 
-->
<template>
    <el-cascader
        v-bind="$attrs"
        :options="options"
        :props="customProps"
        :clearable="clearable"
        @change="changeVal"
        :value="val"
        :show-all-levels="false"
        :size="size"
        ref="cascader"
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
            type: Function, // Api请求,
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
                return {
                    value: "id",
                    label: "deptName",
                    checkStrictly: true,
                    emitPath: false,
                };
            },
        },
    },
    mounted() {
        this.init();
    },
    computed: {
        val() {
            if (typeof this.value === "number") {
                return String(this.value);
            } else {
                return this.value;
            }
        },
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
            this.apiSource().then((res) => {
                const { data } = res;
                transfer(data);
                parseValueToString(data);
                this.options = data;
            });
        },
        changeVal(val) {
            this.$emit("input", val); // 用于双向绑定，感知不到
            this.$emit("change", val); // 用于其他操作
            this.$refs.cascader.dropDownVisible = false;
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
function parseValueToString(options) {
    options.forEach((opt) => {
        opt.id = String(opt.id);
        if (opt.children && opt.children.length > 0) {
            parseValueToString(opt.children);
        }
    });
}
</script>

<style>
</style>