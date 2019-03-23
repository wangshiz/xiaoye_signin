// 云函数入口文件
const cloud = require('wx-server-sdk')

//cloud.init({ env: 'winder-b47b5d'})
cloud.init({ env: 'windertest-24bc91' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    return await db.collection('busi_sign_in').where({
      openid: wxContext.OPENID
    }).field({
      begin_date: true,
      cont_count: true,
      day_count: true,
      _id: true,
      name: true,
      last_sign_date: true
    }).get()
  }catch(e){
    console.log(e)
  }
}