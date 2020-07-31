<!--
 * @Author: wei.chen
 * @Date: 2020-06-11 12:42:39
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-06-16 16:37:00
 * @Descripttion: 
--> 
<template>
  <section class="app-main">
    <div class="main_layout_content">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh);
  width: 100%;
  position: relative;
  padding: 20px;
  overflow: hidden;
  
}
.app-main .main_layout_content{
    background-color: #fff;
  }
.fixed-header+.app-main {
  padding-top: 70px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
