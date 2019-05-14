wx.cloud.init()
const db = wx.cloud.database()
export default{
  service:{
    async getUserByOpenid(openId){
      console.log('openid',openId)
      try{
          await db.collection("user")
          .where({
            user_id: openId
          })
          .get().then(res => {
            console.log("user", res)
            return res
          })
          .catch(err => {
            console.error(err)
            return null
          })
      }
      catch(e){
        console.error(e)
      }
      
    },

    insertNewUser(userinfor){
      db.collection('user').add({
        data:userinfor
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.error(err)
      })
    }
  }
}