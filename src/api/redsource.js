import axios from '@/libs/api.request'
// 查询所有红酒信息数据
export const getreesourceTableData = () => {
  return axios.request({
    url: 'http://localhost:8080/findAllRedSource',
    method: 'get'
  })
}
// 根据RedID查询红酒信息
export const getredsourceByRedID = (redID) => {
  return axios.request({
    url: 'http://localhost:8080/findredSourceByRedid',
    method: 'get',
    params: {
      redID: redID
    }
  })
}
// 修改红酒信息功能
export const updateRedSource = (formdata) => {
  return axios.request({
    url: 'http://localhost:8080/updataRedSource',
    method: 'get',
    params: {
      redname: formdata.redname,
      sourcearea: formdata.sourcearea,
      sourceyear: formdata.sourceyear,
      sourcecompany: formdata.sourcecompany,
      redID: formdata.redID
    }
  })
}
// 删除功能
export const daletRedSourceByRedID = (redID) => {
  return axios.request({
    url: 'http://localhost:8080/deletRedSourByRedID',
    method: 'get',
    params: {
      redID: redID
    }
  })
}
// 搜索功能
export const findredSourceByRedname = (formdata) => {
  return axios.request({
    url: 'http://localhost:8080/findredSourceByRedname',
    method: 'get',
    params: {
      redname: formdata.redname
    }
  })
}
// getTableMessages
