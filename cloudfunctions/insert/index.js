// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'winder-b47b5d'})
//cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const dateCount = event.dateCount
  try {
    var pass = 0  // 0为数量已经达到dateCount数了  1为重复名称  2为成功添加
    const count = await db.collection('busi_sign_in').where({
      openid: wxContext.OPENID
    }).count()

    if (count.total < dateCount) {
      const res = await db.collection('busi_sign_in').where({
        openid: wxContext.OPENID,
        name: event.name
      }).get()

      if (res.data.length > 0) {
        pass = 1
      } else {
        await db.collection('busi_sign_in').add({
          data: {
            openid: wxContext.OPENID,
            name: event.name,
            begin_date: new Date(event.nowDate),
            cont_count: 0,
            day_count: 0,
            last_sign_date: null
          }
        })
        pass = 2
      }
    }

    return {
      pass
    }
  } catch (e) {
    console.log(e)
  }
}