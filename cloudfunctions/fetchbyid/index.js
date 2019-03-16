// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('busi_sign_in').where({
      _id: event.signid
    }).field({
      begin_date: true,
      _id: true,
      name: true,
      last_sign_date: true
    }).get()
  } catch (e) {
    console.log(e)
  }
}