const cloud = require('wx-server-sdk')

//cloud.init({ env: 'winder-b47b5d'})
cloud.init({ env: 'windertest-24bc91' })

exports.main = (event, context) => {

  const wxContext = cloud.getWXContext()
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
