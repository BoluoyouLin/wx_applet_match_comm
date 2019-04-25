//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
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
        console.log('取消')
      }
    })
  },
})
