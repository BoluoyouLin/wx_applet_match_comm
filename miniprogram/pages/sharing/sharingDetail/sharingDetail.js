// pages/sharing/sharingDetail/sharingDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarurl:"../../../assets/images/background.png",
    imageurls:[
      "../../../assets/img/book2.jpg",
      "../../../assets/img/book5.jpg",
      "../../../assets/img/book7.jpg",
      "../../../assets/img/book8.jpg",
    ],
    cardId:null,//卡片od
    userDetail:null,//用户信息
    cardDetail:null//
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    let that=this
    console.log("进来了",options.id)
    wx.showLoading({
      title:"疯狂加载中"
    })

    //获取card信息
    db.collection("card").where({
      _id:options.id
    }).get().then(res=>{

      let cardDetail=res.data[0]
      console.log(cardDetail)

      //设置用户信息
      if(app.globalData.userDetail!=null){
        console.log(res)
        console.log("1")
        console.log(app.globalData.userDetail)
        //直接赋值
        that.setData({
          userDetail:app.globalData.userDetail,
          cardDetail:cardDetail,
          cardId:options.id,
          avatarurl:app.globalData.userDetail.avatar,
          imageurls:cardDetail.images
        })
        wx.hideLoading()
      }
      else if(app.globalData.weId!=null){
        console.log("2")
        //获取用户信息

        db.collection("user").where({
          user_id:app.globalData.weId.openid
        }).get().then(res=>{

          let userDetail=res.data

          console.log("====>",userDetail)
          console.log("====>",cardDetail)

          that.setData({
            userDetail:userDetail,
            cardDetail:cardDetail,
            cardId:options.id,
            avatarurl:userDetail.avatar,
            imageurls:cardDetail.images
          })
          wx.hideLoading()
        }).catch(err=>{
          console.error(err)
        })

      }else{
        console.log("3")
        //请求openid
        //请求用户信息
        wx.cloud.callFunction({
          name: 'login'
        }).then(res => {
          let weId = res.result
          

          db.collection("user").where({
            user_id:weId.openid
          }).get().then(res=>{
           
    
              let userDetail=res.data
              
              console.log("====>",userDetail)
              console.log("====>",cardDetail)
    
              that.setData({
                userDetail:userDetail,
                cardDetail:cardDetail,
                cardId:options.id,
                avatarurl:userDetail.avatar,
                imageurls:cardDetail.images
              })
              wx.hideLoading()
            
            
          }).catch(err=>{
            console.error(err)
          })
    
        }).catch(err => {
          console.log(err)
        })
      }

      
    }).catch(err=>{
      console.error(err)
    })
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})