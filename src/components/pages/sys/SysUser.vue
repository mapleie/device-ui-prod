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
          <el-button type="success" @click="dialogFormVisible = true"
          >新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="multipleSelection.length>0">
          <el-button @click="toggleSelection()"> 取消选择</el-button>
        </el-form-item>
        <el-form-item v-if="multipleSelection.length>0">
          <el-button type="danger" @click="deleteSelection()">
            批量删除
          </el-button>
        </el-form-item>
        <el-form-item v-if="multipleSelection.length>0">
          <el-button type="primary" @click="exportCheck()">
            导出选择
          </el-button>
        </el-form-item>
        <el-form-item v-if="multipleSelection.length>0">
          <el-button type="success" @click="exportAll()">
            导出全部
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 角色数据表单 -->
      <el-table
        ref="multipleTable"
        :data="dataList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="编号" prop="userId" width="50">
        </el-table-column>
        <el-table-column label="账号" prop="account" width="110">
        </el-table-column>
        <el-table-column label="用户名" prop="username" width="110">
        </el-table-column>
        <el-table-column label="用户姓名" prop="name" width="130">
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
              type="warning"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="danger"
              @click="changeStatus(scope.$index, scope.row)"
            >禁用
            </el-button>
            <el-button
              v-if="scope.row.status !== 1"
              size="mini"
              type="success"
              @click="changeStatus(scope.$index, scope.row)"
            >激活
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增按钮打开的页面 -->
      <el-dialog :visible.sync="dialogFormVisible" title="新增用户" width="35%">
        <el-form :model="form">
          <el-form-item label="账号" label-width="120px">
            <el-input
              v-model="form.username"
              autocomplete="off"
              placeholder="账号"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="120px">
            <el-input
              v-model="form.password"
              autocomplete="off"
              placeholder="密码"
              style="width: 300px"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="120px">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="姓名"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="120px">
            <el-input
              v-model="form.email"
              autocomplete="off"
              placeholder="邮箱"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" label-width="120px">
            <el-input
              v-model="form.mobile"
              autocomplete="off"
              placeholder="手机号码"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述信息" label-width="120px">
            <el-input
              v-model="form.remark"
              style="width: 300px"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false;">取 消</el-button>
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
  name: "SysUser",
  data() {
    return {
      dataFrom: {
        username: "",
      },
      //新增
      form: {
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
      access: sessionStorage.getItem("roleId"),
      username: sessionStorage.getItem("username"),
      multipleSelection: [], //批量操作数组
    };
  },
  methods: {
    //导出全部
    exportAll() {
      this.export(this.dataList)
    },
    //导出所选
    exportCheck() {
      this.export(this.multipleSelection)
    },
    //导出方法
    export(item) {
      this.$http.post("/export/user", item).then(res => {
        const data = res.data["data"]
        const blob = new Blob([data["path"]], {type: 'application/vnd.ms-excel'}); // type这里表示xlsx类型
        const downloadElement = document.createElement('a');
        // 创建下载的链接
        downloadElement.href = window.URL.createObjectURL(blob)
        downloadElement.download = data["name"] + '.xls' // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
      })
    },
    //表格被点击，添加data数组数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //清空data
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //批量删除
    deleteSelection() {
      this.$confirm("是否确认全部删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/user/deleteList", this.multipleSelection)
              .then(() => {
              this.getDataList()
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        })
    },
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
      this.dialogFormVisible = false; //关闭窗口
      this.$http.post("/user/insert", this.form).then((res) => {
        //刷新页面
        this.getDataList();
        this.$message(res.data);
      });
    },
    //编辑页面的确认键
    onSubmitChange() {
      this.$http.post("/user/update", this.formChange).then(() => {
        //关闭编辑用户界面
        this.dialogFormVisibleChange = false;
        //刷新页面
        this.getDataList();
      });
    },
    cutDataList(res) {
      const data = this.$cutPageDataList(res)
      this.dataList = data.dataList
      this.totalPage = data.totalPage
    },
    //查询所有数据
    getDataList() {
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/user/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询数据
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
      if (item.access > this.access || this.username === item.username) {
        this.dialogFormVisibleChange = true; //打开编辑用户界面
        //回显数据
        this.formChange = item;
      } else {
        //用户无权限修改此用户的信息
        this.$message.warning("当前用户无法修改" + item.username + "的账号信息")
      }
    },
    //删除按钮
    handleDelete(index, item) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 表示处理的是 删除操作
        this.$http.post("/user/delete", item).then(() => {
          //刷新页面
          this.getDataList();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
    //改变账号激活/禁用状态
    changeStatus(index, row) {
      if (this.access < row.access || row.username === this.username) {
        this.$http.post("/user/ChangeStatus", row).then(() => {
          this.getDataList();
          if (row.username === this.username) {
            this.$message.warning("您已将账号禁用,请联系管理员或许你可以重新注册一个账号")
            // 清空存储的Token信息
            sessionStorage.clear();
            // 然后跳转到登录页
            this.$router.push("/");
          }
        });
      } else {
        //当前用户无权限修改此用户的此用户的账号状态
        this.$message.warning("当前用户无法修改" + row.roleName + "的账号状态")
      }
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
