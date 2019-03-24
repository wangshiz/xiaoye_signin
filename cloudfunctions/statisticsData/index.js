// 云函数入口文件
const cloud = require('wx-server-sdk')

//cloud.init({ env: 'winder-b47b5d'})
cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const startTime = event.startTime
  const endTime = event.endTime
  try {
    return await db.collection('busi_sign_in_record').where({
      signid: event.signid,
      date_time_stamp: _.gte(startTime).and(_.lt(endTime))
    }).field({
      year: true,
      month: true,
      day: true
    }).get()
  } catch (e) {
    console.log(e)
  }
}