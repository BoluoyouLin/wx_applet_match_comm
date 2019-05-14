// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = wx.cloud.database()

// 云函数入口函数
//对数据库的批量操作
//是异步操作所以不知道是什么时候操作完，所以要等待 
exports.main = async (event, context) => {
  try{
    return await db.collection("test").where({
      name:'chenjy1'
    }).remove()
  }catch(e){
    console.error(e)
  }


}