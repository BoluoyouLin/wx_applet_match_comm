// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  let dataSet = "三叉苦@清热解毒、祛风除湿。治咽喉肿痛、风湿骨痛、疟疾、 黄疸、湿疹、皮炎、跌打损伤及虫蛇咬伤等症&金盏银盘@主治上呼吸道感染、咽喉肿痛、急性阑尾炎、急性黄疸型肝炎、胃肠炎、风湿关节疼痛、疟疾，外用治疮疖、毒蛇咬伤、跌打肿痛&野菊花@疏散风热、消肿解毒。能治疗疔疮痈肿、咽喉肿痛、风火赤眼、头痛眩晕&岗梅@具有清热解毒，生津，利咽，散瘀止痛之功效，用于流感高热，急性扁桃体炎、咽喉炎、肺脓肿，跌打损伤，疥疮，颈淋巴结核&咖啡因@ 是一种中枢神经兴奋剂，能够暂时的驱走睡意并恢复精力，临床上用于治疗神经衰弱和昏迷复苏&对乙酰氨基酚@用于感冒发热、关节痛、神经痛及偏头痛、癌性痛及手术后止痛&马来酸氯苯那敏@用于鼻炎、皮肤黏膜过敏及缓解流泪、打喷嚏、流涕等感冒症状&薄荷素油@可用于皮肤或黏膜产生清凉感以减轻不适及疼痛。另具有舒肝理气、利胆，主要用于慢性结石性胆囊炎，慢性胆囊炎及胆结石肝胆郁结，湿热胃滞证&"

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

  let reqGather = box2.map((item) => {
    console.log("-->item", item.name, item.use)
    //模糊查询
    return db.collection("cfc").add({
      data:{
        comment: "",
        name: item.name,
        source: "",
        use: item.use,
        exponent: 90//推荐指数
      }
      
    })
  })


  Promise.all(reqGather).then((res) => {
    console.log("=====>完成导入", res)
    return "=====>完成导入"
  }).catch(err => {
    console.log(err)
    return "=====>导入失败"
  })
}