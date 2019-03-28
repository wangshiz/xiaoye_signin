// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'winder-b47b5d'})
//cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    await db.collection('busi_sign_in').doc(event.signid).remove()
    await db.collection('busi_sign_in_record').where({
      signid: event.signid
    }).remove()
    return {
      success
    }
  } catch (e) {
    console.log(e)
  }
}