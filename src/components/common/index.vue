<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-card class="box-card">
          <div class="user">
            <img id="picture" :src="this.image"/>
            <div class="userinfo">
              <p id="username" class="name"></p>
              <p id="roleName" class="access"></p>
            </div>
          </div>
          <div class="login-info">
            <p>
              <i class="el-icon-timer"></i> 登录时间:<span id="time"></span>
              <br>
              <i class="el-icon-place"></i> 登录地址:<span id="ip"></span>
            </p>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
          <el-table :data="LoginData" stripe style="width: 100%">
            <el-table-column label="日期" prop="time" width="180">
            </el-table-column>
            <el-table-column label="姓名" prop="username" width="70">
            </el-table-column>
            <el-table-column label="地址" prop="ip"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16" style="padding-left: 20px ;height: 100px;">
        <el-card class="box-card system_bulletin">
          <div slot="header" class="system_title">
            <span>系统公告</span>
          </div>
          <div
            v-for="item in systemData"
            :key="item.id"
            class="system_context item"
          >
            <div>
              {{ item.title }}
            </div>
            <div>
              <i :class="`el-icon-${item.icon}`"> {{ item.time }}</i>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      LoginData: [],
      systemData: [],
      user: {},
      ip: "",
      username: sessionStorage.getItem("username"),
      roleName: "",
      image: "",
      time: "",
    };
  },
  methods: {
    getLogin() {
      this.$http.post("/login/getList/Index").then((res) => {
        this.LoginData = res;
      });
    },
    getNotice() {
      this.$http.post("/notice/getList/Index").then((res) => {
        this.systemData = res;
      });
    },
    //回显个人信息
    getData() {
      this.$http.post("/user/getInfo").then((res) => {
        this.image = "data:image/png;base64," + this.$unzip(res["image"]);
        this.roleName = res["roleName"];
        this.time = res["time"];
        this.ip = res["ip"];
        sessionStorage.setItem("roleId", res["roleId"])
        document.getElementById("username").innerHTML = this.username; //回显主页的账号信息
        document.getElementById("roleName").innerHTML = this.roleName; //回显主页的角色信息
        document.getElementById("time").innerHTML = this.time; //回显主页的登录时间
        document.getElementById("ip").innerHTML = this.ip; //回显主页的登录地址
      });
    },
  },
  mounted() {
    this.getData(); //个人信息
    this.getLogin(); //登录记录
    this.getNotice(); //系统公告
  },
};
</script>

<style lang="less" scoped>
.user {
  border-bottom: 1px solid #999;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  // padding-top: ;
  .userinfo {
    margin-left: 40px;

    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .access {
      color: #999;
      margin-top: 0;
    }
  }

  img {
    margin-left: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
}

.login-info {
  p {
    font-size: 14px;
    color: #999999;
    line-height: 28px;

    span {
      color: #666666;
      margin-left: 20px;
    }
  }
}

.system_bulletin {
  .system_title {
    font-size: 22px;
    color: #000000;
  }

  .system_context {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border: 1px #f2f2f2 solid;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
}
</style>
