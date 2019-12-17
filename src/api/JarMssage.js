import axios from '@/libs/api.request'
//打包历史记录查询API
export const getJarMssageData = () => {
    return axios.request({
      url: 'http://localhost:8080/FindAllJarMassage',
      method: 'get'
    })
  }