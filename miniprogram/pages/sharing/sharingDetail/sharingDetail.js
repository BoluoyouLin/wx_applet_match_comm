// pages/sharing/sharingDetail/sharingDetail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarurl: "../../../assets/img/book2.jpg",
    imageurls: [],
    cardId: undefined, //卡片od
    userDetail: undefined, //用户信息
    cardDetail: undefined, //
    analyze_result:null//分析结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    
    wx.showLoading({
      title: "疯狂加载中"
    })

    //获取card信息
    db.collection("card").where({
      _id: options.id
    }).get().then(res => {

     
      let cardDetail =null

      console.log("--->cardDetail",res.data[0])
      
      //设置用户信息
      if (app.globalData.userDetail != null) {
        cardDetail= this.packSquareData(res.data[0], app.globalData.userDetail.user_id)
        console.log("--->cardDetail：res",cardDetail)
        //直接赋值
        that.setData({
          userDetail: app.globalData.userDetail,
          cardDetail: cardDetail,
          cardId: options.id,
          avatarurl: cardDetail.user_image,
          imageurls: cardDetail.images,
          analyzeResult:cardDetail.analyzeResult
        })
        wx.hideLoading()
      } else if (app.globalData.weId != null) {
        console.log("2")
        //获取用户信息
        cardDetail= this.packSquareData(res.data[0], app.globalData.weId)
        console.log("--->cardDetail：res",cardDetail)
        db.collection("user").where({
          user_id: app.globalData.weId.openid
        }).get().then(res => {

          let userDetail = res.data

          console.log("====>", userDetail)
          console.log("====>", cardDetail)

          that.setData({
            userDetail: userDetail,
            cardDetail: cardDetail,
            cardId: options.id,
            avatarurl: cardDetail.user_image,
            imageurls: cardDetail.images,
            analyzeResult:cardDetail.analyzeResult
          })
          wx.hideLoading()
        }).catch(err => {
          console.error(err)
        })

      } else {
        console.log("3")
        //请求openid
        //请求用户信息
        wx.cloud.callFunction({
          name: 'login'
        }).then(res => {
          let weId = res.result

          cardDetail= this.packSquareData(res.data[0], weId.openid)
          console.log("--->cardDetail：res",cardDetail)
          db.collection("user").where({
            user_id: weId.openid
          }).get().then(res => {  


            let userDetail = res.data

            console.log("====>", userDetail)
            console.log("====>", cardDetail)

            that.setData({
              userDetail: userDetail,
              cardDetail: cardDetail,
              cardId: options.id,
              avatarurl: cardDetail.user_image,
              imageurls: cardDetail.images,
              analyzeResult:cardDetail.analyzeResult
            })
            wx.hideLoading()


          }).catch(err => {
            console.error(err)
          })

        }).catch(err => {
          console.log(err)
        })
      }


    }).catch(err => {
      console.error(err)
    })


  },

  // 包装广场显示数据
  packSquareData(card, openId) {
    let temp = {
      id: card._id,
      user_id: card.user_id,
      content: card.content,
      like: card.like.length,
      likeList: card.like,
      is_shared: card.is_shared,
      images: card.images,
      user_name: card.user_name,
      user_image: card.user_image === undefined ? '../../assets/icons/bottom.png' : card.user_image,
      is_like: card.like.indexOf(openId) === -1 ? 0 : 1,
      create_at: card.create_at.toLocaleDateString(),
      publish_at: card.publish_at.toLocaleDateString(),
      analyzeResult:card.analyze_result
    }
    return temp;
  },

  // 点赞和取消点赞
  // 0是未点赞 1是点赞
  clickLike() {
    console.log('dianji')
    let cardDetail = this.data.cardDetail
    if (cardDetail.is_like === 1) {
      cardDetail.is_like = 0;
      if (cardDetail.like > 0) {
        cardDetail.like--;
      }
      let likeIndex = cardDetail.likeList.indexOf(app.globalData.userDetail.user_id);
      cardDetail.likeList.splice(likeIndex, 1)
      this.updateLikeByCard(cardDetail)
    } else {
      cardDetail.is_like = 1;
      cardDetail.like++;
      cardDetail.likeList.push(app.globalData.weId.openid);
      this.updateLikeByCard(cardDetail)
    }
    this.setData({
      cardDetail: cardDetail
    })
  },

  // 更新点赞数据到云数据库
  updateLikeByCard(card) {
    wx.cloud.callFunction({
      name: 'updateLikeByCard',
      data: {
        card: card
      }
    }).then(res => {}).catch(err => {
      console.error('fail', err)
    })
  },

  //图片预览
  previewImage(e) {

    const current = e.target.dataset.src
    wx.previewImage({
      current,
      urls: this.data.imageurls
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})