<template v-for="(item,index) in showList">
  <div>
    
    <!-- <iframe id="audio" allow="autoplay" style="display:none" src="../audio/tishiJar.wav"></iframe> -->
    <Card>
      负责人：
      <Select
        filterable
        v-model="model1"
        style="width:100px"
        @on-change="hanlePrincpalSelect"
        @on-clear="handleSelectClear"
      >
        <Option v-for="item in princpalList" :value="item.pname" :key="item.pid">{{ item.pname }}</Option>
      </Select>
      <Button type="success" @click="InsertJarManger">新增</Button>
    </Card>
    <Card>
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
          <Form-item label="需求号" prop="jarName">
            <Input v-model="formValidate.jarName"></Input>
          </Form-item>
          <Form-item label="需求负责人" prop="principal">
            <Select v-model="formValidate.principal">
              <Option
                v-for="item in princpalList"
                :value="item.pname"
                :key="item.pid"
              >{{ item.pname }}</Option>
            </Select>
          </Form-item>
          <Form-item label="更新环境" prop="upEnv">
            <Select v-model="formValidate.upEnv">
              <Option value="DAT">DAT</Option>
              <Option value="UAT">UAT</Option>
              <Option value="PRE">PRE</Option>
              <Option value="ONL">ONL</Option>
            </Select>
          </Form-item>
          <Form-item label="提交时间" prop="subTime">
            <Row>
              <Col span="11">
                <FormItem prop="date">
                  <DatePicker
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="Select date"
                    v-model="formValidate.date"
                    @on-change="formValidate.date=$event"
                    :value="formValidate.date"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="time">
                  <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button type="primary" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </Form-item>
        </Form>
      </template>
    </Modal>
    <!-- 新增模态框-->
    <Modal v-model="modalVisibleAdd" title="新增">
      <template>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Form-item label="需求号" prop="jarName">
            <Input v-model="formValidate.jarName"></Input>
          </Form-item>
          <Form-item label="需求负责人" prop="principal">
            <Select v-model="formValidate.principal">
              <Option
                v-for="item in princpalList"
                :value="item.pname"
                :key="item.pid"
              >{{ item.pname }}</Option>
            </Select>
          </Form-item>
          <Form-item label="更新环境" prop="upEnv">
            <Select v-model="formValidate.upEnv">
              <Option value="DAT">DAT</Option>
              <Option value="UAT">UAT</Option>
              <Option value="PRE">PRE</Option>
              <Option value="ONL">ONL</Option>
            </Select>
          </Form-item>
          <Form-item label="提交时间" prop="subTime">
            <Row>
              <Col span="11">
                <FormItem prop="date">
                  <DatePicker
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="Select date"
                    v-model="formValidate.date"
                    @on-change="formValidate.date=$event"
                    :value="formValidate.date"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <FormItem prop="time">
                  <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                </FormItem>
              </Col>
            </Row>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="handleSubmitAdd('formValidate')">提交</Button>
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
  getJarMssageData
} from '@/api/JarMssage'
import { GetPrincipalData } from '@/api/Principal'
import axios from 'axios'
import { formatDate } from '@/libs/util'
export default {
  name: 'tables_page',
  // 局部刷新
  inject: ['reload'],
  components: {
    Tables
  },
  data () {
    return {
      dataLast: '',
      model1: '',
      pageSize: 15,
      totalProblemList: [],
      showList: [],
      princpalList: [],
      dataCount: 0,
      modalVisible: false,
      modalVisibleAdd: false,
      columns: [
        {
          title: '需求名称',
          key: 'jarName1',
          editable: true,
          align: 'center'
        },
        { title: '需求负责人', key: 'principal1', align: 'center' },
        { title: '更新环境', key: 'upEnv1', align: 'center' },
        {
          title: '状态',
          key: 'status1',
          align: 'center',
          render: (h, params) => {
            let row = params.row
            let text = ''
            let color = ''
            if (row.status1 === '0') {
              text = '未完成'
              color = 'red'
            } else if (row.status1 === '1') {
              text = '完成'
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

        { title: '提交时间', key: 'subTime1', align: 'center', width: '150px' },
        {
          title: '完成时间',
          key: 'finishTime1',
          align: 'center',
          width: '150px'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '200px',
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
                      this.MakeOver(tableData.index)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '完成'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.updataredJarManger(tableData.index)
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
        jarName: '',
        principal: '',
        upEnv: '',
        subTime: '',
        date: '',
        time: ''
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
    // 打包新增
    InsertJarManger () {
      this.modalVisibleAdd = true
      /** ****获取当前日期开始；后期可以封装成一个方法专门获取当前日期时间******/
      const myDate = new Date()
      const year = myDate.getFullYear() // 获取当前年份
      const month = myDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月所以要加1);
      const day = myDate.getDate() // 获取当前日（1-31）
      this.formValidate.date = `${year}-${month}-${day}`
      /** ****获取当前日期结束******/

      /** ****获取当前时间开始******/
      const Hours = myDate.getHours() // 获取当前年份
      const Minutes = myDate.getMinutes() + 1 // 获取当前月份(0-11,0代表1月所以要加1);
      const Seconds = myDate.getSeconds() // 获取当前日（1-31）
      this.formValidate.time = `${year}-${month}-${day}`
    },
    handleSubmitAdd () {
      this.$refs.formValidate.validate(validate => {
        console.log(validate)
        var formdataAdd = {}

        formdataAdd.jarName = this.formValidate.jarName
        formdataAdd.principal = this.formValidate.principal
        formdataAdd.subTime =
          this.formValidate.date + ' ' + this.formValidate.time
        formdataAdd.upEnv = this.formValidate.upEnv
        console.log(formdataAdd)
        if (validate) {
          InsertJarMangerAPI(formdataAdd).then(res => {
            if (res) {
              this.$Message.success('新增成功！')

              this.GetJarMangerDataUilt()
              this.modalVisibleAdd = false
              this.formValidate.date = ''
              this.formValidate.time = ''
            } else {
              this.$Message.error('新增失败！')
              this.modalVisibleAdd = false
            }
          })
        }
      })
    },
    // 下拉框搜索功能
    hanlePrincpalSelect (value) {
      let Principal = value
      if (value == '全部') {
        this.GetJarMangerDataUilt()
        return false
      }
      GetAllByPrincipal(Principal).then(res => {
        console.log(res)
        if (res.data == '') {
          this.$Message.warning('没有查到相关信息')
        } else {
          this.tableData = res.data
        }
      })
    },
    handleSelectClear () {},
    // 完成功能实现
    MakeOver (index) {
      debugger
      /** ****获取当前日期开始******/
      const myDate = new Date()
      const year = myDate.getFullYear() // 获取当前年份
      const month = myDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月所以要加1);
      const day = myDate.getDate() // 获取当前日（1-31）
      var date1 = `${year}-${month}-${day}`
      /** ****获取当前日期结束******/

      /** ****获取当前时间开始******/
      const Hours = myDate.getHours() // 获取当前年份
      const Minutes = myDate.getMinutes() + 1 // 获取当前月份(0-11,0代表1月所以要加1);
      const Seconds = myDate.getSeconds() // 获取当前日（1-31）
      var time1 = `${Hours}:${Minutes}:${Seconds}`
      /** ****获取当前时间结束******/
      var formdataJBF = {}
      formdataJBF.ID = this.tableData[index].id
      formdataJBF.jarName = this.tableData[index].jarName
      formdataJBF.principal = this.tableData[index].principal
      formdataJBF.subTime = this.tableData[index].subTime
      formdataJBF.finishTime = date1 + ' ' + time1
      formdataJBF.status = '1'
      formdataJBF.upEnv = this.tableData[index].upEnv
      console.log(formdataJBF)
      InsertJBFByIdAPI(formdataJBF).then(res => {
        console.log(res)
        if (res) {
          this.$Message.success(this.tableData[index].jarName + '打包完成！')
          this.GetJarMangerDataUilt()
        } else {
          this.$Message.error(this.tableData[index].jarName + '打包完成失败！')
          this.GetJarMangerDataUilt()
        }
      })
    },
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
    // 重新拿 刷新数据相当于把查询所有的接口封装 便于后面引用
    GetJarMangerDataUilt () {
      getJarMangerData().then(res => {
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
     * 打包信息修改操作
     */
    updataredJarManger (index) {
      GetAllJarByID(this.tableData[index].id).then(res => {
        this.formValidate.jarName = res.data[0].jarName
        this.formValidate.principal = res.data[0].principal
        this.formValidate.upEnv = res.data[0].upEnv
        this.formValidate.subTime = res.data[0].subTime
        this.formValidate.id = this.tableData[index].id
      })
      /** ****获取当前日期开始******/
      const myDate = new Date()
      const year = myDate.getFullYear() // 获取当前年份
      const month = myDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月所以要加1);
      const day = myDate.getDate() // 获取当前日（1-31）
      this.formValidate.date = `${year}-${month}-${day}`
      /** ****获取当前日期结束******/

      /** ****获取当前时间开始******/
      const Hours = myDate.getHours() // 获取当前年份
      const Minutes = myDate.getMinutes() + 1 // 获取当前月份(0-11,0代表1月所以要加1);
      const Seconds = myDate.getSeconds() // 获取当前日（1-31）
      this.formValidate.time = `${Hours}:${Minutes}:${Seconds}`
      /** ****获取当前时间结束******/
      this.modalVisible = true
    },
    handleSubmit () {
      this.$refs.formValidate.validate(validate => {
        debugger
        console.log(validate)
        var formdata = {}

        formdata.jarName = this.formValidate.jarName
        formdata.principal = this.formValidate.principal
        formdata.subTime =
          this.formValidate.date + ' ' + this.formValidate.time
        formdata.upEnv = this.formValidate.upEnv
        formdata.id = this.formValidate.id
        console.log(formdata)
        if (validate) {
          updataredJarMangerAPI(formdata).then(res => {
            this.$Message.success('修改成功！')
            this.GetJarMangerDataUilt()
            this.modalVisible = false
            this.formValidate.date = ''
          })
        } else {
          this.$message.error('修改失败！！')
        }
      })
    },
    // speckText(str) {
    //   debugger
    //   var str = "有新需求要打包";
    //   var url =
    //     "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=" +
    //     encodeURI(str);
    //   console.log(url)
    //   var n = new Audio(url);
    //   n.src = url;
    //   if (this.tip) {
    //     n.play(); // $("...").play(); // var sound = new Sound(request); // sound.play();
    //   } else {
    //     n.pause();
    //   }
    // },
    aplayAudio () {
      var promise = document.querySelector('audio').play()
      if (promise !== undefined) {
        promise
          .then(_ => {
            console.log('播放成功！')
          })
          .catch(error => {
            console.log('播放失败！')
          })
      }
      const audio = document.getElementById('audio')
      audio.play()
    }
  },
  mounted () {
    getJarMssageData().then(res => {
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

    GetPrincipalData().then(res => {})
  },
  // 请求钩子
  created () {
    getJarMssageData().then(res => {
      this.dataLast = res.data.length
      this.tableData = res.data
    })
    GetPrincipalData().then(res => {
      this.princpalList = res.data
    })
  },
  watch: {
    tableData: {
      handler (a, b) {
        this.tableData = a
        this.aplayAudio()
        console.log(a.length, b)
      },
      deep: true
    }
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
s