import regeneratorRuntime from '../../../regenerator-runtime/runtime.js';

const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]
let flag_analyzed = 0;
let contentBox=null;
wx.cloud.init()
const db = wx.cloud.database()
const app=getApp()

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
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    flag_analyzed:0,
    isShowTotalResult:false,
    tokenResult:null,
    content:null,
    analyzeResult:null
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

  // 选择发布图片
  chooseImage:function(){
    console.log("===> chooseImage")
    const that = this;
    wx.chooseImage({

      sourceType: sourceType[this.data.sourceTypeIndex], //图片来源
      sizeType: sizeType[this.data.sizeTypeIndex], //图片类型
      count: this.data.count[this.data.countIndex], //最大选择数量

      success: res => {
        let box =that.data.imageList //数组

        let temp=res.tempFilePaths

        console.log("--->before",box)

        for(let i=0;i<temp.length;i++){
            box.push(temp[i])
        }
        console.log("--->after",box)
        that.setData({
          imageList: box
        })
   
      },

      fail:err=>{
        console.error(err)
      }

    })

  },

  // 选择分析图片
  chooseAnalyzeImage() {
    const that = this;
    console.log("===> chooseAnalyzeImage")
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: res => {

        let one//只分析第一个
        //放到数组第一位
        let box=[]
        let imageList=that.data.imageList

        if(res.tempFilePaths.length>=1){
          one=res.tempFilePaths[0]
          box.push(one)
        }else{
          return
        }
        
        console.log('one-->box',box)

        //没有分析图
        if(that.data.flag_analyzed==0){
          console.log('0')
          
          for(let i=0;i<imageList.length;i++){
            box.push(imageList[i])
          }
          this.setData({
            flag_analyzed:1
          })
          // flag_analyzed=1;
        }else{
          console.log('1')
          
          //去掉首位
          for(let i=1;i<imageList.length;i++){
            box.push(imageList[i])
          }
        }

        that.setData({
          imageList: box
        })
       
        wx.getFileSystemManager().readFile({
          filePath: one, //选择图片返回的相对路径
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
                //转换为字符串
                let resToken=JSON.stringify(tokens.result)
                this.setData({
                  tokenResult: resToken //方便真机调试，显示在界面上
                })
                that.resultAnalyze(tokens.result)
            })
          }
        })
        
      }  //仅第一张图分析

      
    })
  },

  resultAnalyze:function(tokenResout){
    console.log("--->resultAnalyze",tokenResout)
    let that =this
    // tokenResout=["乳糖醇","麦芽糖醇","焦亚硫酸钾","D-山梨糖醇(液)","硝酸钾","十二烷基苯磺酸钙"]

    // gather=tokenResout.forEach(function(item){  
    //   return db.collection("card").where({
    //     name:item
    //   }).get()
    // });
    // db.collection("test")
    // .where({
    //   name:'chenjy3'
    // })
    // .get()
   // 请求集
    let reqGather=tokenResout.map((item)=>{
      console.log(item)
      //模糊查询
      return db.collection("cfc").where({
        //模糊查询
        name: item
      }).get()
    })
    return new Promise((resolve, reject) => {
      Promise.all(reqGather).then((res)=>{
          
        console.log("--->analyze result",res)

        let result=[]
        res.map((item) => {
          console.log("---iten",item)
          if(item.data.length==0){
             
          }else{
            result.push({
              use:item.data[0].use,
              name:item.data[0].name
            })
          }
         
          
        })

        console.log("--->analyze result",result)

        that.setData({
          analyzeResult:result
        })

        resolve(result)
        return result
      
      }).catch(err=>{   
        console.error(err)
        return []
      })
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
    this.setData({
      flag_analyzed:0,
      isShowTotalResult:false
    })

    //不知道怎么直接调用 chooseImage(), 先复制 chooseImage()的代码了
    const that = this;
    that.chooseAnalyzeImage()
    // wx.chooseImage({
    //   sourceType: sourceType[this.data.sourceTypeIndex],
    //   sizeType: sizeType[this.data.sizeTypeIndex],
    //   count: this.data.count[this.data.countIndex],
    //   success: res => {
    //     that.setData({
    //       imageList: res.tempFilePaths
    //     })

    //     // 仅第一张图分析, 一次性选择多张图不分析
    //     if (!flag_analyzed && that.data.imageList.length <= 1) {
    //       wx.getFileSystemManager().readFile({
    //         filePath: res.tempFilePaths[0], //选择图片返回的相对路径
    //         encoding: 'base64', //编码格式
    //         success: res => { //成功的回调
    //           //console.log(res.data);
    //           wx.cloud.callFunction({
    //             name: 'get_tokens',
    //             data: {
    //               imgbase64: res.data  //调用识别API, base64不需要头部（默认就没有）
    //             }
    //           }).then(
    //             (tokens) => {
    //               console.log(tokens.result);
    //               this.setData({
    //                 text: JSON.stringify(tokens.result) //方便真机调试，显示在界面上
    //               })
    //             })
    //         }
    //       })
    //       flag_analyzed = 1;
    //     }  //仅第一张图分析
    //   }
    // })
  },
  // 删除图片
  deleteImage: function (e) {
    var that = this;
    var imageList = that.data.imageList;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    console.log(index)
    wx.showModal({
     title: '提示',
     content: '确定要删除此图片吗？',
     success: function (res) {
      if (res.confirm) {

        console.log('点击确定了');
        if(that.data.flag_analyzed == 1&&index==0){

          // flag_analyzed=0;//并把之前的数据删掉
          that.setData({
            flag_analyzed:0,
            tokenResult:null,
            analyzeResult:null
          })
          imageList.splice(index, 1);

        }else{
          imageList.splice(index, 1);
        }

        that.setData({
          imageList:imageList
        })
        // images.splice(index, 1);

      } else if (res.cancel) {

        console.log('点击取消了');
        return false;    
      }
      
     }
    })
  },

  contentInput:function(e){
    console.log(e)
    this.setData({
      content:e.detail.value
    })
  },

  //全部结果展示
  isDisplay:function(){
    let that=this
    if(that.data.isShowTotalResult){
      that.setData({
        isShowTotalResult:false
      })
    }else{
      that.setData({
        isShowTotalResult:true
      })
    }
  },

  cancelSharing: function () {
    let that=this
    wx.showModal({
        title: '取消或者保存分享',
        content: '保存到未分享可在个人信息页查看',
        confirmText: "保存分享",
        cancelText: "取消分享",
        success: function (res) {
            console.log(res);
            if (res.confirm) {
                console.log('保存到未分享')
                that.saveSharing(0)
            }else{
                console.log('取消分享')
                //返回主页
                wx.redirectTo({
                  url: '../../square/square',
                  success: function(res){
                    // success
                  },
                  fail: function() {
                    // fail
                  },
                  complete: function() {
                    // complete
                  }
                })
            }
        }
    });
  },

  suerSharing:function(){
    console.log("--->sureSharing")
    wx.showLoading({
      title:"正在分享中呢..."
    })
    this.saveSharing(1)
  },  
  
  async saveSharing(flag){
    let data=this.data
    
    //什么都没有写
    if(data.imageList.length==0&&data.tokenResult==null){
      wx.showModal({
        content: '没有内容哟',
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定')
            }
        }
      });
    }

    let card=null;
    let imagesBox=await this.uploadImages(data.imageList)
    console.log("--->savaSharing",imagesBox)

    if(flag==1){
      card={
        create_at:new Date(),
        images:imagesBox,
        is_shared:flag,
        like:[],
        openid:null,
        publish_at:new Date(),
        user_image:null,
        user_name:null,
        user_id:null,
        content:data.content,
        analyze_result:data.analyzeResult
      }
    }else{
      card={
        create_at:new Date(),
        images:imagesBox,
        is_shared:flag,
        like:[],
        openid:null,
        publish_at:null,
        user_image:null,
        user_id:null,
        user_name:null,
        content:data.content,
        analyze_result:data.analyzeResult
      }
    }

    



    if(app.globalData.userDetail!=null){
  
      console.log("1")
      card.user_id=app.globalData.userDetail.user_id
      card.user_image=app.globalData.userDetail.avatar
      card.user_name=app.globalData.userDetail.name
      this.savedb(card)

     
    }
    else if(app.globalData.weId!=null){
      console.log("2")

      //获取用户信息
      db.collection("user").where({
        user_id:app.globalData.weId.openid
      }).get().then(res=>{
        card.user_id=res.data.user_id
        card.user_image=res.data.avatar
        card.user_name=res.data.name
        
        this.savedb(card)
      })
      

    }else{
      console.log("3")
      //请求openid
      //请求用户信息

      wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        let weId = res.result

        db.collection("user").where({
          user_id:weId.openid
        }).get().then(res=>{

          card.user_id=res.data.user_id
          card.user_image=res.data.avatar
          card.user_name=res.data.name
          this.savedb(card)
        })
      })
      
    }
 
  },

  savedb:function(card){
    console.log("--->save",card)
    db.collection("card").add({
      data:card
    }).then(res=>{
      console.log("成功", res)
      wx.hideLoading()
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 3000
      });

      //返回首页
      wx.redirectTo({
        url: '../../square/square',
        
      })

    }).catch(err=>{
      console.log(err)
      
    })
  },

  //需要同步
  uploadImages:function(tempImages){
    console.log("--->uploadImages",tempImages)

    let boxurl=[]
    let i=0
    for(i;i<tempImages.length;i++){
      boxurl.push('cardImages/' +app.globalData.userDetail.name+"_"+ app.globalData.userDetail.user_id+"/" + tempImages[i].match(/\.[^.]+?$/))
    }

    let prolist=tempImages.map((item) => {
      console.log("----->")
      let box1=item.split('/')
      let box2=box1[box1.length-1]
      let box3=box2.split('.')
      let path="";
      for(i=0;i<box3.length-1;i++){
        path+=box3[i]
      }
      console.log(path)
      return wx.cloud.uploadFile({
          cloudPath: 'cardImages/' +app.globalData.userDetail.name+"_"+ app.globalData.userDetail.user_id+"/" + path +item.match(/\.[^.]+?$/), // 文件名称 
          filePath: item, 
      })
    })
   
    return new Promise((resolve, reject) => {
      Promise.all(prolist).then((resCloud)=>{
        
        // t 是page this filse是提交数据，showfiles是回显的路径，

        let result= resCloud.map((item) => {
          return item.fileID
        })
        console.log("res list",result)
        resolve(result)
        return result
      
      }).catch(err=>{   
        console.error(err)
        return []
      })
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