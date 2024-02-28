<template>
  <el-card class="box-card">
    <div>
      <!-- 角色数据表单 -->
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="id" width="100">
        </el-table-column>
        <el-table-column label="字典类型" prop="type" width="180">
        </el-table-column>
        <el-table-column label="字典名称" prop="name" width="180">
        </el-table-column>
        <el-table-column label="字典内容" prop="dict" width="350">
        </el-table-column>
      </el-table>
      <!-- 页号 -->
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
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
  name: "SysLogin",
  data() {
    return {
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
      this.$http.post("/dict/lists", pageInfo).then((res) => {
        this.cutDataList(res);
      });
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
