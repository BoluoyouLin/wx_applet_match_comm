// pages/picture/picture.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    device: 'back',
  },


  /**
   * 拍照
   */
  takePhoto() {
    let that = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res.tempImagePath, 'picture.js')
        that.setData({
          src: res.tempImagePath
        });
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