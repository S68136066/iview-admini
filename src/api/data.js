import axios from '@/libs/api.request'
// 查询所有历史信息数据
export const getTableData = () => {
  return axios.request({
    url: 'http://localhost:8080/findAllredWine',
    method: 'get'
  })
}
// 删除数据
export const getdelRedHis = (rednum) => {
  return axios.request({
    url: 'http://localhost:8080/deletRedHis',
    method: 'get',
    params: {
      rednum: rednum
    }
  })
}
// 根据Rednum查询
export const getRedHisByRednum = (rednum) => {
  return axios.request({
    url: 'http://localhost:8080/findRedHisByRednum',
    method: 'get',
    params: {
      rednum: rednum
    }
  })
}
// getfindredHisByRedname
export const getfindredHisByRedname = (formdata) => {
  return axios.request({
    url: 'http://localhost:8080/findRedHisByRedname',
    method: 'get',
    params: {
      redname: formdata.redname
    }
  })
}
// 修改红酒温湿度历史信息
export const updateRedHis = (formdata) => {
  return axios.request({
    url: 'http://localhost:8080/updateRedHistroyByRednumss',
    method: 'get',
    params: {
      redname: formdata.redname,
      wendu: formdata.wendu,
      shidu: formdata.shidu,
      totime: formdata.totime,
      sensonrnum: formdata.sensonrnum,
      rednum: formdata.rednum
    }
  })
}
//
export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
