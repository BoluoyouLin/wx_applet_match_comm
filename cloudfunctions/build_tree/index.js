// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  var tblCur = {},
    key, str_key, Length, j, i;
  var tblRoot = tblCur;

  for (j = event.keywords.length - 1; j >= 0; j -= 1) {
    str_key = event.keywords[j];
    Length = str_key.length;
    for (i = 0; i < Length; i += 1) {
      key = str_key.charAt(i);
      if (tblCur.hasOwnProperty(key)) {
        tblCur = tblCur[key];
      } else {
        tblCur = tblCur[key] = {};
      }
    }
    tblCur.end = true; //最后一个关键字
    tblCur = tblRoot;
  }
  return tblRoot;
}