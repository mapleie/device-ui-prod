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
        <el-form-item label="维修部位">
          <el-input
            v-model="dataFrom.name"
            clearable
            placeholder="维修部位"
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
        <el-table-column label="序号" prop="id" width="80">
        </el-table-column>
        <el-table-column label="设备名称" prop="deviceName" width="166">
        </el-table-column>
        <el-table-column label="送修人" prop="userName" width="120">
        </el-table-column>
        <el-table-column label="故障时间" prop="faultTime" width="100">
        </el-table-column>
        <el-table-column label="修复时间" prop="repairTime" width="100">
        </el-table-column>
        <el-table-column label="维修部位" prop="repairParts" width="80">
        </el-table-column>
        <el-table-column label="维修状态" prop="repairStatus" width="100">
        </el-table-column>
        <el-table-column label="维修方式" prop="method" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.method === 1 ? "返厂" : "驻厂" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="故障原因" prop="failureCause" width="130">
        </el-table-column>
        <el-table-column label="维修厂家" prop="factory" width="100">
        </el-table-column>
        <el-table-column label="维修费用" prop="cost" width="80">
        </el-table-column>
        <el-table-column label="设备供应商名称" prop="deviceFactoryName" width="160">
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="80">
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
        title="创建维修信息"
        width="45%"
      >
        <el-form :model="form" size="small">
          <el-form-item label="设备名称" label-width="120px">
            <el-select v-model="form.deviceMsgId" placeholder="请选择">
              <el-option
                v-for="item in deviceList"
                :key="item.deviceId"
                :label="item.name"
                :value="item.deviceId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送修人" label-width="120px">
            <el-select v-model="form.userId" placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.name"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障时间" label-width="120px">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="故障时间"
                v-model="form.faultTime"
                style="width: 200px"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="修复时间" label-width="120px">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="修复时间"
                v-model="form.repairTime"
                style="width: 200px"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="维修部位" label-width="120px">
            <el-input
              v-model="form.repairParts"
              autocomplete="off"
              placeholder="维修部位"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="维修状态" label-width="120px">
            <el-select v-model="form.repairStatus" placeholder="请选择">
              <el-option label="维修中" value="维修中"></el-option>
              <el-option label="完成" value="完成"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维修方式" label-width="120px">
            <el-select v-model="form.method" placeholder="请选择">
              <el-option label="返厂" value="1"></el-option>
              <el-option label="驻厂" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障原因" label-width="120px">
            <el-input
              v-model="form.failureCause"
              autocomplete="off"
              placeholder="故障原因"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="维修厂家" label-width="120px">
            <el-input
              v-model="form.factory"
              autocomplete="off"
              placeholder="维修厂家"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="维修费用" label-width="120px">
            <el-input
              v-model="form.cost"
              autocomplete="off"
              placeholder="维修费用"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" label-width="120px">
            <el-select v-model="form.deviceFactory" filterable placeholder="请选择">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
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
        deviceMsgId: "",
        userId: "",
        faultTime: "",
        repairTime: "",
        repairParts: "",
        repairStatus: "",
        failureCause: "",
        remark: "",
        method: "",
        factory: "",
        cost: "",
        deviceFactory: "",
      },
      dataList: [], //页面展示的数据集合
      userList:[],//页面展示用户的数据集合
      deviceList:[],//页面展示设备的数据集合
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
      this.$http.post("/device/repair/insert", this.form).then(() => {
        this.dialogFormVisible = false; //关闭窗口
        this.getDataList();
      });
    },
    //查询所有数据
    getDataList() {
      this.dataListFrom = "getDataList";
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex);
      this.$http.post("device/repair/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询用户所有数据
    getUserList() {
      this.$http.post("/user/List").then((res) => {
        this.userList = res;
      });
    },
     //查询设备信息所有数据
     getDeviceList() {
      this.$http.post("/device/message/lists").then((res) => {
        this.deviceList = res;
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
            repair: item,
            pageBo: this.$getPageInfo(this.pageSize, this.pageIndex),
          };
          this.$http.post("/device/repair/delete", data).then((res) => {
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
        this.$http.post("/device/repair/search", data).then((res) => {
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
    this.getUserList();
    this.getDeviceList();
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