<template>
  <div class="hello">
    <el-container>
      <el-aside width="auto">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <common-tab></common-tab>
        <el-main>
          <!-- 路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
      <Top></Top>
      <Socket/>
    </el-container>
  </div>
</template>

<script>
import Aside from "@/components/common/Aside.vue";
import Header from "@/components/common/Header.vue";
import CommonTab from "@/components/common/CommonTab.vue";
import Socket from "@/WebSocket/socket.vue";
import Top from "@/components/common/Top.vue";

export default {
  name: "Home",
  data() {
    return {
    };
  },
  components: {
    Aside,
    Header,
    CommonTab,
    Socket,
    Top,
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  padding: 0 0;
}
</style>
