import axios from '@/libs/api.request'
// 查询所有红酒信息数据
export const getsensonrTableData = () => {
    return axios.request({
      url: 'http://localhost:8080/findAllSensonr',
      method: 'get'
    })
  }
  //根据Num查询 修改时用
  export const GetfindSensonrByNum = (sensonrnum) => {
    return axios.request({
      url: 'http://localhost:8080/findSensonrByNum',
      method: 'get',
      params:{
        sensonrnum:sensonrnum
        
      }
    })
  }
  //搜索功能
  export const GetfindSensonrByNumSousuo = (formdata) => {
    return axios.request({
      url: 'http://localhost:8080/findSensonrByNum',
      method: 'get',
      params:{
        sensonrnum:formdata.sensonrnum
        
      }
    })
  }
  // 删除功能
  export const DelSensonrByNum = (sensonrnum) =>{
    return axios.request({
      url: 'http://localhost:8080/deletSensonrByNum',  
      method: 'get',
      params: {
        sensonrnum:sensonrnum
      }    
    })
  }
  // 修改功能
  export const updateSensonr = (formdata) =>{
    return axios.request({
      url: 'http://localhost:8080/updateSensonrByNum',  
      method: 'get',
      params: {
        sensorname:formdata.sensorname,
        state:formdata.state,
        com:formdata.com,
        sensonrnum:formdata.sensonrnum
      }    
    })
  }
  //updateSensonrByNum