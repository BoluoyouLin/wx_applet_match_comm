// pages/analyse/analyse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 0,
    activeColor: '#000000',
    desc: '正在分析中，不要着急哦～～',
    animationData: ''
  },

 /**
  * 加载结束时改变进度条颜色
  */
  changeColor() {
    let that = this;
    that.setData({ activeColor: '#00baad',desc: '分析成功'})
  },
  
  /**
   * 加载描述动画
   */
  descAnimationLoad() {
    let that = this;
    let animation = wx.createAnimation({
      duration: 3000,
      timingFunction: "ease"
    })
    animation.translateX(80).step();
    that.setData({ animationData: animation.export()})
    console.log(that.data.animationData)
  },

  /**
   * 加载完成动画
   */
  descAnimationFinish() {
    let that = this;
    let animation = wx.createAnimation({
      duration: 10,
      timingFunction: "ease"
    })
    animation.translateX(0).step();
    that.setData({ animationData: animation.export()})
    console.log(that.data.animationData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timer, that = this;
    timer = () => {
      setTimeout(() => {
        const val = that.data.value;
        if(val === 70) {
          that.descAnimationLoad();
        }
        if(val !== 100) {
          that.setData({ value: val + 1 });
          timer();
        }
        else {
          that.changeColor();
          that.descAnimationFinish();
        }
      }, 50);
    }
    timer();
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