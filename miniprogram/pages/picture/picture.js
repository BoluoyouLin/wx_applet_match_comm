// pages/picture/picture.js
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    imageBase64: '',
    device: 'back',
  },

  // 打开相册
  openAlbum() {
    let that = this,
      url = ''
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res) {
        url = res.tempFilePaths[0]
        app.imageToBase64(res.tempFilePaths[0]).then(res => {
          that.setData({
            src: url,
            imageBase64: res
          })
        })
      }
    })
  },


  /**
   * 拍照
   */
  takePhoto() {
    let that = this,
      url = '';
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        url = res.tempImagePath
        app.imageToBase64(res.tempImagePath).then(res => {
          that.setData({
            src: url,
            imageBase64: res
          })
        })
        wx.redirectTo({
          url: '../analyse/analyse',
        })
      },
      error: (err) => {
        console.error(err)
      }
    })
  },

  changeCamera() {
    let that = this;
    if (that.data.device === 'back') {
      that.setData({
        device: 'front'
      })
    } else {
      that.setData({
        device: 'back'
      })
    }
  },

  error(e) {
    console.log(e.detail)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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