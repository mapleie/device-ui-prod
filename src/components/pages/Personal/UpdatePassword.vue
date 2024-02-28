<template>
  <div class="login_container">
    <div class="login_form">
      <el-form :model="form" label-width="80px">
        <div style="margin: 30px"></div>
        <el-form-item label="旧密码">
          <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-button size="medium" style="margin-left: 43%;" type="primary" @click="update"
        >修改密码
        </el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "UpdatePassword",
  data() {
    return {
      form: {
        oldPassword: "",
        password: "",
        newPassword: "",
      },
    };
  },
  methods: {
    update() {
      if (this.form.password === this.form.newPassword) {
        this.$http.post("/user/updatePwd", this.form).then(() => {
          // 清空存储的Token信息
          sessionStorage.clear();
          // 然后跳转到登录页
          this.$router.push("/login");
        });
      } else {
        this.$message.warning("两次新密码不一致")
      }
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background-color: rgba(242, 242, 242, 1);
  background-position: center bottom;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 1278px 559px;
  border: none;
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .login_form {
    width: 510px;
    margin: 0 auto;
    padding: 0 55px 15px 35px;
    background-color: #fff;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 25px #cac6c6;

    .login_title {
      font-family: "微软雅黑 Bold", "微软雅黑", serif;
      font-weight: 700;
      text-decoration: none;
      color: rgb(0, 121, 254);
      font-size: 32px;
      margin-top: 50px;
      margin-bottom: 30px;
      text-align: center;
    }
  }
}
</style>
