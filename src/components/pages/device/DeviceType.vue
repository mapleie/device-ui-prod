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
        <el-form-item label="类型名称">
          <el-input
            v-model="dataFrom.name"
            clearable
            placeholder="类型名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="getDataListByName"
            >查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogFormVisible = true">
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 角色数据表单 -->
      <el-table ref="multipleTable" :data="dataList" border style="width: 100%">
        <el-table-column label="设备类型编号" prop="id" width="120">
        </el-table-column>
        <el-table-column label="设备类型名称" prop="name" width="250">
        </el-table-column>
        <el-table-column label="设备类型负责人" prop="principal" width="150">
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="150">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="160">
        </el-table-column>
        <el-table-column label="操作" width="110px">
          <template slot-scope="scope">
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增按钮打开的页面 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        title="创建设备类型"
        width="35%"
      >
        <el-form :model="form">
          <el-form-item label="设备类型名称" label-width="120px">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="设备类型"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型负责人" label-width="120px">
            <el-input
              v-model="form.principal"
              autocomplete="off"
              placeholder="设备类型负责人"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="120px">
            <el-input
              v-model="form.remark"
              style="width: 300px"
              type="textarea"
            ></el-input>
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
  name: "ProjectList",
  data() {
    return {
      //搜索框
      dataFrom: {
        name: "",
      },
      //新增
      form: {
        name: "",
        principal: "",
        remark: "",
      },
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      begin: 0,
      end: this.pageSize - 1,
      dialogFormVisible: false, //默认关闭新建用户界面
      dialogFormVisibleChange: false, //默认关闭编辑用户界面
      dialogFormVisibleLook: false,
      dataListFrom: "getDataList", //当前数据来源于搜索还是全局
    };
  },
  methods: {
    //改变数组大小
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.SizeOrCurrentChangeAfter();
    },
    //改变当前页号
    CurrentChangeHandle(val) {
      this.pageIndex = val;
      this.SizeOrCurrentChangeAfter();
    },
    //在更改数组大小或者页号前，判断数据来源
    SizeOrCurrentChangeAfter() {
      if (this.dataListFrom === "getDataList") this.getDataList();
      else this.getDataListByName();
    },

    //新增页面的确认键
    handleInsert() {
      this.$http.post("/device/type/insert", this.form).then(() => {
        this.dialogFormVisible = false; //关闭窗口
        this.getDataList();
      });
    },
    //查询所有数据
    getDataList() {
      this.dataListFrom = "getDataList";
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex);
      this.$http.post("device/type/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //删除按钮
    handleDelete(item) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            typeBo: item,
            pageBo: this.$getPageInfo(this.pageSize, this.pageIndex),
          };
          this.$http.post("/device/type/delete", data).then((res) => {
            this.cutDataList(res);
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //查询单条数据
    getDataListByName() {
      const name = this.dataFrom.name;
      if (name !== "") {
        const data = {
          name: name,
          pageBo: this.$getPageInfo(this.pageSize, this.pageIndex),
        };
        this.dataListFrom = "getDataListByName";
        this.$http.post("/device/type/search", data).then((res) => {
          this.cutDataList(res);
        });
      } else this.getDataList();
    },

    cutDataList(res) {
      const data = this.$cutPageDataList(res);
      this.dataList = data.dataList;
      this.totalPage = data.totalPage;
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
