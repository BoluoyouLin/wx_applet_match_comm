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
    // this.dataEetEntry()
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
    // wx.cloud.callFunction({
    //   name:'data_set_entry'
    // })
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


  //分析数据集录入
  dataEetEntry:function(){
    let dataSet = "维他命A酸衍生物@治疗痤疮有效成份，需医生处方&腺三磷酸@使皮肤代谢正常&白蛋白@水溶性蛋白质，为中性缓冲液，是一种酵素&酒精@溶剂&紫花苜蓿萃取@含多种氨基酸及红萝卜素，可抗老化&海藻萃取液@抗氧化&烃基安息香酸盐@油脂剂，作为基质&尿囊素@抗炎症、促进细胞修护&杏仁油@天然油脂，用作基质&芦荟萃取@镇静、保湿、滋润、抗敏、镇静、去红肿&芦荟@镇静、保湿、滋润、抗敏、镇静、去红肿&果酸@最常用的为甘醇酸(GlycolicAcid)及乳酸(LacticAcid)，主要功效在促进皮&脂肪酸@硫辛酸，抗氧化&维他命E@抗氧化&氢氯酸铝@可抑制身体出汗，常来用作止汗剂成份&天然胺基酸@防止水份过度的流失，并使肌肤温和不紧绷，护肤、供给肌肤营养&胺基己酸@预防肌肤敏感现象&甘草酸胺@保湿、预防过敏&羊膜液@含丰富肌肤所需的胺基酸&当归萃取@具有行气活血功效，可促进肌肤毛细微管血液循环&白芷@当归属，含天然维他命C及预防敏感作用&被子植物酸@具有防止发炎及抗过敏效果&去水紫草烯@紫草萃取精华，可抗炎、抗菌、活血、去瘀、化学性防晒成分&苹果萃取@含有Vit-C等美容成份，另具有爽肤、镇静消毒作用&杏桃颗粒@通常加在磨砂膏中，用来去除皮肤老废角质&杏核油@富含矿物质和维他命，是天然的保湿剂，特别适合敏感性肤质@熊果素@淡化已形成的黑色素，能安定自由基、避免肌肤老化，卫生署公布有效美白成份之一&山金车萃取@活血散瘀&山金车油@可促使伤口愈合、消毒、消肿、防止瘀斑出现&维他命C@抗氧化&维他命C甘醣@维他命C衍生物，为卫生署公布有效美白成份之一&维他命C棕榈酸盐@一种脂溶性维他命C，是安定的维他命C&酯化C@安定的维他命C&脂溶性维他命C@安定的维他命C&骆梨油@保湿剂、含大量维他命A、C、D、E&壬二酸@抑制黑色素，抗菌消炎，用来治疗痤疮的温和成份&杜鹃花酸@抑制黑色素，抗菌消炎，用来治疗痤疮的温和成份&硫酸钡@物理性防晒成份&月桂萃取@收敛毛孔、抑制油份分泌&熊果萃取@含食子单宁、葡萄糖甘等成份，具收敛、杀菌消毒、美白等功效&蜜蜡@基质，可增强产品浓度&膨润土@皂土&有很好的清洁和吸附效果，亦具有抑制脸部油脂分泌的功效，用来调置面膜清洁氯化苯二甲烃铵@抗菌、防腐&安息香酸@防腐剂&苯甲酸@防腐剂&二苯甲酮衍生物@化学性防晒成分，可防御UVA，属苯甲酮类&产品赋型剂@作为基质&过氧化苯盐@是一种氧化剂，有抑菌的效果，特别是对引起青春痘的痤疮杆菌这种厌氧佛手柑萃取@收敛毛孔、平衡油脂分泌&桦木芽萃取@抗菌&桦木萃取@抗菌、收敛、净化作用&覆盆子萃取@消毒、收敛、消脂、排水&生化胶原蛋白@保湿&酵素@脢、促进细胞新陈代谢&生化蛋白质@刺激胶原蛋白合成，预防老化，有助组织重建&双性缩胺酸@促进胶原蛋白、弹力蛋白的产生，改善松弛&侧柏叶萃取@镇定肌肤&桦树萃取@消毒、收敛，增加皮肤愈合力&没药萃取@收敛、消毒杀菌加快伤口愈合&甜没药醇@防刺激剂，提取自洋甘菊&白芨萃取@含天然维他命C，可减少黑色素沉淀&琉璃苣油@天然油脂，含丰富的维他命Ｅ、Ｆ，修补凹洞&菠萝酵素@代谢老旧细胞角质&牛蒡根萃取@调节皮脂分泌、收敛作用&牛蒡@消毒、预防粉刺、促进细胞生长、抗发炎&丁酯@防腐剂&硬脂酸@赋型剂、基质&丁二醇@保湿&羟基茴香二丁酯@酸化防止剂&辅脢@抗氧化，可以消灭自由基，维持细胞膜的完整和稳定&维他命B5衍生物@为紫外线吸收剂(化学性防晒成份)金盏花萃取@具舒缓、安抚敏感肌肤等功效&山茶萃取@茶多酚&抗氧化&樟树@抗痒、防过敏&墈地里拉蜡@浓度增强剂&三甘油酯@皮肤润滑剂&高份子胶@浓度增强剂&羧乙烯聚合物@赋型剂&几丁质衍生物@来自虾蟹外壳，为一高分子量之黏多醣体，具有保湿作用&棕榈蜡@增加光泽感&鹿角菜胶@保湿&胡萝卜油@可促使伤口愈合、镇痛、滋养、消毒、抗老化&红花萃取@活化肌肤&蓖麻油@含蓖麻油酸(Ricinoleicacid)，可润滑、保湿&老公根@紧实肌肤、增加弹性&分子钉@保湿剂&神经醯胺@细胞质脂&保湿剂&矿蜡@乳化剂&十六硬脂酸酯@乳化剂&鲸蜡醋酸盐@油脂剂&鲸腊硬酯醇@十六醇&乳化剂&鲸蜡硅氧烷@油脂剂&棕榈酸鲸腊酯@乳化剂&洋甘菊油@抗自由基、舒缓&绿藻萃取@滋润、保湿&维他命D3@内用为增加钙质吸收，外用可治疗牛皮癣&胆骨化醇@内用为增加钙质吸收，外用可治疗牛皮癣&胆固醇@乳化剂&桂皮酸盐类@化学性防晒成分，也是目前较安全的成份&肉桂精油@防腐、杀菌&柠檬酸@防腐剂及平衡酸碱度&柠檬醇@乳化剂&柠檬油@润肤&法国香柠檬@具提神醒肤、消除肌肉疲劳以及对毛孔粗大有收敛效果等作用&香茅精油@清洁、杀菌&柑橘萃取@含有维他命C，具有防菌效果，可以控制油脂分泌作用及防止雀斑、黑斑的形成&煤焦油@常用来做为唇膏的染料&烷基醯胺类@界面活性剂，起泡剂，清洁用&非离子界面活性剂@清洁用品主要成份。当CocoamideDEA和其它复合物结合时，可能形成薏米@预防黑色素沉淀&胶原蛋白@可以支撑结缔组织，含有19种胺基酸，具有良好的吸水性，其主要功能是增加组织的紫草萃取@含尿囊素，具舒缓皮肤、刺激新细胞的生长的功效&甘草萃取液@抗敏、镇静、去红肿&矢车菊萃取@抗发炎，适用于敏感肤质&红藻@保湿&水芹@消肿，促使伤口愈合，清洁净化、收敛肌肤&小黄瓜萃取@含丰富维生素C，保湿、滋润、美白、活化肌肤&氰钴胺@细胞代谢&维他命B12@细胞代谢&环甲硅脂@不含油的润滑剂，能给予肌肤瞬间柔嫩肤触，适合用作妆前饰底成份&去氧核醣核酸@促进新陈代谢、保湿、预防老化&脱氢醋酸@防腐剂&尿素醛@防腐剂，会释放甲醛(Formaldehyde)，会刺激皮肤，长期使用有致癌之虞&磷苯甲酸二丁酯@塑化、润滑、驱虫，但是会造成新生儿天生缺陷，故已禁止使羟基甲苯二丁酯@是酸化防止剂&二氯醋酸@刺激麦拉宁色素由角质层剥落&二异硬脂酸酯@硬脂酸的衍生物，润滑剂&硅氧烷@乳化剂，有润肤功效&甘草酸钾@预防过敏&乙二胺四乙基二钠@水质处理，有抗氧化功效，当作防腐剂使用，亦可防止钙镁离子沉淀&磺基琥珀酸酯@一种界面活性剂，清洁用起泡剂&蒸馏水@基质，产品调制时所需的水份&防腐剂@会释放甲醛(Formaldehyde)，会刺激皮肤，长期使用有致癌之虞&长春藤@具抗氧化作用代谢废物、排泄毒素&弹力素@增加弹性、保湿&接骨木@温和紧肤、美白袪斑作用；兼能纾缓颜面神经紧张，舒缓肌肉僵硬&维他命D2@刺激细胞再生&骨化醇@刺激细胞再生&乙酯@防腐剂&乙烯二胺四乙酸@产品溶液沉淀防止剂、硬水软化剂&乙烯@一种植物性贺尔蒙，可促进细胞活化&乙基乙基一甲氧基肉桂酸盐@化学性防晒成份&小米草萃取@收缩，镇静&月见草油@促进肌肤血液循环，并提供保湿&夜樱草油@促进肌肤血液循环，并提供保湿&色素@常常含在一些化妆品、染发剂及去除头皮洗发精里&脂肪醇混晶@一种界面活性剂，清洁起泡剂&茴香@对清洁、紧肤、毛孔粗大、防皱有很好的效果，并可排出多余的水份与无法吸收之代谢物&阿魏酸@抗氧化&脂衍@Jojoba萃取液，保湿、预防松弛&甲醛@防腐剂，有致癌之虞，已被禁止使用&连钱草萃取@消肿&香精@产品添加之化学香味&天竺葵精油@收敛、抑菌，能调节内分泌腺&姜@促进细胞生长、活化肌肤&银杏叶萃取@抗氧化、抗紫外线、增加血液循环、促进细胞再生&银杏@预防细胞老化，增进新陈代谢，并可达白皙效果&人蔘萃取液@滋养、消除疲劳、预防皱纹、促进血液循环等功效&甘油@保湿、滋润肌肤&单硬脂酸甘油脂@乳化剂&甘油硬脂酸酯@乳化剂&甘醇酸@常用的果酸成份，去除老废角质、增加肌肤新陈代谢&醣蛋白@强化细胞修复、代谢能力&甘草酸@具良好之防敏感效果，可使眼部肌肤挥别黯沉&甘草次酸@预防肌肤敏感现象，安抚、舒缓受刺激的肌肤&葡萄籽萃取@含高成分葡萄多酚，可预防自由基及细胞氧化功能&葡萄柚精油@调节皮脂分泌，具良好流动性，可增加体内水分代谢&葡萄籽油@富含维生素，矿物质及蛋白质，抗氧化的效果是维它命C的20倍，维它命E的倍&绿茶萃取@舒缓、抗自由基&金缕梅@去淤消肿&山楂萃取@抗发炎&榛叶@促进血液循环，提升细胞含氧量，辅助肌肤代谢，增加肌肤的免疫功能&贺客多力士@乳化剂，是一种含硅酸镁、硅酸锂的黏土&永久花萃取@促进细胞再生&生化醣醛酸@保湿,化学性防晒成分，属水杨酸盐类&马栗树@预防发炎，预防微血管曲张&七叶树萃取@预防发炎，预防微血管曲张&木贼萃取@促进肌肤细胞中胶原蛋白的合成&玻尿酸@属于非油脂性滋润剂，能吸收比本身重量多500-1000倍的水份&醣醛酸@属于非油脂性滋润剂，能吸收比本身重量多500-1000倍的水份&红花子油@滋润剂&天胡荽萃取@去脂肪，可作为瘦身用途；另可防过敏，增加皮肤愈合力&氢化卵磷脂@滋润、预防老化@氢化大豆甘油酯@润肤&水解胶原蛋白@维持肌肤紧实及弹性，分子比胶原蛋白小，较易为皮肤吸收&水解蛋白@水解蛋白质，具保湿、增加肌肤弹性&对苯二酚@高效美白去斑成份，列为药物管制&眯坐丁尿酸@防腐剂，会释放甲醛(Formaldehyde)，刺激皮肤，长期使用有致癌之虞，是一种抗自由基之天然复合物，能抗拒因外来因素之分子与铜离子之结合以避免铜离子之氧化&氧化铁@色料&异癸烷@舒缓(可由大茴香、奶油酸、柠檬油、菩提树油中萃取)&异十六烷@增添质感(可由甜胡椒、大茴香、白菖根、芹菜籽、奶油酸、咖啡、茶等萃取)&异丙醇@乳化剂&十四酸异丙酯@化学合成油脂剂，易致暗疮&肉豆蔻盐@化学合成油脂剂，易致暗疮&十六酸异丙酯@化学合成油脂剂，易致暗疮&棕榈油盐@化学合成油脂剂，易致暗疮&氢化骨胶原@润肤&异硬脂酸@饱和脂肪酸，用于调节稠度及外观质感&异十八醇@乳化剂&常春藤萃取@具去脂，抗水肿，分解脂肪，收敛及镇静作用，促进代谢循环、消除蜂窝组织&酯@滋润、保湿&荷荷芭油@滋润、保湿&白陶土@中国土，用做颜料&克多可那挫@抗霉菌剂，用来治疗因皮屑芽孢菌感染的脂漏性皮肤炎或头皮屑效果很好&奇异果@内含多种维生素，可使肌肤白晰、活化细胞&桑白皮@白皙、淡化斑点&曲酸@抑制黑色素形成，使麦拉宁色素代谢正常，卫生署公布有效美白成份之一&夏威夷核油@含多种脂肪酸，有极佳的渗透性及滋润效果&维他命C磷酸镁复合物@维他命C衍生物，左旋维他命C@抗氧化作用&乳酸@角质软化及保湿作用&海藻萃取液@柔软肌肤、提升肌肤免疫力、加强肌肤弹力与光泽&蜂蜡醇@天然油脂，可作为基质&羊毛脂@滋润&羊毛脂醇@乳化剂&牛蒡萃取@预防粉刺、抗菌，抑制头皮屑&氨基酸月桂醇酯@一种改质剂，轻滑、柔顺、高亮泽度，除可使粉体较亲油、增强保湿性&熏衣草萃@抗菌、消炎、镇静皮肤&卵磷脂@保湿及抗氧化功能&柠檬萃取@美白、滋润、抗炎&柠檬香茅精油@缓和肌肤不适感、抑菌、消除肌肉酸痛、可作为防菌剂&白屈菜萃取@预防过敏，增加抵抗力&甘草萃取@保护敏感肌肤&甘草根@预防发炎&川芎萃取@增加细胞代谢&百合萃取@镇静、抗炎&莱姆树萃取@含丰富的植物氨基酸，能活化细胞组织及再生能力&莱姆萃取@平衡油脂分泌&菩提萃取@具安抚、舒缓肌肤功效&亚麻仁油酸@维他命F，不饱和脂肪酸，防止表皮水份流失，滋润皮肤&脂肪脢@增加肌肤新陈代谢&酵素@增加肌肤新陈代谢&微脂体@结构与人体细胞类似，可以非常容易被人体所吸收同时也不会引起副作用，可增加皮肤液态石腊@润肤&丝瓜萃取@保湿、镇静&澳洲胡桃油@对皮肤的血液循环及毒素排除有一定的效果，防止自由基生成，抗老化&维他命C磷酸镁复合物@具有美白功效，为卫生署&维他命C衍生物@具有美白功效，为卫生署&苹果酸@由频果中萃取出来，为果酸的一种，可加速皮肤代谢老废角质&锦葵萃取@含丰富的植物氨基酸，能活化肌肤细胞组织及再生能力&金盏花油@抗发炎、清洁、收敛、活血散瘀，增加皮肤愈合力&马郁兰萃取@对扩张动脉、微血管扩张、散瘀有帮助&药蜀葵萃取@含黏质美容成份；可放松肌肤，安抚日晒后的各种不适现象&洋甘菊萃取@抗炎、防过敏&小白花@滋润、抗敏&绣线菊籽油@滋润、抗敏&绣线菊萃取液@具有预防刺激、舒缓、收敛肌肤功效&美拉白@抑制黑色素沉淀及淡化色斑&香蜂草萃取@肌肤油水平衡，增强抵抗力，预防感染&维他命K@去瘀、消肿&薄荷脑@清洁、杀菌&被子植物萃取@预防发炎过敏&甲基羟苯酸酯@防腐剂&苯甲酸甲酯@防腐剂&水杨酸甲酯@抗发炎&冬青油@抗发炎&麦光素滤光环@化学性防晒成分&云母@通常加入化妆品中增加使用后的质感与肤触&微粒蜡@微粒化之蜡，用做基质&牛奶蛋白@具保湿、嫩白作用&矿物油@基质&绿土@可吸收过多油脂达到收敛、抗菌及抗炎等作用&桑椹萃取@含氨基酸及黄碱素，捕捉自由基，对于肌肤有抗氧化及白皙作用&麝香萃取液@减少过多油脂分泌，收缩粗大毛孔，柔细肌肤&羊毛脂醇@天然油脂&蜂蜡醇@乳化剂&钠羟基皮酪烷酮@用来作为一自然水溶性亲子基因子，用来作为保湿剂&橙花萃取@促进细胞再生，预防敏感&烟碱醯胺@维他命B3衍生物防止皮肤对阳光有过烈的反应，修补阳光对皮肤造成的伤害&尼龙纤维@通常用在睫毛膏中，增加使用时的增长效果&尼龙-12@经过特别研制的尼龙粉底，可作为滑石粉的替代品。其微细圆粒，能让涂敷粉底更容易&对氨基苯甲酸盐@紫外线吸收剂，防晒成份，但容易引致敏感&桂皮酸盐@化学性防晒成分，可防御UVB&棕榈酸辛酯@有长效保湿功用，使肌肤柔嫩光滑&水阳酸盐@化学性防晒成分&油酸@由植物中粹取之成分可帮助产品的渗透&寡醣萃取@增强肌肤新陈代谢&橄榄油@保湿、滋润、抗皱、超级抗老化作用、并能保持毛孔畅通、洁净&橙橘精油@富含维他命A、B、C&二苯甲酮@化学性防晒成分，可防御UVA，属苯甲酮类&地蜡@天然矿物蜡，为保养品基剂&对胺基苯甲酸盐@化学性防晒成分，常致过敏反应，现多不为采用&对一羟基苯甲酸酯@防腐剂&氢化篦麻油@为天然植物性油脂，具肌肤柔润作用&蜜蜡@基质，可增强产品浓度&牡丹根萃取@活络血液循环&红藻萃取@可促进微血管循环，去除水肿&棕榈酸@软脂酸油脂剂&棕榈油酸@不饱和脂肪酸，防止表皮水份流失，柔润皮肤&维他命B5@泛先醇保湿剂&木瓜酵素@清除代谢老废的角质细胞、促进细胞组织更新&对氨基苯甲酸盐@紫外线吸收剂，化学防晒成份，主要是防UVB，但容易&石腊@基质，可加强溶液浓度&珍珠粉@含有十八种对人体有益的氨基酸，具有美白、润肤、修护的效果&珍珠颜料@用在化妆品中以增加光泽&泛维他@保湿剂&薄荷萃取@镇静、清洁毛孔&香精@产品添加之化学香味&凡士林@润滑剂、保湿剂&酚酸@抗氧化剂&苯氧基乙醇@杀菌剂&维生素K1@去淤、可用来去除黑眼圈&植物性胎盘素@预防老化，活化细胞弹力&植物胎盘素@预防老化，活化细胞弹力&松果萃取@可促进肌肤的血液循环及细胞的携氧量&胎盘素@提供各种肌肤所需的氨基酸、弹力蛋白、使肌肤富弹性&胎盘蛋白@刺激麦拉宁色素由角质层剥落&胎盘素@提供各种肌肤所需的氨基酸、弹力蛋白、使肌肤富弹性&车前草@含熊果素，可淡斑、美白&聚异丁烯@赋型剂，加强浓度&聚乙烯@酒精之脱水产物，用以控制产品变干的时间&聚葡萄糖@保湿，预防过敏，舒缓红肿&聚多醣酸@防止老化、促进新陈代谢&聚甘油二酯@润滑剂&何首乌萃取@增加血液循环，活络细胞&聚甲基丙烯酸甲酯@可使修容粉长效不易脱落，亲肤性更佳&聚气乙烯月桂醚@阴离子系合成之界面活性剂，洗净力强&聚胜@是胺基酸的一种，能呵护受损的细胞&多己二稀酸20@乳化剂&多己二稀酸60@乳化剂&多己二稀酸80@乳化剂&聚乙烯醇@高分子聚合胶，属植物性胶体，可吸附深层毛孔中的污垢及粉刺&山梨酸钾@防腐剂&丙基羟苯酸酯@防腐剂&羟苯甲酸丙脂@防腐剂，较为安全&丙二醇@保湿剂&丙烯甘醇@保湿剂&蛋白脢@清洁柔软促进活化振奋疲乏的细胞&补骨脂@滋润&纯水@基质，载体&维他命B6@是一种共同酵素，增加代谢&角质素@保湿&夸特宁-18@纤维萃取，用做结合之媒介&白芷@美白、保湿、供给皮肤养份&维他命A酸@具有去角质、促进代谢、调理油脂分泌的功能，可以改善、治疗青春痘、粉刺&维他命A素@促进皮肤新陈代谢，减少粉刺，冶疗暗疮，减少细纹&维他命A@高效除皱成份&棕榈酸维生素A@具有滋润功效，减少细少纹路及修护肌肤作用&植物再生素@修护受损肌肤&维生素B2@核黄素增强代谢，促进皮肤、指甲、及头发的健康生长&蓖麻油酸@润滑、保湿&玫瑰精油@润白、保湿&玫瑰果@富含维他命C，可美白、滋润肌肤&迷迭香萃取@收敛毛孔、紧实皮肤&迷迭香精油@帮助血液循环、平衡神经系统、强化敏感肌肤&酒精@保养品、化妆品用酒精&红花油@基质，润肤成份&鼠尾草萃取@收敛、抗炎、镇静，平衡油脂，促进细胞再生&水杨酸盐类@化学性防晒成分&水杨酸@有去角质的功能，能去除粉刺。(另可做为防腐剂用途)&黄芩萃取@镇静、抗菌&海藻黏多醣体@保湿剂&海藻萃取@柔软肌肤、提升肌肤免疫力、加强肌肤弹力与光泽&绢云母@用作化妆品，增加质感&血清蛋白@促进细胞再生，促使真皮层中纤维母细胞制造弹力蛋白&芝麻油@滋润剂&紫根萃取@舒缓红肿肌肤，增加抗体&丝胺基酸@润肤&丝蛋白@活化细胞，增加肌肤弹性&白桦@含维生素C、钠与磷、具有促进血液循环、收敛、抗感染&海藻胶@保湿剂&维他命C@抗氧化&柠檬酸钠@产品溶液缓冲剂，让产品型态更为安定&玻尿酸钠@天然保湿因子&聚氧乙烯烷基硫酸钠@阴离子界面活性剂，易起泡性易溶于水中&角质素@保湿&山梨醇@保湿剂&大豆蛋白@刺激细胞新生，产生胶原纤维及弹力纤维，增强肌肤支撑组织的弹性与紧实&角鲨烯@含有丰富的胶质成份，易于皮肤吸收，并可促进皮脂再生，具有清爽不油腻&硬脂酸@油脂剂&十八烷醇@硬脂醇乳化剂，但不会起泡&甘草酸硬脂酯@具有预防肌肤受刺激、降低敏感的功能&植物性贺尔蒙@抗老化&硫磺剂@有消炎、干燥的功效，常用来治疗青春痘肌肤&甜杏仁油@含有维他命D、E，对面疱有调理作用，还具有隔离紫外线的作用&滑石粉@物理性防晒功能，为天然矿石萃取&酒石酸@由葡萄酒中萃取出来，为果酸的一种，可加速皮肤代谢老废角质&茶树精油@天然的抑菌剂，可平衡油脂、预防感染&乙二氨四醋酸四钠@化妆品溶液中的隔离剂，可做为产品中的抗菌剂（防腐剂&维他命B1@硫胺素增加代谢&百里香萃取@具抗菌、防腐、镇静、收敛等作用&二氧化钛@物理性防晒成份，可改善肤色&二氧化钛@物理性防晒成份，可改善肤色&维他命E@抗氧化剂&甲苯@常常是指甲油与去除剂的成份&海藻多醣体@具有保湿及柔软作用&三氯沙@有杀菌的功效，常用来治疗青春痘&玉洁新@抗菌，可抑制痤疮&三乙醇胺@酸碱值调节剂&群青@色料&尿素@保湿、收敛&凡士林@润滑剂&维他命A酸@具有去角质、促进代谢、调理油脂分泌的功能，可以改善、治疗青春痘、粉刺&棕榈酸维生素A@具有滋润功效，减少细少纹路及修护肌肤作用&维他命C@美白、抗斑&维他命E油@抗氧化、保湿、滋润&维他命E@抗自由基、天然保存剂、保湿剂&维他命F@保湿&维他命K@帮助血循、淡化黑眼圈&蜡酯@基质，润肤成份&蜡@化妆品之基质&小麦胚芽油@含丰富维他命E，是天然抗氧化剂&小麦蛋白@水解蛋白质，低敏感性，有抗氧化作用&百合萃取@柔软肌肤、消毒、治疗伤口&山药萃取@具有修护、保湿及增加肌肤弹力功效&金缕梅萃取@抗炎、去红肿、平衡油脂分泌&羊毛脂@滋润皮肤&蓍草萃取@平衡油脂，促进细胞再生&酵素@含有碳水化合物、乳酸、重要的矿物质及维他命群，可以促进皮肤及黏膜的细胞机能&黄龙胆根萃取@可预防雀斑、有滋养作用&依兰精油@平衡油脂分泌，适合油性肌肤使用&优格@修护肌肤、嫩白&氧化锌@物理性防晒剂&海草胶@保湿&"

    let box1 = dataSet.split("&")
    let box2 = []
    for (let i = 0; i < box1.length; i++) {
      let box3 = box1[i].split('@')
      if (box3 == null || null == box3[0] || null == box3[1]) {
        console.log("有空的", box3)
      } else {
        box2.push({
          name: box3[0],
          use: box3[1]
        })
      }

    }

    console.log(box2)

    
    let index=0
    //每次插100条，多了会报错
    for(let j=369;j<box2.length;j++){
      console.log("-->item", box2[j].name, box2[j].use)
      db.collection("cfc").add({
        data:{
          comment: null,
          name: box2[j].name,
          source: null,
          use: box2[j].use,
          exponent: 90//推荐指数
        }
        
      }).then(res=>{
        console.log("==》".res)
      })
      index++;
      if(index>100){
        break;
      }
    }
      
    // let reqGather = box2.map((item) => {
    //   console.log("-->item", item.name, item.use)
    //   //模糊查询
    //   return db.collection("cfc").add({
    //     data:{
    //       comment: "",
    //       name: item.name,
    //       source: "",
    //       use: item.use,
    //       exponent: 90//推荐指数
    //     }
    //   })
    // })
    // console.log("==============")
    // Promise.all(reqGather).then((res) => {
    //   console.log("=====>完成导入", res)
    //   return "=====>完成导入"
    // }).catch(err => {
    //   console.log(err)
    //   return "=====>导入失败"
    // })
    
  },
})