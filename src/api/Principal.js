import axios from '@/libs/api.request'
// 查询所有需求负责人
export const GetPrincipalData = () => {
  return axios.request({
    url: 'http://localhost:8080/findAllPrincipal',
    method: 'get'
  })
}
