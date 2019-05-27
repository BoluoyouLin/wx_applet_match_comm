// miniprogram/pages/square.js
import regeneratorRuntime from '../../regenerator-runtime/runtime.js';
const app = getApp();
const db = wx.cloud.database();
let util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    cards: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData)
    app.editTabbar();
    wx.showLoading({
      title: "疯狂加载中"
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // this.setAAData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(app.globalData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.firstDisplay();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    let that = this
    that.getSquareData().then(res => {
      that.setData({
        cards: res
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.onReachData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 展示菜单
  showMenu() {
    app.showMenu();
  },

  // 第一次渲染界面
  firstDisplay() {
    let that = this
    // 获取广场数据
    this.getSquareData().then(res => {
      that.setData({
        cards: res
      })
    })
  },

  //  获取广场展示数据
  async getSquareData() {
    let cardList = [], // 用于存储卡片数据
      that = this,
      openId = await that.getOpenId()

    // 获取卡片数据
    cardList = await this.getCardData()

    return this.packSquareData(cardList, openId);
  },

  // 包装广场显示数据
  packSquareData(cardList, openId) {
    let result = [],
      temp = {}
    for (let i = 0; i < cardList.length; i++) {
      temp = {
        id: cardList[i]._id,
        user_id: cardList[i]._openid,
        content: cardList[i].content,
        like: cardList[i].like.length,
        likeList: cardList[i].like,
        is_shared: cardList[i].is_shared,
        image: cardList[i].images[0] === undefined ? '../../assets/images/demo2.JPG' : cardList[i].images[0],
        user_name: cardList[i].user_name,
        user_image: cardList[i].user_image === undefined ? '../../assets/icons/bottom.png' : cardList[i].user_image,
        is_like: cardList[i].like.indexOf(openId) === -1 ? 0 : 1,
        create_at: JSON.stringify(cardList[i].create_at),
        publish_at: JSON.stringify(cardList[i].publish_at),
        mode: 'widthFix',
        height: ''
      }
      result.push(temp)
    }
    wx.hideLoading()
    return result;
  },

  // 获取card数据
  getCardData() {
    let comm = db.command
    return new Promise((resolve, reject) => {
      db.collection('card').where({
          is_shared: 1,
        }).orderBy('publish_at', 'desc').get()
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          console.error(err)
        })
    })
  },

  // 获取上拉加载数据
  getReachData(date) {
    let comm = db.command
    return new Promise((resolve, reject) => {
      db.collection('card').where({
          is_shared: 1,
          publish_at: comm.lt(new Date(JSON.parse(date)))
        }).orderBy('publish_at', 'desc').get()
        .then(res => {

          resolve(res.data)
        })
        .catch(err => {
          console.error(err)
        })
    })
  },

  // 上拉加载
  async onReachData() {
    wx.showToast({
      icon: 'loading',
      title: '疯狂加载中...'
    })
    let that = this,
      cardList = that.data.cards,
      result = await that.getReachData(that.data.cards[cardList.length - 1].publish_at),
      tempCards = [],
      openId = await that.getOpenId()
    if (result.length > 0) {
      tempCards = this.packSquareData(result, openId)
      cardList.push.apply(cardList, tempCards)
      that.setData({
        cards: cardList
      })
      wx.hideToast();
    } else {
      // 没有更多内容
      wx.hideToast();
      wx.showToast({
        title: '居然没了',
        duration: 3000,
        image: '../../assets/icons/bottom.png'
      })
    }
  },

  // 点赞和取消点赞
  // 0是未点赞 1是点赞
  clickLike(e) {
    let index = e.currentTarget.dataset.index,
      tempCards = this.data.cards;
    if (tempCards[index].is_like === 1) {
      tempCards[index].is_like = 0;
      if (tempCards[index].like > 0) {
        tempCards[index].like--;
      }
      let likeIndex = tempCards[index].likeList.indexOf(app.globalData.weId.openi);
      tempCards[index].likeList.splice(likeIndex, 1)
      this.updateLikeByCard(tempCards[index])
    } else {
      tempCards[index].is_like = 1;
      tempCards[index].like++;
      tempCards[index].likeList.push(app.globalData.weId.openid);
      this.updateLikeByCard(tempCards[index])
    }
    this.setData({
      cards: tempCards
    });
  },

  // 获取OpenID
  getOpenId() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: {
          tempCards: this.data.cards
        }
      }).then(res => {
        resolve(res.result.openid)

      }).catch(err => {
        console.error('fail', err)
      })
    })
  },

  // 更新点赞数据到云数据库
  updateLikeByCard(card) {
    wx.cloud.callFunction({
      name: 'updateLikeByCard',
      data: {
        card: card
      }
    }).then(res => {}).catch(err => {
      console.error('fail', err)
    })
  },

  //跳转详情页
  toDetail: function(event) {
    console.log("跳转", event)
    1 // 此处是A页面
    wx.showLoading({
      title:"在跳转拉..."
    })
    wx.navigateTo({
      url: '../sharing/sharingDetail/sharingDetail?id=' + event.currentTarget.dataset.id
    })
    console.log("card-id", event.currentTarget.dataset.id)
  },

  // setAAData() {
  //   console.log("setAAData")
  //   for(let i=0;i<7;i++){
  //     db.collection('card').add({
  //       data: {
  //         user_id: 'ogXH-4wot-rrPkXrpWQxP4sEm2ns',
  //         content: '测试数据1121212212222222222222',
  //         like: [],
  //         is_shared: 1,
  //         images: [],
  //         user_name: '"菠萝油"',
  //         user_image: "#",
  //         create_at: new Date(),
  //         publish_at: new Date()
  //       }
  //     }).then(res => {
  //       console.log(res, 'success')
  //     }).catch(err => {
  //       console.log(err, 'error')
  //     })
  //   }

  // }

})