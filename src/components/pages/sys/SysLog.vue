<template>
  <el-card class="box-card">
    <div>
      <!-- 搜索框 -->
      <el-form
        ref="dataFrom"
        :inline="true"
        :model="dataFrom"
        class="demo-form-inline"
      >
        <el-form-item label="搜索用户">
          <el-input
            v-model="dataFrom.username"
            clearable
            placeholder="用户名/接口/地址/参数/方法"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getDataListByName">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据表单 -->
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column label="编号" prop="id" width="55"></el-table-column>
        <el-table-column label="账号" prop="account" width="110">
        </el-table-column>
        <el-table-column label="访问接口" prop="uri" width="200">
        </el-table-column>
        <el-table-column label="访问地址" prop="url" width="350">
        </el-table-column>
        <el-table-column label="请求方法" prop="method" width="80">
        </el-table-column>
        <el-table-column label="请求参数" prop="params" width="300">
        </el-table-column>
        <el-table-column label="执行时长(毫秒)" prop="time" width="80">
        </el-table-column>
        <el-table-column label="ip地址" prop="ip" width="120">
        </el-table-column>
        <el-table-column label="请求来源" prop="innerIp" width="90">
        </el-table-column>
        <el-table-column label="设备来源" prop="mobile" width="90">
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="180">
        </el-table-column>
      </el-table>
      <!-- 页号 -->
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalPage"
        layout="total ,sizes,prev,pager,next,jumper"
        style="margin-top: 30px"
        @size-change="sizeChangeHandle"
        @current-change="CurrentChangeHandle"
      >
      </el-pagination>
    </div>
  </el-card>
</template>
<script>
export default {
  name: "SysLog",
  data() {
    return {
      dataFrom: {
        username: "",
      },
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      begin: 0,
      end: this.pageSize - 1,
    };
  },
  methods: {
    //改变数组大小
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.getDataList();
    },
    //改变当前页号
    CurrentChangeHandle(val) {
      this.pageIndex = val;
      this.dataList = [];
      this.getDataList();
    },
    //查询所有数据
    getDataList() {
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/log/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询单条数据
    getDataListByName() {
      const name = this.dataFrom.username
      if (name !== "") {
        const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
        this.$http.post("/log/getList/search/" + name, pageInfo).then((res) => {
          if (res["list"].length !== 0) {
            this.cutDataList(res);
          } else {
            this.$message.warning("没有符合搜索条件的数据")
          }
        });
      } else {
        this.getDataList()
      }
    },
    cutDataList(res) {
      const data = this.$cutPageDataList(res)
      this.dataList = data.dataList
      this.totalPage = data.totalPage
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
