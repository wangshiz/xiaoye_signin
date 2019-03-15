// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const dbtime = db.serverDate();
  var date = new Date(Date.now());
  var dateYear = date.getFullYear();
  var dateMonth = date.getMonth() + 1;
  var dateDay = date.getDate(); 
  var nowDate = new Date(dateYear, dateMonth - 1, dateDay);
  var lastSignDate = event.lastSignDate;
  var lastDate = new Date(lastSignDate.getFullYear(), lastSignDate.getMonth(), lastSignDate.getDate());
  var shouldAdd = true;
  if (nowDate - lastDate > 86400000) {
    shouldAdd = false;
  }

  try {
    await db.collection('busi_sign_in_record').add({
      data: {
        signid: event.signid,
        date: dbtime,
        year: dateYear.toString(),
        month: dateMonth >= 10? dateMonth.toString(): "0"+dateMonth.toString(),
        day: dateDay >= 10 ? dateDay.toString() : "0" + dateDay.toString(),
      }
    })
    
    const res = await cloud.callFunction({
      // 要调用的云函数名称
      name: 'insertrecord',
      // 传递给云函数的参数
      data: {
        shouldAdd: shouldAdd,
        lastSignDate: dbtime,
        signid: event.signid
      }
    })
    return res.result
    

  } catch (e) {
    console.log(e)
  }
}