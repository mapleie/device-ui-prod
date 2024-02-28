<template>
  <div class="asideContainer">
    <el-menu
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      active-text-color="#ffd04b"
      background-color="rgb(50, 65, 87)"
      class="el-menu-vertical-demo"
      default-active="1-4-1"
      text-color="#fff"
    >
      <h3>{{ isCollapse ? "设备" : "企业设备管理系统" }}</h3>
      <!--没有二级菜单-->
      <el-menu-item
        v-for="item in noChildren"
        :key="item.url"
        :index="item.name"
        @click="clickMenu(item)"
      >
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
      <!--有二级菜单-->
      <el-submenu
        v-for="item in hasChildren"
        :key="item.name"
        :index="item.name"
        style="width: 170px;"
      >
        <template slot="title">
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.name }}</span>
        </template>

        <el-menu-item-group v-for="subItem in item.children" :key="subItem.url">
          <el-menu-item :index="subItem.name" @click="clickMenu(subItem)">
            <i :class="`el-icon-${subItem.icon}`"></i>
            {{ subItem.name }}
          </el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<style lang="less" scoped>
.el-menu {
  min-height: 200vh;
  height: 100%;
  border-right: none;

  h3 {
    color: white;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
    padding: 0 20px;
  }
}
</style>

<script>
export default {
  name: "Aside",
  data() {
    return {
      menuData: [],
      updateTime: 60000,//定时更新时间60秒
    };
  },
  methods: {
    clickMenu(item) {
      if (this.$route.path !== item.url) {
        //如果当前路由跟需要更新的路由不一样
        this.$router.push(item.url);
      }
      //触发面包屑更新
      this.$store.commit("menuChange", item);
    },
    //获取动态路由
    async getDataList() {
      this.$http.post("/menu/asideMenus").then((res) => {
        this.menuData = res;
      });
    },
    //定时更新侧边栏
    setTimer() {
      this.getDataList();
      this.timer = setInterval(() => {
        this.getDataList();
      }, this.updateTime)
    },
  },
  // 定时器销毁
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    hasChildren() {
      //有二级菜单
      return this.menuData.filter((item) => item.children);
    },
    noChildren() {
      //没有二级菜单
      return this.menuData.filter((item) => !item.children);
    },
    isCollapse() {
      //菜单的打开状态
      return this.$store.state.tab.isCollapse;
    },
  },
  created() {
    this.setTimer()
  },
  mounted() {
  },
};
</script>
