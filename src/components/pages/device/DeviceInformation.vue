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
        <el-form-item label="设备名称">
          <el-input
            v-model="dataFrom.name"
            clearable
            placeholder="设备名称"
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
        <el-table-column label="序号" prop="id" width="70"> </el-table-column>
        <el-table-column label="巡检周期" prop="inspectionCycle" width="80">
        </el-table-column>
        <el-table-column label="设备类型" prop="typeName" width="80">
        </el-table-column>
        <el-table-column label="设备名称" prop="name" width="100">
        </el-table-column>
        <el-table-column label="设备编号" prop="deviceId" width="100">
        </el-table-column>
        <el-table-column label="设备地点" prop="place" width="150">
        </el-table-column>
        <el-table-column label="状态" prop="status" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 1 ? "差" : "良好" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否报废" prop="scrap" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.scrap === 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="amount" width="50">
        </el-table-column>
        <el-table-column label="条形码" prop="barcode" width="160">
        </el-table-column>
        <el-table-column label="是否巡检" prop="inspection" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.inspection === 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安装时间" prop="installTime" width="100">
        </el-table-column>
        <el-table-column label="到期时间" prop="expiryTime" width="100">
        </el-table-column>
        <el-table-column label="供应商名称" prop="companyName" width="160">
        </el-table-column>
        <el-table-column label="出厂日期" prop="factoryDate" width="100">
        </el-table-column>
        <el-table-column label="保质期" prop="warranty" width="70">
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
        title="创建设备信息"
        width="45%"
      >
        <el-form :model="form" size="small">
          <el-form-item label="巡检周期" label-width="120px">
            <el-input
              v-model="form.inspectionCycle"
              autocomplete="off"
              placeholder="巡检周期"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备类型" label-width="120px">
            <el-select v-model="form.typeId" filterable placeholder="请选择">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" label-width="120px">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="设备名称"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备编号" label-width="120px">
            <el-input
              v-model="form.deviceId"
              autocomplete="off"
              placeholder="设备编号"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备地点" label-width="120px">
            <el-input
              v-model="form.place"
              autocomplete="off"
              placeholder="设备地点"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="120px">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="差" value="1"></el-option>
              <el-option label="良好" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否报废" label-width="120px">
            <el-select v-model="form.scrap" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量" label-width="120px">
            <el-input
              v-model="form.amount"
              autocomplete="off"
              placeholder="数量"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="条形码" label-width="120px">
            <el-input
              v-model="form.barcode"
              autocomplete="off"
              placeholder="条形码"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否巡检" label-width="120px">
            <el-select v-model="form.inspection" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安装时间" label-width="120px">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="安装时间"
                v-model="form.installTime"
                style="width: 200px"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="到期时间" label-width="120px">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="报废日期"
                v-model="form.expiryTime"
                style="width: 200px"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商名称" label-width="120px">
            <el-select v-model="form.companyId" filterable placeholder="请选择">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出厂日期" label-width="120px">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="出厂日期"
                v-model="form.factoryDate"
                style="width: 200px"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="保质期" label-width="120px">
            <el-input
              v-model="form.warranty"
              autocomplete="off"
              placeholder="保质期"
              style="width: 200px"
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
        inspectionCycle: "",
        typeId: "",
        name: "",
        deviceId: "",
        place: "",
        status: "",
        scrap: "",
        amount: "",
        barcode: "",
        inspection: "",
        installTime: "",
        expiryTime: "",
        companyId: "",
        factoryDate: "",
        warranty: "",
      },
      dataList: [], //页面展示的数据集合
      typeList: [], //页面展示类型的数据集合
      companyList: [], //页面展示供应商的数据集合
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
      this.$http.post("/device/message/insert", this.form).then(() => {
        this.dialogFormVisible = false; //关闭窗口
        this.getDataList();
      });
    },
    //查询所有数据
    getDataList() {
      this.dataListFrom = "getDataList";
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex);
      this.$http.post("device/message/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询类型所有数据
    getTypeList() {
      this.$http.post("device/type/lists").then((res) => {
        this.typeList = res;
      });
    },
    //查询供应商所有数据
    getcompanyList() {
      this.$http.post("device/company/lists").then((res) => {
        this.companyList=res;
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
            deviceScrap: item,
            pageBo: this.$getPageInfo(this.pageSize, this.pageIndex),
          };
          this.$http.post("/device/message/delete", data).then((res) => {
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
        this.$http.post("/device/message/search", data).then((res) => {
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
    this.getTypeList();
    this.getcompanyList();
  },
};
</script>

<style>
.el-form {
  display: flex;
  flex-wrap: wrap;
}
</style>