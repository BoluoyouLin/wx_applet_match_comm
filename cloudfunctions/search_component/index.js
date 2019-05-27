// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  //需要传 content（照片识别得到的内容） 和 tblRoot（云函数build_tree返回的结果）
  var tblCur,
    p_star = 0,
    n = event.content.length,
    p_end,
    match, //是否找到匹配
    match_key,
    match_str,
    arrMatch = [], //存储结果
    arrLength = 0; //arrMatch的长度索引

  while (p_star < n) {
    tblCur = event.tblRoot; //回溯至根部
    p_end = p_star;
    match_str = "";
    match = false;
    do {
      match_key = event.content.charAt(p_end);
      if (!(tblCur = tblCur[match_key])) { //本次匹配结束
        p_star += 1;
        break;
      } else {
        match_str += match_key;
      }
      p_end += 1;
      if (tblCur.end) //是否匹配到尾部
      {
        match = true;
      }
    } while (true);

    if (match) { //最大匹配
      arrMatch[arrLength] = {
        key: match_str,
        begin: p_star - 1,
        end: p_end
      };
      arrLength += 1;
      p_star = p_end;
    }
  }
  return arrMatch;
}