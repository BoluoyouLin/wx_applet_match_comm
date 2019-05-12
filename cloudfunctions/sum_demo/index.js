// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }

/**
 * event 小程序端传过来得参数{}json对象
 * context 上下文，
 * 返回得也是对象
 */
exports.main = async (event, context) => {
  return {
    sum:event.a+event.b
  }
}