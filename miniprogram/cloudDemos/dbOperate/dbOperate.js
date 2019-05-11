// cloudDemos/dbOperate/dbOperate.js

const testDB = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  // //插入数据
  insertData: function () {
    console.log("进来了")
    testDB.collection("test").add({
      data:{
        id:1,
        name:"chenjy1"
      }
    }).then(res=>{
      console.log("成功", res)
    }).catch(err=>{
      console.log(err)
    })
  },

  updateData :function(){
    testDB.collection('test')
    .doc('988c1b1b5cd692a70ffabff5309ad67b')
    .update({
      data:{
        name:'chenjy3'
      }
    })
    .then(res=>{
      console.log("成功",res)
    })
    .catch(err=>{
      console.log(err)
    })
  },

  searchData:function(){
    testDB.collection("test")
    .where({
      name:'chenjy3'
    }).get()
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
  },

  deleteData:function(){
    testDB.collection('test')
    .doc('988c1b1b5cd693050ffafe2c1c9b59cf')
    .remove()
    .then(res=>{
       console.log(res)
    })
    .catch(err=>{
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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