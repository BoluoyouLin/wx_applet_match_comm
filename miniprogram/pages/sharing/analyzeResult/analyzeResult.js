// pages/sharing/analyzeResult/analyzeResult.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]
let flag_analyzed = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comp_num: 0, //总成分数

    //以下都是 9张图 相关
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],
    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },

  sourceTypeChange(e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange(e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange(e) {
    this.setData({
      countIndex: e.detail.value
    })
  },

  chooseImage() {
    const that = this;

    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: res => {
        that.setData({
          imageList: res.tempFilePaths
        })
        // 仅第一张图分析, 一次性选择多张图不分析
        if (!flag_analyzed && that.data.imageList.length <= 1) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            //console.log(res.data);
            wx.cloud.callFunction({
              name: 'get_tokens',
              data: {
                imgbase64: res.data //调用识别API, base64不需要头部（默认就没有）
              }
            }).then(
              (tokens) => {
                // show (tokens)
                console.log(tokens.result);
                this.setData({
                  text: JSON.stringify(tokens.result) //方便真机调试，显示在界面上
                })
              })
            }
          })
          flag_analyzed = 1;
        }  //仅第一张图分析

        }
      })
   },

  previewImage(e) {
    const current = e.target.dataset.src
    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    flag_analyzed = 0;

    //不知道怎么直接调用 chooseImage(), 先复制 chooseImage()的代码了
    const that = this;

    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: res => {
        that.setData({
          imageList: res.tempFilePaths
        })

        // 仅第一张图分析, 一次性选择多张图不分析
        if (!flag_analyzed && that.data.imageList.length <= 1) {
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0], //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              //console.log(res.data);
              wx.cloud.callFunction({
                name: 'get_tokens',
                data: {
                  imgbase64: res.data  //调用识别API, base64不需要头部（默认就没有）
                }
              }).then(
                (tokens) => {
                  console.log(tokens.result);
                  this.setData({
                    text: JSON.stringify(tokens.result) //方便真机调试，显示在界面上
                  })
                })
            }
          })
          flag_analyzed = 1;
        }  //仅第一张图分析
      }
    })
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