<template>
  <el-card class="box-card">
    <div>
      <!-- 角色数据表单 -->
      <el-table
        ref="multipleTable"
        :data="dataList"
        border
        style="width: 100%"
      >
        <el-table-column label="用户账号" prop="account" width="110">
        </el-table-column>
        <el-table-column label="用户名" prop="username" width="110">
        </el-table-column>
        <el-table-column label="登录过期时间" prop="loginTimeout" width="150">
        </el-table-column>
        <el-table-column label="token" prop="token" width="350">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="forcedRetreat(scope.row)"
            >强退
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页号 -->
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
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
  name: "SysUserOnline",
  data() {
    return {
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 5,
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
    cutDataList(res) {
      const data = this.$cutPageDataList(res)
      this.dataList = data.dataList
      this.totalPage = data.totalPage
    },
    //查询所有数据
    getDataList() {
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/user/Online/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //强退用户
    forcedRetreat(item) {
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/login/forcedOut/" + item.account, pageInfo).then((res) => {
        this.cutDataList(res);
      });
    }
  },
  mounted() {
    this.getDataList();
  },
};
</script>
