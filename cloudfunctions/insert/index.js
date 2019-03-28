// 云函数入口文件
//const cloud = require('wx-server-sdk')

cloud.init({ env: 'winder-b47b5d'})
//cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('busi_sign_in').add({
      data: {
        openid: wxContext.OPENID,
        name: event.name,
        begin_date: new Date(event.nowDate),
        cont_count: 0,
        day_count: 0,
        last_sign_date: null 
      }
    })
  } catch (e) {
    console.log(e)
  }
}