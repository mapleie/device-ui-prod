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
        <el-form-item label="角色名称">
          <el-input
            v-model="dataFrom.roleName"
            clearable
            placeholder="角色名称/备注"
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
        <el-form-item>
          <el-button type="danger" @click="dialogFormVisible = true"
          >新增
          </el-button
          >
        </el-form-item>
      </el-form>
      <!-- 数据表单 -->
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="roleId" width="55">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="130">
        </el-table-column>
        <el-table-column label="创建者ID" prop="createUserId" width="80">
        </el-table-column>
        <el-table-column label="活跃度" prop="activation" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.byAct === "NO" ? "无法获取" : scope.row.activation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180">
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="450">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handlePower(scope.row.access)"
            >权限
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增按钮打开的页面 -->
      <el-dialog :visible.sync="dialogFormVisible" title="新增角色" width="35%">
        <el-form :model="form">
          <el-form-item label="名称" label-width="120px">
            <el-input
              v-model="form.roleName"
              autocomplete="off"
              placeholder="名称"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色级别" label-width="120px">
            <el-input
              v-model="form.access"
              autocomplete="off"
              placeholder="1级最高"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色活跃度" label-width="120px">
            <el-input
              v-model="form.activation"
              autocomplete="off"
              placeholder="角色紧急所需活跃度"
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
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleInsert()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑按钮打开的页面 -->
      <el-dialog
        :visible.sync="dialogFormVisibleChange"
        title="编辑用户"
        width="35%"
      >
        <el-form :model="formChange">
          <el-form-item label="角色名称" label-width="120px">
            <el-input
              v-model="formChange.roleName"
              autocomplete="off"
              placeholder="角色名称"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色级别" label-width="120px">
            <el-input
              v-model="formChange.access"
              autocomplete="off"
              placeholder="1级最高"
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
          <el-button type="primary" @click="handleChange()">更 新</el-button>
        </div>
      </el-dialog>
      <!-- 权限按钮打开的页面 -->
      <el-dialog
        :visible.sync="dialogFormVisiblePower"
        title="编辑菜单"
        width="35%"
      >
        <el-tree :check-strictly="true"
                 :data="menu"
                 :default-checked-keys="power"
                 :props="defaultProps"
                 accordion
                 node-key="menuId"
                 show-checkbox
                 @check="handlePowerInsert"></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisiblePower = false">取 消</el-button>
          <el-button type="primary" @click="handleChangePower()">更 新</el-button>
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
  name: "SysRole",
  data() {
    return {
      dataFrom: {
        roleName: "",
      },
      //新增
      form: {
        username: "",
        access: "",
        remark: "",
        activation: "",
      },
      //编辑
      formChange: {
        roleName: "",
        access: "",
        remark: "",
      },
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      begin: 0,
      end: this.pageSize - 1,
      dialogFormVisible: false, //默认关闭新建用户界面
      dialogFormVisibleChange: false, //默认关闭编辑用户界面
      dialogFormVisiblePower: false, //默认关闭权限界面
      menu: [],//所有菜单列表
      power: [],//权限菜单列表
      power1: [],//未修改的权限菜单列表
      defaultProps: {//权限菜单列表结构
        children: 'children',
        label: 'name'
      },
      NowPower: 0,//当前点击的角色级别
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
    handleInsert() {
      if (sessionStorage.getItem("roleId") >= this.form.access) {
        this.$message({
          type: "warning",
          message: "用户无法创建高级别的角色",
        });
      } else {
        const data = {
          roleBo: this.form,
          pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
        }
        this.$http.post("/role/insert", data).then((res) => {
          this.cutDataList(res);
          this.dialogFormVisible = false; //关闭窗口
        });
      }
    },
    //编辑页面的确认键
    handleChange() {
      if (this.formChange.access.length === 0) {
        this.$message({
          type: "error",
          message: "角色级别不能为空",
        });
      } else if (sessionStorage.getItem("roleId") > this.formChange.access) {
        this.$message({
          type: "error",
          message: "当前用户的权限不足",
        });
      } else {
        const data = {
          roleBo: this.formChange,
          pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
        }
        this.$http.post("/role/update", data).then((res) => {
          this.cutDataList(res);
          this.dialogFormVisibleChange = false;
        });
      }
    },
    cutDataList(res) {
      const data = this.$cutPageDataList(res)
      this.dataList = data.dataList
      this.totalPage = data.totalPage
    },
    //查询所有数据
    getDataList() {
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/role/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询单条数据
    getDataListByName() {
      //搜索条件不为空
      const roleName = this.dataFrom.roleName;
      if (roleName !== "") {
        const data = {
          roleBo: this.dataFrom,
          pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
        }
        this.$http.post("/role/getList/search", data).then((res) => {
          this.cutDataList(res);
        });
      } else {
        this.getDataList()
      }
    },
    //权限按钮
    handlePower(item) {
      this.dialogFormVisiblePower = true;
      this.$http.post("/menu/getList/ByRole/" + item).then((res) => {
        this.NowPower = item
        this.power = res;
        this.power1 = JSON.parse(JSON.stringify(res));
      });
      this.$http.post("/menu/getList/noPage").then((res) => {
        this.menu = res;
      });
    },
    //更改权限菜单列表
    handleChangePower() {
      const data = {
        newPower: this.power,
        oldPower: this.power1,
        access: this.NowPower
      }
      this.$http.post("/menu/changeMenuAccessByRole", data);
      this.dialogFormVisiblePower = false;
    },
    //点击菜单时候
    handlePowerInsert(data) {
      const id = data.menuId;
      if (this.power.includes(id)) {
        if (data.children !== null) {
          data.children.forEach(child => {
            this.power = this.power.filter((item) => {
              return item !== child.menuId;
            });
          })
        }
        this.power = this.power.filter((item) => {
          return item !== id;
        });
      } else {
        this.power.push(id)
        if (data.parentId !== 0) {
          this.power.push(data.parentId)
        }
      }
      //去重
      this.power = [...new Set(this.power)];
    },
    //编辑按钮
    handleEdit(index, item) {
      if (sessionStorage.getItem("roleId") >= item.access) {
        this.$message({
          type: "warning",
          message: "用户无法编辑高级别的角色",
        });
      } else {
        this.dialogFormVisibleChange = true; //打开编辑用户界面
        //回显数据
        this.formChange = item;
      }
    },
    //删除按钮
    handleDelete(index, item) {
      if (sessionStorage.getItem("roleId") >= item.access) {
        this.$message({
          type: "warning",
          message: "用户无法删除高级别的角色",
        });
      } else {
        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 表示处理的是 删除操作
            const data = {
              roleBo: item,
              pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
            }
            this.$http.post("/role/delete", data).then((res) => {
              this.cutDataList(res);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
