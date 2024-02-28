<template>
  <div class="tabs">
    <div style="margin-left: 1%">
      <el-tag
        v-for="(item, index) in tags"
        :key="item.url"
        :closable="item.name !== '首页'"
        :effect="$route.path === item.url ? 'dark' : 'plain'"
        @click="changeMenu(item)"
        @close="handleClose(item)"
      >
        {{ item.name }}
      </el-tag>
    </div>
  </div>
</template>
<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "commonTab",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    ...mapMutations(["closeTag"]),
    changeMenu(item) {
      //点击tab标签需要的动态路由
      this.$router.push(item.url);
    },
    handleClose(item) {
      //关闭菜单
      this.closeTag(item);
      //动态的处理路由，关闭当前页面，定位到首页
      if (this.$route.path !== item.url) {
        return;
      }
      this.$router.push("/Home");
    },
  },
};
</script>
<style lang="less" scoped>
.tabs {
  position: relative;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 5px 10px #ddd;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10px;

  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
