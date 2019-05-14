// miniprogram/pages/square.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar:{},
    dataList:[
      {
        image: '../../assets/images/demo2.jpg',
        desc: '天了噜，这什么神仙颜值！！！眼睛闪瞎了！',
        userName: '菠萝油',
        userImage: '../../assets/images/demo3.jpg',
        contentNumber: 1300
      },
      {
        image: '../../assets/images/demo1.jpg',
        desc: '天了噜，这什么神仙颜值！！！眼睛闪瞎了！',
        userName: '菠萝油',
        userImage: '../../assets/images/demo1.jpg',
        contentNumber: 1300
      },
      {
        image: '../../assets/images/demo3.jpg',
        desc: '天了噜，这什么神仙颜值！！！眼睛闪瞎了！',
        userName: '菠萝油',
        userImage: '../../assets/images/demo2.jpg',
        contentNumber: 1300
      },
      {
        image: '../../assets/images/demo2.jpg',
        desc: '天了噜，这什么神仙颜值！！！眼睛闪瞎了！',
        userName: '菠萝油',
        userImage: '../../assets/images/demo3.jpg',
        contentNumber: 1300
      },
      {
        image: '../../assets/images/demo3.jpg',
        desc: '天了噜，这什么神仙颜值！！！眼睛闪瞎了！',
        userName: '菠萝油',
        userImage: '../../assets/images/demo2.jpg',
        contentNumber: 1300
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.loadData();
    app.editTabbar();

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
    console.log(app.globalData)
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

  },

  // 展示菜单
  showMenu(){
    app.showMenu();
  },

  // 获取card数据
  loadData: function() {
    db.collection('card').where({
      is_shared:1
    }).get()
    .then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  },

  // 根据cardid获取对应图片
  getImageByCard: function(cardId) {
    db.collection('picture').where({
      card_id:cardId
    }).get()
    .then(res => {
      console.log(res)
    }).catch( err => {
      console.error(err)
    })
  },

  //根据userid获取用户昵称和头像
  getUserInfo: function(userId) {
    db.collection('user').where({
      user_id:userId
    }).get()
    .then( res => {
      console.log(res)
    }).catch( err => {
      console.error(err)
    })
  },

// 添加数据（我自己测试用的）by 林炜
  addData: function() {
    db.collection('card').add({
      data: {
        user_id:1,
        content:'林炜',
        like:0,
        is_shared:1
      }
    }).then(res => {
      console.log(res)
    })
    .catch(res => {
      console.log(res)
    })
  },
})