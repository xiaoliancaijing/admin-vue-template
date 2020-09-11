<!--
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: tangrenjie
 * @LastEditTime: 2020-09-11 15:28:53
 * @Descripttion: vue 入口文件,全局的代码可以放在这里
-->
<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import store from "@/store";
import { getToken } from "@/api/upload";

export default {
    name: "App",
    data() {
        return {
            tokenTimer: null,
        };
    },
    created() {
        sessionStorage.setItem("role_router", '["null"]'); //本地用。正式项目中删除
    },
    mounted() {
        this.getqiniuToken();
        // 每隔 8 分钟去刷新一次token
        this.tokenTimer = setInterval(() => {
            this.getqiniuToken();
        }, 480000);
    },
    beforeDestroy() {
        this.stopTimer();
    },
    methods: {
        stopTimer() {
            if (this.tokenTimer) {
                clearInterval(this.tokenTimer);
                this.tokenTimer = null;
            }
        },
        // 获取上传的token
        getqiniuToken() {
            if (store.getters.upLoadToken) {
                console.log("获取upload token 8 分钟");
                getToken().then((res) => {
                    if (res.code === 200) {
                        store.dispatch("app/setUpLoadToken", res.data.uptoken);
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        },
    },
};
</script>
