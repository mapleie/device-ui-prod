<template>
  <el-card class="box-card">
    <div>
      <!-- 搜索框 -->
      <el-form>
        <el-form-item>
          <el-button type="danger" @click="dialogFormVisible =true">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 角色数据表单 -->
      <el-table :data="dataList" border>
        <el-table-column label="公告编号" prop="id" width="80">
        </el-table-column>
        <el-table-column label="公告内容" prop="title" width="900">
        </el-table-column>
        <el-table-column label="发布时间" prop="time" width="160">
        </el-table-column>
        <el-table-column label="图标" prop="icon" width="50">
          <template slot-scope="scope">
            <i :class="`el-icon-${scope.row.icon}`"></i>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增按钮打开的页面 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        title="新增系统公告"
        width="35%"
      >
        <el-form :model="form">
          <el-form-item label="系统名称" label-width="120px">
            <el-input
              v-model="form.title"
              autocomplete="off"
              placeholder="系统名称"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="公告图标" label-width="120px">
            <el-select v-model="form.icon" placeholder="请选择">
              <el-option
                v-for="{icon,name} in icons"
                :key="icon"
                :label="name"
                :value="icon"
              >
                <i :class="`el-icon-${icon}`"></i>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleInsert()">确 定</el-button>
        </div>
      </el-dialog>
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
  name: "SysNotices",
  data() {
    return {
      form: {}, //新增集合
      icons: [], //图标集合
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      begin: 0,
      end: this.pageSize - 1,
      dialogFormVisible: false,
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
      this.$http.post("/notice/getList", pageInfo).then((res) => {
        this.cutDataList(res)
      });
    },
    //新增页面的确认键
    handleInsert() {
      this.dialogFormVisible = false; //关闭窗口
      this.$http.post("/notice/insert", this.form).then(() => {
        //刷新页面
        this.getDataList();
      });
    },
    getIcon() {
      this.$http.post("/dict/getDict/icon").then(res => {
        this.icons = this.$StrToJson(res);
      })
    },
  },
  mounted() {
    this.getIcon();
    this.getDataList();
  },
};
</script>
