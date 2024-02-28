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
        <el-form-item label="搜索">
          <el-input
            v-model="dataFrom.username"
            clearable
            placeholder="账号/姓名/权限"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="getDataListByName"
          >查询
          </el-button
          >
        </el-form-item>
      </el-form>
      <!-- 角色数据表单 -->
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column label="编号" prop="userId" width="50">
        </el-table-column>
        <el-table-column label="用户姓名" prop="name" width="130">
        </el-table-column>
        <el-table-column label="用户账号" prop="username" width="110">
        </el-table-column>
        <el-table-column label="账号状态" prop="status" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 1 ? "正常" : "禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号权限" prop="roleName" width="100">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180">
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="130">
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" width="130">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleLogin(scope.row)"
            >虚拟登录
            </el-button>
          </template>
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
  name: "SysVirtualLogin",
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
      dialogFormVisible: false, //默认关闭新建用户界面
      dialogFormVisibleChange: false, //默认关闭编辑用户界面
      access: sessionStorage.getItem("roleId"),
      username: sessionStorage.getItem("username"),
      search: {
        username: "",
      }
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
      this.$http.post("/user/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    cutDataList(res) {
      const data = this.$cutPageDataList(res)
      this.dataList = data.dataList
      this.totalPage = data.totalPage
    },
    //查询单条数据
    getDataListByName() {
      const name = this.dataFrom.username
      if (name.length !== 0) {
        const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
        this.$http.post("/user/getList/search/" + name, pageInfo).then((res) => {
          if (res["list"].length !== 0) {
            this.cutDataList(res);
          } else {
            this.$message("没有符合条件的数据");
          }
        });
      } else {
        //无条件搜索，视为搜索全部
        this.getDataList();
      }
    },
    //虚拟登录
    handleLogin(item) {
      console.log(item)
    }
  },
  mounted() {
    this.getDataList();
  },
};
</script>
