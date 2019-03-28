// 云函数入口文件
//const cloud = require('wx-server-sdk')

cloud.init({ env: 'winder-b47b5d'})
//cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const arr = event.arr
  try {
    const record = await db.collection('busi_sign_in').where({
      _id: event.signid
    }).field({
      begin_date: true,
      _id: true,
      name: true,
      last_sign_date: true
    }).get()

    const weekData = await db.collection('busi_sign_in_record').where({
      signid: event.signid,
      date_time_stamp: _.gte(arr[0].startDate).and(_.lt(arr[0].endDate))
    }).count()

    const monthData = await db.collection('busi_sign_in_record').where({
      signid: event.signid,
      date_time_stamp: _.gte(arr[1].startDate).and(_.lt(arr[1].endDate))
    }).count()

    const yearData = await db.collection('busi_sign_in_record').where({
      signid: event.signid,
      date_time_stamp: _.gte(arr[2].startDate).and(_.lt(arr[2].endDate))
    }).count()

    return {
      record, weekData, monthData, yearData
    }

  } catch (e) {
    console.log(e)
  }
}