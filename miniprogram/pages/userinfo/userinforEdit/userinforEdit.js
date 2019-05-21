// pages/userinfo/userinforEdit/userinforEdit.js
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundImage: '',
    backgroundImageBase64: '',
    avatar: '',
    avatarBase64: '',
    nickName: '',
    resume: '',
    label: '',
    userId: ''
  },

  // 获取OpenID
  getOpenId() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
      }).then(res => {
        resolve(res.result.openid)

      }).catch(err => {
        console.error('fail', err)
      })
    })
  },

  // 获取页面数据
  async getPageData() {
    let that = this,
      userId = await that.getOpenId();

    db.collection('user').where({
        user_id: userId
      }).get()
      .then(res => {
        that.setData({
          userId: userId,
          nickName: res.data[0].name,
          resume: res.data[0].resume,
          label: res.data[0].label,
        })
      })

  },

  //  选择图片来源
  choosePictrue(options) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          resolve(res.tempFilePaths)
        },
        fail: function(res) {
          console.error(res)
        }
      })
    })
  },

  // 改变背景图片
  async changeBackgroundImage() {
    let that = this
    let path = await that.choosePictrue()
    app.imageToBase64(path[0]).then(res => {
      that.setData({
        backgroundImage: path[0],
        backgroundImageBase64: res
      })
    })
  },

  // 改变头像
  async changeAvatar() {
    let that = this
    let path = await that.choosePictrue()
    app.imageToBase64(path[0]).then(res => {
      that.setData({
        avatar: path[0],
        avatarBase64: res
      })
    })
  },

  // 打开修改昵称界面
  goChangeNickname() {
    wx.navigateTo({
      url: '../changeNickname/changeNickname',
    })
  },

  // 打开修改个人简介界面 
  goChangeResume() {
    wx.navigateTo({
      url: '../changeResume/changeResume',
    })
  },

  // 打开修改标签界面
  goChangeLabel() {
    wx.navigateTo({
      url: '../changeLabel/changeLabel',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.navigateTo()
    this.getPageData();
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
    this.getPageData()
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