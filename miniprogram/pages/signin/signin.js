// ono/signin/signin.js
const db = wx.cloud.database()

Page({

  data: {
    id: null,
    openId: null,
  },

  onLoad: function (options) {
    this.setData({
      id: options.id,
      openId: options.openid
    })
    db.collection('busi_sign_in').where({
      openid: options.openid,
      _id: options.id
    }).field({
      begin_date: true,
      cont_count: true,
      day_count: true,
      _id: true,
      name: true,
      last_sign_date: true
    }).get({
        success(res) {
          if (res.data != null && res.data.length > 0) {
            wx.setNavigationBarTitle({
              title: res.data[0].name
            })
          }
        }
      })
  },

  //删除习惯
  signDelete(e) {
    var id = e.currentTarget.dataset.id
      , that = this;
    wx.showModal({
      title: '',
      content: '确定要放弃吗',
      success(res) {
        if (res.confirm) {
          db.collection('busi_sign_in').doc(id).remove({
            success(res) {
              wx.reLaunch({
                url: '../index/index?openid=' + that.data.openId,
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})