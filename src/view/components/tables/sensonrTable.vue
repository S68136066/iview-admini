<template v-for="(item,index) in showList">
  <div>
    <Card>
      <Form :model="formValidate" :label-width="100" inline>
        设备号:
        <Input style="width: 150px;" v-model="formValidate.sensonrnum" placeholder="请输入要查询的设备号"></Input>&nbsp; &nbsp; &nbsp;
        <Button type="primary" @click="handleSearch()">搜索</Button>
      </Form>&nbsp; &nbsp; &nbsp;
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

          <Form-item label="设备号" prop="sensonrnum">
            <Input v-model="formValidate.sensonrnum" readonly="readonly"></Input>
          </Form-item>
          <Form-item label="设备名称" prop="sensorname">
            <Input v-model="formValidate.sensorname" placeholder="请重新输入设备名称"></Input>
          </Form-item>
          <Form-item label="状态" prop="state">
            <Input v-model="formValidate.state" placeholder="请重新输入状态 0:关闭;1:打开"></Input>
          </Form-item>
          <Form-item label="设备串口号" prop="com">
            <Input v-model="formValidate.com" placeholder="请重新输入设备串口号"></Input>
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
  getsensonrTableData,
  GetfindSensonrByNum,
  GetfindSensonrByNumSousuo,
  DelSensonrByNum,
  updateSensonr
} from '@/api/sensonr'
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
        { title: '设备号', key: 'sensonrnum', sortable: true },
        {
          title: '设备名称',
          key: 'sensorname',
          editable: true,
          align: 'center'
        },
        {
          title: '状态',
          key: 'state',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let text = ''
            let color = ''
            if (row.state === 0) {
              text = '关闭'
              color = 'red'
            } else if (row.state === 1) {
              text = '开启'
              color = 'green'
            }
            return h(
              'Tag',
              {
                props: {
                  color: color
                }
              },
              text
            )
          }
        },
        { title: '设备串口号', key: 'com', align: 'center' },
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
                      this.updataredSensonr(tableData.index)
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
                      this.DelSensonr(tableData.index)
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
        sensonrnum: '',
        sensorname: '',
        state: '',
        com: ''
      },
      ruleValidate: {
        sensorname: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        state: [
          {
            required: true,
            message: '状态不可为空0:正常 1:关闭',
            trigger: 'blur'
          }
        ],
        com: [{ required: true, message: '串口号不能为空', trigger: 'blur' }]
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
      var _start = (index - 1) * this.pageSize
      var _end = index * this.pageSize
      this.showList = this.totalProblemList.slice(_start, _end)
    },
    // 重新拿 刷新数据
    getNewTableDate () {
      getsensonrTableData().then(res => {
        this.tableData = res.data
      })
    },
    /**
     * 删除操作
     * @param:rednum
     */
    DelSensonr (index) {
      console.log(this.tableData[index])
      var result = confirm('请确认是否删除？')
      if (result) {
        DelSensonrByNum(this.tableData[index].sensonrnum).then(res => {
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
     * 传感器信息修改操作
     */
    updataredSensonr (index) {
      GetfindSensonrByNum(this.tableData[index].sensonrnum).then(res => {
        console.log(res.data[0])
        this.formValidate.sensonrnum = res.data[0].sensonrnum
        this.formValidate.sensorname = res.data[0].sensorname
        this.formValidate.state = res.data[0].state
        this.formValidate.com = res.data[0].com
      })
      this.modalVisible = true
    },
    handleSubmit () {
      this.$refs.formValidate.validate(validate => {
        console.log(validate)
        var formdata = {}
        formdata.sensonrnum = this.formValidate.sensonrnum
        formdata.sensorname = this.formValidate.sensorname
        formdata.state = this.formValidate.state
        formdata.com = this.formValidate.com

        console.log(formdata)
        if (validate) {
          updateSensonr(formdata).then(res => {
            this.$Message.success('修改成功！')
            this.getNewTableDate()
            this.modalVisible = false
          })
        } else {
          this.$message.error('修改失败！！')
        }
      })
    },
    // 搜索功能
    handleSearch () {
      var formdata = {}
      formdata.sensonrnum = this.formValidate.sensonrnum
      this.GetfindSensonrByNum1(formdata)
    },
    GetfindSensonrByNum1 (formdata) {
      if (formdata.sensonrnum === '') {
        getsensonrTableData().then(res => {
          this.tableData = res.data
        })
      }
      GetfindSensonrByNumSousuo(formdata).then(res => {
        console.log(res)
        this.tableData = res.data
      })
    }
  },
  mounted () {
    getsensonrTableData().then(res => {
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
    getsensonrTableData().then(res => {
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
