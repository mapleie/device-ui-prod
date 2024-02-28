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
        <el-form-item label="设备编号">
          <el-input
            v-model="dataFrom.name"
            clearable
            placeholder="设备编号"
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
        <el-table-column label="设备报废序号" prop="id" width="120">
        </el-table-column>
        <el-table-column label="设备编号" prop="deviceId" width="200">
        </el-table-column>
        <el-table-column label="设备名称" prop="deviceName" width="200">
        </el-table-column>
        <el-table-column label="报废人名称" prop="userName" width="150">
        </el-table-column>
        <el-table-column label="报废日期" prop="scrapTime" width="150">
        </el-table-column>
        <el-table-column label="报废类型" prop="type" width="100">
        </el-table-column>
        <el-table-column label="报废去向" prop="scrapDestination" width="100">
        </el-table-column>
        <el-table-column label="处理收支" prop="handle" width="100">
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="150">
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
        title="创建设备报废"
        width="35%"
      >
        <el-form :model="form">
          <el-form-item label="设备编号" label-width="120px">
            <el-input
              v-model="form.deviceId"
              autocomplete="off"
              placeholder="设备编号"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="报废人名称" label-width="120px">
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
          <el-form-item label="报废日期" label-width="120px">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="报废日期"
                v-model="form.scrapTime"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="报废类型" label-width="120px">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报废去向" label-width="120px">
            <el-input
              v-model="form.scrapDestination"
              autocomplete="off"
              placeholder="报废去向"
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理收支" label-width="120px">
            <el-input
              v-model="form.handle"
              autocomplete="off"
              placeholder="处理收支"
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
        deviceId: "",
        userId: "",
        scrapTime: "",
        type:"",
        scrapDestination:"",
        handle:"",
        remark:"",
      },
      options: [{
          value: '自然老化',
        }, {
          value: '损坏',
        }, {
          value: '报废',
        }, ],
      dataList: [], //页面展示的数据集合
      deviceList: [], //页面展示设备的数据集合
      userList: [], //页面展示用户的数据集合
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
      this.$http.post("/device/scrap/insert", this.form).then(() => {
        this.dialogFormVisible = false; //关闭窗口
        this.getDataList();
      });
    },
    //查询所有数据
    getDataList() {
      this.dataListFrom = "getDataList";
      const pageInfo = this.$getPageInfo(this.pageSize, this.pageIndex);
      this.$http.post("device/scrap/getList", pageInfo).then((res) => {
        this.cutDataList(res);
      });
    },
    //查询所有设备
    getDaviceList() {
      this.$http.post("/user/List").then((res) => {
        this.userList = res;
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
          this.$http.post("/device/scrap/delete", data).then((res) => {
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
        this.$http.post("/device/scrap/search", data).then((res) => {
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
    this.getDaviceList();
  },
};
</script>
