
// import user_service from './assets/services/user_service.js'
wx.cloud.init()
const db = wx.cloud.database()
//app.js
App({

  // ...user_service.service, //解构

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    //隐藏系统tabbar
    wx.hideTabBar();

    //获取设备信息
    this.getSystemInfo();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    }) 
    //先登陆再获取用户信息，openid，等，不然会有弹出框

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail:err=>{
              cosnole.log(err)
            }
          })
        }
      }
    })

    
    this.getIdColl()
    // this.suerInUserColl()
    
  },

  // ------------------------
  /**
   * 页面路径
   */
  pagePath: function(index) {
    switch (index) {
      case 0: return '../picture/picture'; break;
      case 1: return '../sharing/analyzeResult/analyzeResult'; break;
    }
  },
  /**
   * 跳转界面
   */
  navigateToPage: function(index) {
    let that = this;
    let path = that.pagePath(index);
    wx.navigateTo({
      url: path,
      success(res) {
      },
      fail(res) {
        console.log("fail")
      }
    })
  },

  /**
   * 显示操作菜单
   */
  showMenu: function() {
    let that = this;
    wx.showActionSheet({
      itemList: ['拍照分析', '分享'],
      itemColor: '#00baad',
      success(res) {
        that.navigateToPage(res.tapIndex)
      },
      fail(res) {
        console.log('取消')
      }
    })
  },
  
  //获取id集合
  getIdColl:function(){
    //获取id集合
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      this.globalData.weId = res.result
      console.log(res.result)
      this.suerInUserColl()
    }).catch(err => {
      console.log(err)
    })
  },

  //判断当前用1 tg户是否已经在user集合中
  //不再即添加
  suerInUserColl(){
    
    
    //已经获取到了当前用户得用户信息
    console.log("这里", this.globalData.weId)
    if (this.globalData.userInfo) {
      // let box=

      // db.collection("user").where({
      //   user_id: this.globalData.weId.openid
      // }).get().then(res => {
      //   box=res
            
      // }).catch(err => {
      //       console.error(err)
 
      // })}
      
      try{
          db.collection("user")
          .where({
            user_id: this.globalData.weId.openid
          }).get().then(res => {

            if (res.data.length != 0) {
              console.log("已存在")
            } else {
              console.log("不存在")
              let user = {
                avatar: this.globalData.userInfo.avatar,
                label: '',
                name: this.globalData.userInfo.nickName,
                resume: '',
                sex: '-1',
                user_id: this.globalData.weId.openid
              }
              db.collection('user').add({
                data: user
              }).then(res => {
                console.log(res)
              }).catch(err => {
                console.error(err)
              })
            }
           
          }).catch(err => {
            console.error(err)
            
          })
      }
      catch(e){
        console.error(e)
      }


      
       
      
    }
    else {
      console.error("未登录")
    }
    
    
  },
  // --------------------------

  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();

  },

  getSystemInfo: function() {

    let t = this;
    wx.getSystemInfo({
      success:  (res)=> {
        console.log(res)
        t.globalData.systemInfo = res;
        return res;
        this.globalData = {
          systemInfo: res
        }
        console.log(this.globalData.systemInfo)
      },
      fail(res){
        console.log("error")
        console.log(res)
      }
    });
    console.log(this.globalData.systemInfo)
  },

  editTabbar: function () {

    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  
  globalData: {
    weId:null,
    systemInfo: null,//客户端设备信息
    userInfo: null,//用户信息-是否登陆
    userId:null,//用户id
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/square/square",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/middle/middle",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "发布"
        },
        {
          "pagePath": "/pages/userinfo/index/index",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": "我的"
        }
      ]
    }
  }
  
})
