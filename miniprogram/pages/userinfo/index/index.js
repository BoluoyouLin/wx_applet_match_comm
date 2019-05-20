//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    // avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,//是否登陆
    takeSession: false,
    requestResult: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl:'./user-unlogin.png',
    isShard:false,
    isUnshard: false,
    userDetail:null,//用户表

  },

  onLoad: function() {
    //有可能进来是空的
    console.log("---> userinfor/index-onload ")
    app.editTabbar();
    
   
    //获取全局用户登陆信息
    // 获取全局的
    if (app.globalData.userInfo!=null) {
      console.log("1")
      this.setData({
        userInfo: app.globalData.userInfo,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        logged: true
      })
      // this.getUserDt()
    } 
    //全局没登陆就重新调用用户登陆方法
    else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      console.log("2")
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          logged: true
        })
        this.dataInit()//初始化数据
        
      }
    } else {
      console.log("3")
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            logged: true
          })
          // this.getUserDt()
        }
      })
    }

  },


  dataInit:function(){
    // this.getUserDt()
    //要等全局的
  },
  


  onGetUserInfo: function(e) {
    // console.log("进来了",e)
    // console.log(this.data.logged,this.data.canIUse)
    console.log("手动登陆")
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        logged: true,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })

      app.getIdColl()
      app.suerInUserColl()
      app.getUserDt()
      this.getUserDt()
      console.log(">>>>>>>>>>",app.globalData)
      // console.log(this.data.userInfo)
    }else{
      console.log("用户信息获取失败")
    }
    // this.getUserDt()
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  //展开已分享
  unfoldShard:function(){
    this.setData({
      isShard: false
    })
    //并获取数据
  },

  //展开未分享
  unfoldUnshard:function(){
    this.setData({
      isUnshard:false
    })
    //并获取数据
  },

  //合上已分享
  foldShard:function(){
    this.setData({
      isShard: true
    })
  },
  //合上为分享
  foldUnshard:function(){
    this.setData({
      isUnshard: true
    })
  },

  //跳转
  tureTo:function(){
    wx.redirectTo({
      url: '../userinforEdit/userinforEdit',
    })
  },

  //获取
  getUserDt: function () {
    console.log("进来了 -index- getUserDetail")

    while(true){
      if (app.globalData.weId.openid != null) {
        
        db.collection("user").where({
          user_id: app.globalData.weId.openid
        }).get().then(res => {
          console.log(res)
          this.setData({
            userDetail:res.data[0]
          })
        }).catch(err => {
          console.log(err)
        })
        break;
      }
    }
  },




  // onLoad(options) {
  //   console.log("--->onLoad")
  // },
  // onReady() {
  //   // Do something when page ready.
  //   console.log("onReady")
  // },
  // onShow() {
  //   // Do something when page show.
  //   console.log("--->onShow")
  // },
  // onHide() {
  //   // Do something when page hide.
  //   console.log("--->onHide")
  // },
  // onUnload() {
  //   // Do something when page close.
  //   console.log("--->onUnload")
  // },
  // onPullDownRefresh() {
  //   // Do something when pull down.
  //   console.log("--->onPullDownRefresh")
  // },
  // onReachBottom() {
  //   // Do something when page reach bottom.
  //   console.log("--->")
  // },
  // onShareAppMessage() {
  //   // return custom share data when user share.
  //   console.log("--->")
  // },
  // onPageScroll() {
  //   // Do something when page scroll
  //   console.log("--->")
  // },
  // onResize() {
  //   // Do something when page resize
  //   console.log("--->")
  // }
 

})
