import axios from '@/libs/api.request'
// 查询所有打包信息
export const getJarMangerData = () => {
    return axios.request({
        url: 'http://localhost:8080/findAllJarManger',
        method: 'get'
    })
}
//根据需求负责人查询
export const GetAllByPrincipal = (Principal) => {
    return axios.request({
        url: 'http://localhost:8080/findAllByPrincipal',
        method: 'get',
        params: {
         Principal: Principal
        }
    })
}
//根据ID查询打包信息用于修改
export const GetAllJarByID = (ID) => {
    return axios.request({
        url: 'http://localhost:8080/findJarMangerById',
        method: 'get',
        params: {
         ID:ID
        }
    })
}
//打包信息修改功能
// 修改功能
export const updataredJarMangerAPI = (formdata) =>{
    return axios.request({
      url: 'http://localhost:8080/UpdateJarMangerById',  
      method: 'get',
      params: {
        JarName:formdata.jarName,
        Principal:formdata.principal,
        SubTime:formdata.subTime,
        UpEnv:formdata.upEnv,
        ID : formdata.id
      }    
    })
  }
  //InsertJBFById 完成功能接口
  export const InsertJBFByIdAPI = (formdataJBF) =>{
    return axios.request({
      url: 'http://localhost:8080/InsertJBFById',  
      method: 'get',
      params: {
        JarName1:formdataJBF.jarName,
        Principal1:formdataJBF.principal,
        SubTime1:formdataJBF.subTime,
        UpEnv1:formdataJBF.upEnv,
        FinishTime1:formdataJBF.finishTime,
        Status1:formdataJBF.status ,
        ID : formdataJBF.ID
      }    
    })
  }
  //AddJarMangerApi
  export const InsertJarMangerAPI = (formdataAdd) =>{
    return axios.request({
      url: 'http://localhost:8080/AddJarMangerApi',  
      method: 'get',
      params: {
        JarName:formdataAdd.jarName,
        Principal:formdataAdd.principal,
        SubTime:formdataAdd.subTime,
        UpEnv:formdataAdd.upEnv,      
      }    
    })
  }
