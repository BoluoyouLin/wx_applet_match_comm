// pages/userinfo/changeResume/changeResume.js
import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume: '',
    userId: '',
    userInput: ''
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

  async getResume() {
    let that = this,
      userId = await that.getOpenId(),
      nickName = '';

    that.setData({
      userId: userId
    });
    db.collection('user').where({
        user_id: userId
      }).get()
      .then(res => {
        that.setData({
          resume: res.data[0].resume
        })
      })
  },

  getUserInput(e) {
    this.setData({
      userInput: e.detail.value
    })
  },

  // 修改个人简介
  changeResume() {
    let that = this
    wx.cloud.callFunction({
      name: 'changeResume',
      data: {
        userId: that.data.userId,
        resume: that.data.userInput
      }
    }).then(res => {
      that.getResume()
      that.showTip('success')
    }).catch(err => {
      console.error(err)
      that.showTip('fail')
    })
  },

  showTip(type) {
    if (type === 'success') {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '修改失败',
        image: '../../../assets/icons/fail.png',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getResume()
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