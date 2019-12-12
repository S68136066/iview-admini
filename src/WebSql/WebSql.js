import Vue from 'vue'

const WebSql = function () {
  if (window.openDatabase) {
    var db = openDatabase('TEST', '1.0', 'lixx', 200 * 1024 * 1024)

    Vue.prototype.$db = db

    if (!db) {
      console.log('数据库创建失败！')
    } else {
      console.log('数据库创建成功！')
    }
  } else {
    console.log('不支持本地储存！')
  }
}
export default WebSql
