<template>
  <div class="header-container">
    <div class="l-content">
      <el-button
        icon="el-icon-menu"
        size="medium"
        style="margin-left: 20px"
        @click="handleMenu"
      ></el-button>
      <el-breadcrumb separator=">" style="padding-left: 20px">
        <!-- 面包屑 -->
        <el-breadcrumb-item
          v-for="item in tags"
          :key="item.url"
          :effect="$route.path === item.url ? 'dark' : 'plain'"
          :to="{ path: item.url }"
        >
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content" style="display: flex">
      <!-- 右上头像-->
      <el-dropdown
        :hide-on-click="false"
        style="margin-right: 10px"
      >
        <span class="el-dropdown-link">
          <img id="picture" :src="this.image" alt="" class="user_img"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="PersonalData">个人信息</el-dropdown-item>
          <el-dropdown-item divided @click.native="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: "Header",
  data() {
    return {
      image: "",
    };
  },
  methods: {
    //对菜单进行缩放操作
    handleMenu() {
      this.$store.commit("CollapseChange");
    },
    //个人中心
    PersonalData() {
      this.$router.push("/PersonalData");
    },
    //退出
    loginOut() {
      this.$confirm("是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.post("/login/out")
        // 表示处理的是 注销操作
        sessionStorage.clear(); // 清空存储的Token信息
        // 然后跳转到登录页
        this.$router.push("/");
      });
    },
    //回显个人信息
    getData() {
      this.$http.post("/user/userImage").then((res) => {
        this.image = "data:image/png;base64," + this.$unzip(res);
      });
    },
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
};
</script>
<style lang="less">
.header-container {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  //.firstpage {
  //  font-size: 16px;
  //  color: #fff;
  //  margin-left: 10px;
  //  cursor: pointer; //鼠标悬停转为指针
  //}

  .r-content {
    padding-right: 30px;

    .user_img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  .l-content {
    display: flex;
    align-items: center;

    /deep/ .el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: normal;

        &.is-link {
          color: #666;
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          color: #fff;
        }
      }
    }
  }
}
</style>
