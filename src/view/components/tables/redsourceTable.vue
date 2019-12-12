<template v-for="(item,index) in showList">
  <div>
    <Card>
      <Form :model="formValidate" :label-width="100"  inline> 
        红酒品牌:<Input style="width: 150px;" v-model="formValidate.redname" placeholder="请输入红酒品牌"></Input>    
         &nbsp; &nbsp; &nbsp;   
        <Button type="primary" @click="handleSearch()">搜索</Button>
      </Form>
      &nbsp; &nbsp; &nbsp; 
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
      />
      <Page
        :total="dataCount"
        :page-size="pageSize"
        @on-change="onChangepage"
        style="padding-left: 20px;"
        size="small"
        show-total
        show-elevator
        show-sizer
      ></Page>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <!-- 修改模态框 -->
    <Modal v-model="modalVisible" title="修改">
      <template>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Form-item label="红酒编号" prop="redID">
            <Input v-model="formValidate.redID" readonly="readonly"></Input>
          </Form-item>
          <Form-item label="红酒品牌" prop="redname">
            <Input v-model="formValidate.redname" placeholder="请重新输入红酒品牌"></Input>
          </Form-item>
          <Form-item label="原产地" prop="sourcearea">
            <Input v-model="formValidate.sourcearea" placeholder="请重新输入原产地"></Input>
          </Form-item>
          <Form-item label="生产日期" prop="sourceyear">
            <Input v-model="formValidate.sourceyear" placeholder="请重新输入生产日期"></Input>
          </Form-item>
          <Form-item label="生产公司" prop="sourcecompany">
            <Input v-model="formValidate.sourcecompany" placeholder="请重新输入检测时间生产公司"></Input>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button type="primary" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </Form-item>
        </Form>
      </template>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { 
 getreesourceTableData,
 getredsourceByRedID,
 updateRedSource,
 daletRedSourceByRedID,
 findredSourceByRedname
} from "@/api/redsource";
import axios from "axios";
export default {
  name: "tables_page",
  //局部刷新
  inject: ["reload"],
  components: {
    Tables
  },
  data() {
    return {
      pageSize: 15,
      totalProblemList: [],
      showList: [],
      dataCount: 0,
      modalVisible: false,
      columns: [
        { title: "红酒编号", key: "redID", sortable: true },
        { title: "红酒品牌", key: "redname", editable: true },
        { title: "原产地", key: "sourcearea" },
        { title: "生产日期", key: "sourceyear" },
        { title: "生产公司", key: "sourcecompany" },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, tableData) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.updataredSource(tableData.index);
                    }
                  },
                  style: {                                  
                    marginRight: "5px"
                  },
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.daletRedSource(tableData.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      formValidate: {
        redID: "",
        redname: "",
        sourcearea: "",
        sourceyear: "",
        sourcecompany: "",
      },
      ruleValidate: {
        redname: [
          { required: true, message: "红酒名字不能为空", trigger: "blur" }
        ],
        wendu: [{ required: true, message: "温度不能为空", trigger: "blur" }],
        shidu: [{ required: true, message: "湿度不能为空", trigger: "blur" }],
        sensonrnum: [
          { required: true, message: "设备号不能为空", trigger: "blur" }
        ],
        totime: [{ required: true, message: "时间不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    },
    // 前端分页
    onChangepage(index) {
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      this.showList = this.totalProblemList.slice(_start, _end);
    },
    // 重新拿刷新数据
    getNewTableDate() {
      getreesourceTableData().then(res => {
        this.tableData = res.data;
      });
    },
    /**
     * 删除操作
     * @param:rednum
     */
    daletRedSource(index) {
      console.log(this.tableData[index]);
      var result = confirm("请确认是否删除？");
      if (result) {
        daletRedSourceByRedID(this.tableData[index].redID).then(res => {
          if (res) {
            this.$Message.success("删除成功！");
            this.getNewTableDate();
          } else {
            this.$Message.error("删除失败！");
          }
        });
      } else {
        this.$Message.error("删除取消！");
      }
    },
    /**
     * 红酒信息修改操作
     * @param:rednum
     * @param:redname
     * @param:wendu
     * @param:shidu
     * @param:totime
     */
    updataredSource(index) {
      getredsourceByRedID(this.tableData[index].redID).then(res => {
        console.log(res.data[0]);
        this.formValidate.redID = res.data[0].redID;
        this.formValidate.redname = res.data[0].redname;
        this.formValidate.sourcearea = res.data[0].sourcearea;
        this.formValidate.sourceyear = res.data[0].sourceyear;
        this.formValidate.sourcecompany = res.data[0].sourcecompany;
      });
      this.modalVisible = true;
    },
    handleSubmit() {
      this.$refs.formValidate.validate(validate => {
        console.log(validate);
        var formdata = {};
        formdata.redname = this.formValidate.redname;
        formdata.sourcearea = this.formValidate.sourcearea;
        formdata.sourceyear = this.formValidate.sourceyear;
        formdata.sourcecompany = this.formValidate.sourcecompany;
        formdata.redID = this.formValidate.redID;
        console.log(formdata);
        if (validate) {
          updateRedSource(formdata).then(res => {
            this.$Message.success("修改成功！");
            this.getNewTableDate();
            this.modalVisible = false;
          });
        } else {
          this.$message.error("修改失败！！");
        }
      });
    },
    //搜索功能
    handleSearch() {
      var formdata = {};
      formdata.redname = this.formValidate.redname
      this.getfindredSourceByRedname(formdata);
      console.log(formdata.redname)
    },
    getfindredSourceByRedname(formdata){
       if (formdata.redname === "") {
        getreesourceTableData().then(res => {
          this.tableData = res.data;
        });
      }
      findredSourceByRedname(formdata).then(res=>{
        console.log(res)
        this.tableData = res.data
      })
    }
  },
  mounted() {
    getreesourceTableData().then(res => {
      this.totalProblemList = res.data;
      // 拿到所有数据
      this.dataCount = this.totalProblemList.length;
      // 总条数
      if (this.dataCount < this.pageSize) {
        this.showList = this.totalProblemList;
      } else {
        this.showList = this.totalProblemList.slice(0, this.pageSize);
      }
    });
  },
  //请求钩子
  created() {
    getreesourceTableData().then(res => {
      this.tableData = res.data;
    });
  }
};
</script>

<style>
.intro-con {
  min-height: 140px;
}
.draggable-btn {
  margin-top: 20px;
}
.code-con {
  width: 400px;
  background: #f9f9f9;
  padding-top: 10px;
}
.ivu-modal-footer {
  display: none;
}
</style>
