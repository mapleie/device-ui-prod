<template>
  <el-card class="box-card">
    <div>
      <!-- 角色数据表单 -->
      <el-table
        :data="dataList"
        border
        style="width: 100%"
      >
        <el-table-column label="类名称" prop="domainName" width="240">
        </el-table-column>
        <el-table-column label="类地址" prop="domainPath" width="300">
        </el-table-column>
        <el-table-column label="属性名称" prop="name" width="150">
        </el-table-column>
        <el-table-column label="属性类型" prop="type" width="240">
        </el-table-column>
        <el-table-column label="类注解" prop="anno" width="300">
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
  name: "SysDomain",
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
      this.$http.post("/domain/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
  },
  mounted() {
    this.getDataList()
  },
};
</script>
