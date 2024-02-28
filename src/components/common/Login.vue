<template>
  <div class="login_container">
    <div class="login_form">
      <p class="login_title">登录页面</p>
      <el-form
        ref="formName"
        :model="form"
        :rules="rules"
        class="demo-ruleForm"
        label-width="100px"
        status-icon
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input
            v-model="form.code"
            auto-complete="false"
            placeholder="点击图片更换验证码"
            style="width: 60%; margin-left: 10px"
            type="text"
          ></el-input>
          <el-image
            :src="this.image"
            class="codeImg"
            @click="resetImg"
          ></el-image>
        </el-form-item>
        <el-button size="medium" style="margin-left: 35%;" type="primary" @click="login">登录</el-button>
        <el-button size="medium" type="primary" @click="register"
        >注册
        </el-button
        >
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      image: "", //二维码图片
      code: "", //二维码文字
      form: {
        account: "",
        password: "",
        code: "",
      },
      rules: {
        account: [{required: true, message: "请输入账号", trigger: "blur"}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        code: [{required: true, message: "请输入验证码", trigger: "blur"}],
      },
      user: {
        account: "",
      },
    };
  },
  methods: {
    //登录
    login() {
      if (this.form.code === "") {
        this.$message.info("请输入验证码");
        this.resetImg();
      } else if (this.form.code !== this.code) {
        this.$message.info("验证码错误");
        this.resetImg();
      } else {
        this.$http.post("/login/", this.form).then((res) => {
          if (res !== undefined) {
            sessionStorage.setItem("token", res["token"]);
            sessionStorage.setItem("username", res["username"]);
            sessionStorage.setItem("tokenName", res["tokenName"]);
            sessionStorage.setItem("account", this.form.account);
            this.$router.push("/Home");
          } else {
            //获取验证码
            this.resetImg();
          }
        });
      }
    },
    //注册
    register() {
      this.$router.push("/register");
    },
    //生成验证码
    resetImg() {
      this.$http.post("/code/").then((res) => {
        this.code = res["code"];
        const image = this.$unzip(res["image"]);
        console.log("验证码：" + this.code);
        this.image = "data:image/png;base64," + image;
      });
    },
  },
  mounted() {
    this.resetImg();//获取验证码
  },
}
</script>
<style lang="less" scoped>
.codeImg {
  margin-top: 5px;
  float: right;
}

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
