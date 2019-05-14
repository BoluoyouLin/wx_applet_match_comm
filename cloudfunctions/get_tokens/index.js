// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise') 
// npm install request-promise --production
// npm install wx-server-sdk --production
// 上传并部署：所有文件

/* const API_URL = '' */
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const img = event.imgbase64;
  //console.log(img);
  var tokens;
  var res = await rp(
    {
      method: 'POST',
      uri: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token="24.4915fda9c2c87fb1b78a77181af54b66.2592000.1560353182.282335-16067998"',
      form: {
        image: img // img: 图片 base64 编码，去掉头部.
        // postman 中用 body, require-promise 中用 form.
      },
      headers: {
        /* 'Content-Type': 'application/x-www-form-urlencoded' */
        // require-promise 默认添加该句，故可不用再说明.
      },
      json: true
    }
  ).then(
    (rawdata) => {
      var length = rawdata.words_result_num;
      var text = ""; 
      for (var i = 0; i < length; i++) {
        text += rawdata.words_result[i].words;
      }
      // 将所有识别出的 words 合并成一个 text, 然后将 text 分割为 tokens.
      tokens = text.split(/[\s,.·、丶:：∶;；]+|(?:\(.*\))/);  // 正则
      //console.log(tokens);
    })
    .catch(
      err => {
        console.log(err);
      })
  return tokens;
}  