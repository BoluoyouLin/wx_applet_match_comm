// miniprogram/pages/square.js
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar:{},
    dataList:[],
    cardList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  getSquareData(){
    let result = this.getCardData()
    result.then( res=>{
      console.log(res,'11')
    })
    // console.log('getData',result)
  },

  // 获取card数据
  async getCardData(){
    return await db.collection('card').where({
      is_shared:1
    }).get()
  },

  // 根据cardId获取对应图片
  getImageByCard(cardId){
    db.collection('picture').where({
      card_id: cardId
    }).get()
    .then( res => {
      return res.data[0]
    })
    .catch( err => {
      console.err()
      return null;
    })
  },

  // 根据userId获取用户信息
  getUserInfo(userId){
    db.collection('user').where({
      user_id: userId
    }).get()
    .then( res => {
      return res
    })
    .catch( err => {
      console.error(err,'err by getUserInfo')
      return null;
    })
  },
})