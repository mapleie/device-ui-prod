<template>
  <div class="login_container">
    <div class="login_form">
      <p class="login_title">注册页面</p>
      <el-form
        ref="formName"
        :model="form"
        :rules="rules"
        class="demo-ruleForm"
        label-width="100px"
        status-icon
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="password">
          <el-input
            v-model="form.passwords"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="username">
          <el-input v-model="form.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="username">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" style="margin-left: 35%;" type="primary" @click="register"
          >注册
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    return {
      form: {
        name: "",
        username: "",
        password: "",
        passwords: "",
        mobile: "",
        email: ""
      },
      rules: {
        name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        username: [{required: true, message: "请输入账号", trigger: "blur"}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        passwords: [{required: true, message: "请输入密码", trigger: "blur"}],
      },
    };
  },
  methods: {
    //注册
    register() {
      if (this.form.password !== this.form.passwords) {
        //两次密码不一样
        this.$message.info("两次密码不一致");
      } else {
        this.$http.post("/login/register", this.form).then((res) => {
          //后端传递信息回来
          console.log(res);
          // this.$router.push("/Login");
        });
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
  background-image: url(../../assets/login.jpg);
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
