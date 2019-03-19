// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    await db.collection('todos').where({
      _openid: 'xxx' // 填入当前用户 openid
    }).count({
      success(res) {
        console.log(res.total)
      }
    })
  } catch (e) {
    console.log(e)
  }
}