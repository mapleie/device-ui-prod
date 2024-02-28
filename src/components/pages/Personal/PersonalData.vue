<template>
  <el-row>
    <el-col :span="8">
      <el-card class="box-card">
        <img id="" :src="this.personPicture" alt=""/>
        <el-upload
          ref="upload"
          :before-upload="handleBeforeUpload"
          :file-list="fileList"
          :headers="headers"
          :http-request="uploadPicture"
          :limit="fileLimit"
          :on-change="handleChange"
          :on-exceed="handleExceed"
          action="#"
          list-type="picture"
          name="file"
        >
          <el-button style="transform: translate(100%, 0)" type="primary">更换图片<i
            class="el-icon-upload el-icon--right"></i></el-button>
          <!-- <el-button type="warning" style=" transform: translate(100%, 0);">更换图片</el-button>-->
          <div slot="tip" class="iptFile">
            支持上传jpg/png等多种文件,但不超过2MB
          </div>
        </el-upload>
      </el-card>
    </el-col>
    <el-col :span="16" style="padding-left: 20px">
      <el-descriptions
        :column="4"
        :model="person"
        border
        direction="vertical"
        title="个人资料"
      >
        <el-descriptions-item label="用户名">
          {{ this.person.username }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ this.person.mobile }}
        </el-descriptions-item>
        <el-descriptions-item :span="2" label="邮箱">
          {{ this.person.email }}
        </el-descriptions-item>
        <el-descriptions-item label="姓名">
          <el-tag size="small">
            {{ this.person.name }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="账号状态">
          {{ this.person.status === 1 ? "激活" : "禁用" }}
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
  </el-row>
</template>
<script>
// import {config} from "shelljs";
// config.headers['Content-Type'] = "multipart/form-data"
// import header from "../../common/Header.vue";

export default {
  name: "PersonalData",
  data() {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      fileLimit: 1, //图片上传个数限制
      fileSize: 2,//图片限制大小
      fileList: [], //上传图片，以数组方式上传
      username: sessionStorage.getItem("username"),
      updatePersonalData: true, //修改个人资料默认关闭
      person: [], //个人信息
      personProject: {}, //个人项目
      personPicture: "", //头像
      formSelect: {
        //搜索项目用的数组
        id: "",
        project: {},
        user: {
          username: "",
        },
      },
      User: {
        username: "",
      },
    };
  },
  methods: {
    handleBeforeUpload(file) {
      const uploadTypes = [
        "jpg",
        "png",
        "webp",
      ];
      const filetype = file.name.replace(/.+\./, "");
      const isRightSize = (file.size || 0) / 1024 / 1024 < this.fileSize;
      if (!isRightSize) {
        this.$message.error("文件大小超过 " + this.fileSize + "MB");
        return false;
      }
      if (uploadTypes.indexOf(filetype.toLowerCase()) === -1) {
        this.$message.warning({
          message:
            "请上传后缀名为jpg、png、webp的附件",
        });
        return false;
      }
      return true;
    },
    //文件数量改变
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    //上传照片
    uploadPicture() {
      this.$message("文件上传中........");
      //上传文件的需要FormData类型;所以要转
      const FormDates = new FormData();
      this.fileList.forEach((val) => {
        FormDates.append("file", val.raw);
      });
      this.$http.post("/upload/image",
          FormDates, {
          headers: {
            "Content-Type": "",
          }
        }
      )
          .then(() => {
          //刷新页面
          this.getInfoData();
          //清空上传数组
          this.fileList = [];
        });
    },
    //超出文件个数的回调
    handleExceed() {
      this.$message({
        type: "warning",
        message: "超出最大上传文件数量的限制！",
      });

    },
    //获取当前用户信息
    getInfoData() {
      this.$http.post("/user/getInfoData").then((res) => {
        this.person = res["user"];
        this.personProject = res["itemList"]
        this.personPicture = "data:image/png;base64," + this.$unzip(res["image"]);
      });
    },
  },
  mounted() {
    this.getInfoData();
  },
};
</script>
<style lang="less">
.box-card {
  img {
    // margin-left: 40px;
    // width: 452px;
    // height: 452px;
    width: 100%;
    height: 100%;
    border: 0;
    // border-radius: 50%;//圆角
  }
}
</style>
