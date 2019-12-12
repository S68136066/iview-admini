<template v-for="(item,index) in showList">
  <div>
    <Card>
      <Form :model="formValidate" :label-width="100"  inline>
        红酒名字:<Input style="width: 150px;" v-model="formValidate.redname" placeholder="请输入红酒名字"></Input>
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
          <Form-item label="红酒编号" prop="rednum">
            <Input v-model="formValidate.rednum" readonly="readonly"></Input>
          </Form-item>
          <Form-item label="红酒名字" prop="redname">
            <Input v-model="formValidate.redname" placeholder="请重新输入红酒名字"></Input>
          </Form-item>
          <Form-item label="温度" prop="wendu">
            <Input v-model="formValidate.wendu" placeholder="请重新输入温度"></Input>
          </Form-item>
          <Form-item label="湿度" prop="shidu">
            <Input v-model="formValidate.shidu" placeholder="请重新输入湿度"></Input>
          </Form-item>
          <Form-item label="检测时间" prop="totime">
            <Input v-model="formValidate.totime" placeholder="请重新输入检测时间"></Input>
          </Form-item>
          <Form-item label="设备号" prop="wendu">
            <Input v-model="formValidate.sensonrnum" placeholder="请重新输入设备号"></Input>
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
import Tables from '_c/tables'
import {
  getTableData,
  getdelRedHis,
  getRedHisByRednum,
  updateRedHis,
  getfindredHisByRedname
} from '@/api/data'
import axios from 'axios'
export default {
  name: 'tables_page',
  // 局部刷新
  inject: ['reload'],
  components: {
    Tables
  },
  data () {
    return {
      pageSize: 15,
      totalProblemList: [],
      showList: [],
      dataCount: 0,
      modalVisible: false,
      columns: [
        { title: 'Name', key: 'redname', sortable: true },
        { title: '温度(℃)', key: 'wendu', editable: true, align: 'center' },
        { title: '湿度(%)', key: 'shidu', align: 'center' },
        { title: '检测时间', key: 'totime', align: 'center' },
        { title: '设备号', key: 'sensonrnum', align: 'center' },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let text1 = ''
            let color1 = ''
            let text2 = ''
            let color2 = ''
            if (row.wendu > 10 && row.wendu < 14) {
              text1 = '温度正常'
              color1 = 'green'
            } else {
              text1 = '温度异常'
              color1 = 'red'
            } if (row.shidu > 65 && row.shidu < 76) {
              text2 = '湿度正常'
              color2 = 'green'
            } else {
              text2 = '湿度异常'
              color2 = 'red'
            }
            return h('div', [
              h(
                'Tag',
                {
                  props: {
                    color: color1
                  }
                },
                text1
              ),
              h(
                'Tag',
                {
                  props: {
                    color: color2
                  }
                },
                text2
              )
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, tableData) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.updataredHis(tableData.index)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.daletTable(tableData.index)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      formValidate: {
        rednum: '',
        redname: '',
        wendu: '',
        shidu: '',
        sensonrnum: '',
        totime: ''
        // price:''
      },
      ruleValidate: {
        redname: [
          { required: true, message: '红酒名字不能为空', trigger: 'blur' }
        ],
        wendu: [{ required: true, message: '温度不能为空', trigger: 'blur' }],
        shidu: [{ required: true, message: '湿度不能为空', trigger: 'blur' }],
        sensonrnum: [
          { required: true, message: '设备号不能为空', trigger: 'blur' }
        ],
        totime: [{ required: true, message: '时间不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    // 前端分页
    onChangepage (index) {
      debugger
      var _start = (index - 1) * this.pageSize
      var _end = index * this.pageSize
      this.showList = this.totalProblemList.slice(_start, _end)
    },
    // 重新拿刷新数据
    getNewTableDate () {
      getTableData().then(res => {
        this.tableData = res.data
      })
    },
    // 搜索功能
    handleSearch () {
      var formdata = {}
      formdata.redname = this.formValidate.redname
      this.getfindredHisByRedname1(formdata)
      console.log(formdata.redname)
    },
    getfindredHisByRedname1 (formdata) {
      if (formdata.redname === '') {
        getTableData().then(res => {
          this.tableData = res.data
        })
      }
      getfindredHisByRedname(formdata).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    },
    /**
     * 删除操作
     * @param:rednum
     */
    daletTable (index) {
      console.log(this.tableData[index])
      var result = confirm('请确认是否删除？')
      if (result) {
        getdelRedHis(this.tableData[index].rednum).then(res => {
          if (res) {
            this.$Message.success('删除成功！')
            this.getNewTableDate()
          } else {
            this.$Message.error('删除失败！')
          }
        })
      } else {
        this.$Message.error('删除取消！')
      }
    },
    /**
     * 红酒温湿度历史信息修改操作
     * @param:rednum
     * @param:redname
     * @param:wendu
     * @param:shidu
     * @param:totim
     */
    updataredHis (index) {
      getRedHisByRednum(this.tableData[index].rednum).then(res => {
        console.log(res.data[0])
        this.formValidate.rednum = res.data[0].rednum
        this.formValidate.redname = res.data[0].redname
        this.formValidate.wendu = res.data[0].wendu
        this.formValidate.shidu = res.data[0].shidu
        this.formValidate.totime = res.data[0].totime
        this.formValidate.sensonrnum = res.data[0].sensonrnum
      })
      this.modalVisible = true
    },
    handleSubmit () {
      this.$refs.formValidate.validate(validate => {
        console.log(validate)
        var formdata = {}
        formdata.redname = this.formValidate.redname
        formdata.wendu = this.formValidate.wendu
        formdata.shidu = this.formValidate.shidu
        formdata.totime = this.formValidate.totime
        formdata.sensonrnum = this.formValidate.sensonrnum
        formdata.rednum = this.formValidate.rednum
        console.log(formdata)
        if (validate) {
          updateRedHis(formdata).then(res => {
            this.$Message.success('修改成功！')
            this.getNewTableDate()
            this.modalVisible = false
          })
        } else {
          this.$message.error('修改失败！！')
        }
      })
    }
  },
  mounted () {
    getTableData().then(res => {
      this.totalProblemList = res.data
      // 拿到所有数据
      this.dataCount = this.totalProblemList.length
      // 总条数
      if (this.dataCount < this.pageSize) {
        this.showList = this.totalProblemList
      } else {
        this.showList = this.totalProblemList.slice(0, this.pageSize)
      }
    })
  },
  // 请求钩子
  created () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}
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
