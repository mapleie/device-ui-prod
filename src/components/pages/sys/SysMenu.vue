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
        <el-form-item label="菜单名称">
          <el-input
            v-model="dataFrom.name"
            clearable
            placeholder="请选择"
          ></el-input>
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            v-model="dataFrom.url"
            clearable
            placeholder="请选择"
          ></el-input>
        </el-form-item>
        <el-form-item label="父菜单">
          <el-select v-model="dataFrom.parentId" placeholder="请选择">
            <el-option
              v-for="{menuId,name} in parentMenus"
              :key="menuId"
              :label="name"
              :value="menuId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="dataFrom.type" placeholder="请选择">
            <el-option
              v-for="{type,name} in types"
              :key="type"
              :label="name"
              :value="type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="getDataListBySearch"
          >查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addMenu">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 角色数据表单 -->
      <el-table
        :data="dataList"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        row-key="menuId"
        style="width: 100%"
      >
        <el-table-column label="菜单编号" prop="menuId" width="110">
        </el-table-column>
        <el-table-column label="父菜单ID" prop="parentId" width="120">
        </el-table-column>
        <el-table-column label="菜单名称" prop="name" width="130">
        </el-table-column>
        <el-table-column label="菜单URL" prop="url" width="230">
        </el-table-column>
        <el-table-column label="授权" width="230">
          <template slot-scope="scope">
          <span v-for="item in scope.row.perms" :key="item">
            {{ item }}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="访问角色列表" width="230">
          <template slot-scope="scope">
          <span v-for="item in scope.row.role" :key="item">
            {{ item }}
          </span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.type === 0 ? "目录" : "" }}</span>
            <span>{{ scope.row.type === 1 ? "菜单" : "" }}</span>
            <span>{{ scope.row.type === 2 ? "按钮" : "" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" prop="icon" width="50">
          <template slot-scope="scope">
            <i :class="`el-icon-${scope.row.icon}`"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="orderNum" width="130">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增按钮打开的页面 -->
      <el-dialog :visible.sync="dialogFormVisible" title="新增菜单" width="35%">
        <el-form :model="form">
          <el-form-item label="菜单名称" label-width="120px">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="菜单名称"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="菜单URL" label-width="120px">
            <el-input
              v-model="form.url"
              autocomplete="off"
              placeholder="菜单URL"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="授权列表" label-width="120px">
            <el-select v-model="form.perms" multiple placeholder="请选择">
              <el-option
                v-for="{name,perm} in perms"
                :key="perm"
                :label="perm"
                :value="name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.dialogFormVisible&&getPermLen(this.form)>1" label="授权类型" label-width="120px">
            <el-radio v-model="form.permsType" label="or">满足其一</el-radio>
            <el-radio v-model="form.permsType" label="and">满足全部</el-radio>
          </el-form-item>
          <el-form-item label="访问角色" label-width="120px">
            <el-select v-model="form.role" multiple placeholder="请选择">
              <el-option
                v-for="{roleName} in roles"
                :key="roleName"
                :label="roleName"
                :value="roleName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.dialogFormVisible&&getRoleLen(this.form)>0" label="角色设置" label-width="120px">
            <el-radio v-model="form.roleType" label="yes">允许</el-radio>
            <el-radio v-model="form.roleType" label="no">不允许</el-radio>
          </el-form-item>
          <el-form-item label="菜单类型" label-width="120px">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="{type,name} in types"
                :key="type"
                :label="name"
                :value="type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单图标" label-width="120px">
            <el-select v-model="form.icon" clearable filterable placeholder="请选择">
              <el-option
                v-for="{icon,name} in icons"
                :key="icon"
                :label="name"
                :value="icon"
                class="el-option"
              >
                <i :class="`el-icon-${icon}`"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" label-width="120px">
            <el-input
              v-model="form.orderNum"
              placeholder="同级菜单中的排序"
              style="width: 300px"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="form.type !==0" label="父菜单" label-width="120px">
            <el-select v-model="form.parentId" placeholder="请选择">
              <el-option
                v-for="{menuId,name} in parentMenus"
                :key="menuId"
                :label="name"
                :value="menuId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="访问权限" label-width="120px">
            <el-select v-model="form.access" placeholder="访问菜单需要的权限">
              <el-option
                v-for="{roleId,roleName,access} in roles"
                :key="roleId"
                :label="roleName"
                :value="access"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false;">取 消</el-button>
          <el-button type="primary" @click="handleInsert(form)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑按钮打开的页面 -->
      <el-dialog
        :visible.sync="dialogFormVisibleChange"
        title="编辑菜单"
        width="35%"
      >
        <el-form :model="formChange">
          <el-form-item label="菜单名称" label-width="120px">
            <el-input
              v-model="formChange.name"
              autocomplete="off"
              placeholder="菜单名称"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="菜单URL" label-width="120px">
            <el-input
              v-model="formChange.url"
              autocomplete="off"
              placeholder="菜单URL"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="列表权限" label-width="120px">
            <el-select v-model="formChange.perms" filterable multiple placeholder="请选择">
              <el-option
                v-for="{name,perm} in perms"
                :key="perm"
                :label="perm"
                :value="name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.dialogFormVisibleChange&&getPermLen(this.formChange)>1" label="权限类型"
                        label-width="120px">
            <el-radio-group v-model="formChange.permsType">
              <el-radio label="or">满足其一</el-radio>
              <el-radio label="and">满足全部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="访问角色" label-width="120px">
            <el-select v-model="formChange.role" filterable multiple placeholder="请选择">
              <el-option
                v-for="{roleName} in roles"
                :key="roleName"
                :label="roleName"
                :value="roleName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="this.dialogFormVisibleChange&&getRoleLen(this.formChange)>0" label="角色设置"
                        label-width="120px">
            <el-radio v-model="formChange.roleType" label="yes">允许</el-radio>
            <el-radio v-model="formChange.roleType" label="no">不允许</el-radio>
          </el-form-item>
          <el-form-item label="类型" label-width="120px">
            <el-select v-model="formChange.type" placeholder="">
              <el-option
                v-for="{type,name} in types"
                :key="type"
                :label="name"
                :value="type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单图标" label-width="120px">
            <el-select v-model="formChange.icon" placeholder="无">
              <el-option
                v-for="{icon,name} in icons"
                :key="icon"
                :label="name"
                :value="icon"
              ><i :class="`el-icon-${icon}`"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" label-width="120px">
            <el-input
              v-model="formChange.orderNum"
              autocomplete="off"
              placeholder="排序"
              style="width: 300px"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="formChange.type !== 0"
            label="父菜单"
            label-width="120px"
          >
            <el-select
              v-model="formChange.parentId"
              placeholder="请选择父菜单"
            >
              <el-option
                v-for="{menuId,name} in parentMenus"
                :key="menuId"
                :label="name"
                :value="menuId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="访问权限" label-width="120px">
            <el-select v-model="formChange.access">
              <el-option
                v-for="{roleId,roleName,access} in roles"
                :key="roleId"
                :label="roleName"
                :value="access"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleChange = false">取 消</el-button>
          <el-button type="primary" @click="handleChange()">更 新</el-button>
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
  name: "SysMenu",
  data() {
    return {
      dataFrom: {
        name: "",
        parentId: "",
        type: "",
        url: ""
      },
      dataFrom1: {},//搜索缓存
      //新增
      form: {
        parentId: "",
        name: "",
        url: "",
        perms: "",
        permsType: "",
        role: [],
        roleType: "",
        orderNum: "",
        access: "",
        type: "",
      },
      //编辑
      formChange: {
        parentId: "",
        name: "",
        url: "",
        perms: "",
        type: "",
        icon: "",
        orderNum: "",
      },
      icons: [], //添加是可以选择的图标
      dataList: [], //页面展示的数据集合
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      begin: 0,
      end: this.pageSize - 1,
      dialogFormVisible: false, //默认关闭新建菜单界面
      dialogFormVisibleChange: false, //默认关闭编辑菜单界面
      parentMenus: [], //父级菜单
      types: [], //类型菜单
      roles: [], //角色信息菜单
      perms: [], //授权/权限列表
      dataListFrom: "getDataList",//当前数据来源于搜索还是全局
    };
  },

  methods: {
    //获取父菜单
    ParentMenu() {
      this.$http.post("/menu/listParent").then((res) => {
        this.parentMenus = res;
      });
    },
    //获取角色信息
    getRoleList() {
      this.$http.post("/role/getRoleKindList").then((res) => {
        this.roles = res;
      });
    },
    //获取选择的角色列表的长度
    getRoleLen(form) {
      return this.$ObserverToObject(form.role).length;
    },
    //获取选择的权限列表的长度
    getPermLen(form) {
      return this.$ObserverToObject(form.perms).length;
    },
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
      if (this.dataListFrom === "getDataList")
        this.getDataList();
      else this.getDataListBySearch();
    },
    //打开新增页面
    addMenu() {
      //刷新表格
      this.form = {};
      //清空父级菜单
      this.parentMenus = [];
      //获取父菜单
      this.ParentMenu();
      //获取权限菜单
      this.getRoleList();
      //打开页面
      this.dialogFormVisible = true;
    },
    //增加菜单前的数据检查
    handleInsert(item) {
      if (typeof item.name === "undefined") {
        this.$message.warning("菜单名称不能为空")
      } else if (typeof item.url === "undefined") {
        this.$message.warning("菜单url不能为空")
      } else if (typeof item.permsType === "undefined" && typeof item.perms === "undefined") {
        this.$message.warning("授权类型不能为空")
      } else if (typeof item.roleType === "undefined" && typeof item.role === "undefined") {
        this.$message.warning("角色设置不能为空")
      } else if (typeof item.type === "undefined") {
        this.$message.warning("菜单类型不能为空")
      } else if (typeof item.icon === "undefined") {
        this.$message.warning("菜单图标不能为空")
      } else if (typeof item.orderNum === "undefined") {
        this.$message.warning("菜单排序不能为空")
      } else if (typeof item.parentId === "undefined" && item.type !== 0) {
        this.$message.warning("父级菜单不能为空")
      } else if (typeof item.access === "undefined") {
        this.$message.warning("访问权限不能为空")
      } else {
        this.menuInsert(item)
      }
    },
    //增加菜单
    menuInsert(item) {
      const data = {
        menuBo: item,
        pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
      }
      this.$http.post("/menu/insert", data).then((res) => {
        //关闭窗口
        this.dialogFormVisible = false;
        //刷新页面
        this.cutDataList(res);
      });
    },
    //编辑页面的确认键
    handleChange() {
      const data = {
        menu: this.formChange,
        pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
      }
      this.$http.post("/menu/update", data).then((res) => {
        this.dialogFormVisibleChange = false;
        this.cutDataList(res)
      });
    },
    //查询所有数据
    getDataList() {
      this.dataListFrom = "getDataList";
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex)
      this.$http.post("/menu/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询单条数据
    getDataListBySearch() {
      const data = {
        menuBo: Object.assign({}, this.dataFrom),
        pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
      }
      this.dataListFrom = "getDataListBySearch";
      //搜索条件不为空
      this.$http.post("/menu/getList/search", data).then((res) => {
        this.cutDataList(res);
      })
    },
    //分页操作
    cutDataList(res) {
      const data = this.$cutPageDataList(res)
      this.dataList = data.dataList
      this.totalPage = data.totalPage
    },
    //编辑按钮
    handleEdit(index, item) {
      this.dialogFormVisibleChange = true; //打开编辑菜单界面
      //清空回显数据
      this.formChange = [];
      //回显数据
      this.formChange = item;
      //清空父级菜单
      this.parentMenus = [];
      //获取父菜单
      this.ParentMenu();
      //获取权限列表
      this.getRoleList();
    },
    //删除按钮
    handleDelete(index, item) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            menuBo: item,
            pageBo: this.$getPageInfo(this.pageSize, this.pageIndex)
          }
          this.$http.post("/menu/delete", data).then((res) => {
            this.cutDataList(res)
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    getType() {
      this.$http.post("/dict/getDict/menuType").then(res => {
        this.types = this.$StrToJson(res);
      })
    },
    getIcon() {
      this.$http.post("/dict/getDict/icon").then(res => {
        this.icons = this.$StrToJson(res);
      })
    },
    getPerms() {
      this.$http.post("/perm/getList").then(res => {
        this.perms = res;
      })
    },
  },
  mounted() {
    //获取所有菜单
    this.getDataList();
    //获取父菜单
    this.ParentMenu();
    //导入icon图标
    this.getIcon();
    //导入types类型
    this.getType()
    //导入perms列表
    this.getPerms()
  },
};
</script>
<style lang="less">
.el-option {
  float: left;
}
</style>
