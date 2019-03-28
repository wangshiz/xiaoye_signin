// 云函数入口文件
//const cloud = require('wx-server-sdk')

cloud.init({ env: 'winder-b47b5d'})
//cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var nowDate = new Date(event.nowDate);
  var dateNum = nowDate.getTime()
  var dateYear = nowDate.getFullYear();
  var dateMonth = nowDate.getMonth() + 1;
  var dateDay = nowDate.getDate();
  var nowZeroDate = new Date(dateYear, dateMonth - 1, dateDay);
  //是否需要添加
  var shouldAdd = true;
  if (event.lastSignDate == null) {
    shouldAdd = false;
  } else {
    lastSignDate = new Date(event.lastSignDate);
    var lastZeroDate = new Date(lastSignDate.getFullYear(), lastSignDate.getMonth(), lastSignDate.getDate());
    if (nowZeroDate - lastZeroDate > 86400000) {
      shouldAdd = false;
    }
  }

  try {
    await db.collection('busi_sign_in_record').add({
      data: {
        signid: event.signid,
        date: nowDate,
        date_time_stamp: event.nowDate,
        year: dateYear.toString(),
        month: dateMonth >= 10? dateMonth.toString(): "0"+dateMonth.toString(),
        day: dateDay >= 10 ? dateDay.toString() : "0" + dateDay.toString(),
      }
    })

    await db.collection('busi_sign_in').doc(event.signid).update({
      data: {
        last_sign_date: nowDate,
        day_count: _.inc(1),
        cont_count: shouldAdd ?_.inc(1): 1
      }
    })

    return {
      success
    }
  } catch (e) {
    console.log(e)
  }
}