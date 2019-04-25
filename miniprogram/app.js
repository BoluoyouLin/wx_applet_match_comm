//app.js
App({
  /** 全局数据 */
  globalData: {},

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      tabbar: {
        list: [{
        "class": "ordinary",
        "current": 0,
        "pagePath": "../../pages/square/square",
        "iconPath": "../../assets/icons/home.png",
        "selectedIconPath": "../../assets/icons/homeAfter.png",
      },
      {
        "class": "add",
        "current": 0,
        "pagePath": "#",
        "iconPath": "../../assets/icons/addAfter.png",
        "selectedIconPath": "../../assets/icons/addAfter.png",
      },
      {
        "class": "ordinary",
        "current": 0,
        "pagePath": "../../pages/userinfo/userinfo",
        "iconPath": "../../assets/icons/person.png",
        "selectedIconPath": "../../assets/icons/personAfter.png",
      }
      ]
      }
    }
  },

  /**
   * 获得tabbar数据
   */
  getTabbarData: function() {
    let that = this;
    return that.globalData.tabbar
  },

  /**
   * 页面路径
   */
  pagePath: function(index) {
    switch (index) {
      case 0: return '../picture/picture'; break;
      case 1: return ''; break;
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
      }
    })
  },

  /**
   * 跳转界面（仅限tabbar）
   */
  toPageByTabbar: function(e) {
    let path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path,
    })
  },
})
