// miniprogram/pages/square.js
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    dataList: [],
    cardList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData)
    // 获取广场数据
    this.getSquareData()
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
  onReady: function() {
    console.log(app.globalData)
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

  },

  // 展示菜单
  showMenu() {
    app.showMenu();
  },

  //  获取广场展示数据
  async getSquareData() {
    let cardList = [] // 用于存储卡片数据
      ,
      userInfoList = [] // 用于存储用户信息
      ,
      cardImageList = [] // 用于存储卡片图片
      ,
      item // 存储临时数据

    // 获取卡片数据
    cardList = await this.getCardData()
    for (let i = 0; i < cardList.length; i++) {
      // 根据userId获取用户信息
      item = await this.getUserInfo(cardList[i].user_id)
      userInfoList.push(item)
      // 根据cardId获取相应图片
      item = await this.getImageByCard(cardList[i]._id)
      cardImageList.push(item)
    }
    this.displaySquareData(cardList, userInfoList, cardImageList)
  },

  // 生成页面所需要的数据对象
  displaySquareData(cardList, userInfoList, cardImageList) {
    let results = [],
      errorImage = "../../assets/images/demo.jpg",
      that = this

    for (let i = 0; i < cardList.length; i++) {
      results.push({
        userImage: cardImageList[i] === undefined ? errorImage : cardImageList[i],
        userName: userInfoList[i].name,
        content: cardList[i].content,
        like: cardList[i].like,
        image: cardImageList[i] === undefined ? errorImage : cardImageList[i]
      })
    }

    that.setData({
      dataList: results
    })
  },

  // 获取card数据
  getCardData() {
    return new Promise((resolve, reject) => {
      db.collection('card').where({
          is_shared: 1
        }).get()
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          console.error(err)
        })
    })
  },

  // 根据cardId获取对应图片
  getImageByCard(cardId) {
    return new Promise((resolve, reject) => {
      db.collection('picture').where({
          card_id: cardId
        }).get()
        .then(res => {
          resolve(res.data[0])
        })
        .catch(err => {
          console.error(err)
        })
    })
  },

  // 根据userId获取用户信息
  getUserInfo(userId) {
    return new Promise((resolve, reject) => {
      db.collection('user').where({
          user_id: userId
        }).get()
        .then(res => {
          resolve(res.data[0])
        })
        .catch(err => {
          console.error(err)
        })
    })
  },
})