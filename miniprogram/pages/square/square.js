// miniprogram/pages/square.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    ],
    tabbar: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({tabbar: app.globalData.tabbar})
    let temp1 = "tabbar.list[0].current"
    let temp2 = "tabbar.list[2].current"
    that.setData({ [temp1]: 1, [temp2]: 0 })
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

  },

  /**
   * 显示操作菜单
   */
  showMenu(){
    app.showMenu();
  },

  /**
   * 跳转界面（仅限tabbar）
   */
  toPageByTabbar(e){
    app.toPageByTabbar(e);
  }
})