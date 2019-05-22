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
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片     
        that.setData({ src: res.tempFilePaths})
      }
    })
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
    console.log("===> takePhoto")
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
          console.log("开始跳转")
          wx.navigateTo({
            url: '../analyze/analyze?bs64='+res
          })
          // wx.redirectTo({
          //   url: 'pages/analyze/analyze?bs64='+res
          // })
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