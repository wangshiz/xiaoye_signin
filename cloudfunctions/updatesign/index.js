// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var date = new Date(Date.now())
  var shouldAdd = event.shouldAdd;
  var lastSignDate = event.lastSignDate;
  var signid = event.signid;

  try {
    return await db.collection('busi_sign_in').doc(signid).update({
      data: {
        last_sign_date: lastSignDate,
        day_count: _.inc(2),
        cont_count: shouldAdd ? _.inc(2) : _.inc(1)
      }
    })



  } catch (e) {
    console.log(e)
  }
}