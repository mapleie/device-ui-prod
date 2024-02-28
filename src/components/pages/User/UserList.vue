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
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogFormVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 角色数据表单 -->
      <el-table ref="multipleTable" :data="dataList" border style="width: 100%">
        <el-table-column label="编号" prop="userId" width="55">
        </el-table-column>
        <el-table-column label="用户姓名" prop="name" width="130">
        </el-table-column>
        <el-table-column label="用户账号" prop="username" width="130">
        </el-table-column>
        <el-table-column label="账号状态" prop="status" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 1 ? "正常" : "禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180">
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="240">
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile" width="130">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增按钮打开的页面 -->
      <el-dialog :visible.sync="dialogFormVisible" title="新增用户" width="35%">
        <el-form :model="insertForm">
          <el-form-item label="账号" label-width="120px">
            <el-input
              v-model="insertForm.username"
              autocomplete="off"
              placeholder="账号"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="120px">
            <el-input
              v-model="insertForm.password"
              autocomplete="off"
              placeholder="密码"
              style="width: 300px"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="120px">
            <el-input
              v-model="insertForm.name"
              autocomplete="off"
              placeholder="姓名"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="120px">
            <el-input
              v-model="insertForm.email"
              autocomplete="off"
              placeholder="邮箱"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="120px">
            <el-input
              v-model="insertForm.mobile"
              autocomplete="off"
              placeholder="手机号码"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述信息" label-width="120px">
            <el-input
              v-model="insertForm.remark"
              style="width: 300px"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑按钮打开的页面 -->
      <el-dialog
        :visible.sync="dialogFormVisibleChange"
        title="编辑用户"
        width="35%"
      >
        <el-form :model="formChange">
          <el-form-item label="账号" label-width="120px">
            <el-input
              v-model="formChange.username"
              autocomplete="off"
              placeholder="账号"
              style="width: 300px"
            ></el-input>
          </el-form-item>

          <el-form-item label="姓名" label-width="120px">
            <el-input
              v-model="formChange.name"
              autocomplete="off"
              placeholder="姓名"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="120px">
            <el-input
              v-model="formChange.email"
              autocomplete="off"
              placeholder="邮箱"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="120px">
            <el-input
              v-model="formChange.mobile"
              autocomplete="off"
              placeholder="手机号码"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述信息" label-width="120px">
            <el-input
              v-model="formChange.remark"
              style="width: 300px"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleChange = false">取 消</el-button>
          <el-button type="primary" @click="onSubmitChange()">更 新</el-button>
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
  name: "UserList",
  data() {
    return {
      username: sessionStorage.getItem("username"),
      dataFrom: {
        username: "",
      },
      //新增
      insertForm: {
        username: "",
        password: "",
        name: "",
        remark: "",
        mobile: "",
      },
      //编辑
      formChange: {
        username: "",
        password: "",
        name: "",
        remark: "",
        mobile: "",
      },
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      begin: 0,
      end: this.pageSize - 1,
      dialogFormVisible: false, //默认关闭新建用户界面
      dialogFormVisibleChange: false, //默认关闭编辑用户界面
      search: {
        username: "",
      },
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
    //新增页面的确认键
    onSubmit() {
      this.$http.post("/user/insert", this.insertForm).then((res) => {
        this.dialogFormVisible = false;
        this.getDataList();
      });
    },
    //编辑页面的确认键
    onSubmitChange() {
      this.$http.post("/user/updateUserInfo", this.formChange).then((res) => {
        this.dialogFormVisibleChange = false;
        this.getDataList();
      });
    },
    //查询所有数据
    getDataList() {
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/user/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //将数据分配到数组中
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
    //编辑按钮
    handleEdit(index, item) {
      this.dialogFormVisibleChange = true; //打开编辑用户界面
      //回显数据
      this.formChange = item;
    },
    //删除按钮
    handleDelete(index, item) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 表示处理的是 删除操作
          this.$http.post("/user/delete", item).then((res) => {
            //弹出提示框,提示删除成功

            this.getDataList();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
