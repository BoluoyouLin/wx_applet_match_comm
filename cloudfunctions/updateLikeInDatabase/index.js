// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  let tempCards = event.tempCards;
  for (let i = 0; i < tempCards.length; i++) {
    return await db.collection('card').where({
        _id: tempCards[i].id
      })
      .update({
        like: tempCards.likeList
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log('shibai')
        console.error(err)
      })
  }
}