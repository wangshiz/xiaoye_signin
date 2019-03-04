//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '../../images/basicprofile.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    buttonDisplay: 'block',
    viewDisplay: 'none',

    //存储计时器
    setInter: '',
    num: 3,

  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../error/error',
      })
      return
    }

  
    // 获取用户信息
    wx.getSetting({

      success: res => {

        if (res.authSetting['scope.userInfo']) {
          //已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                buttonDisplay: 'none',
                viewDisplay: 'block'
              })
            }
          })
          var that = this;
          that.onGetOpenid();
          var open_id = getApp().globalData.openid;
          that.data.setInter = setInterval(
            function () {
              var numVal = that.data.num -1;
              that.setData({ num: numVal });
              if (that.data.num == 0){
                wx.redirectTo({
                  url: '../index/index?openid=' + getApp().globalData.openid,
                })
              }
            }
            , 1000);   
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        buttonDisplay: 'none',
        viewDisplay: 'block'
      })
      var that = this;
      that.onGetOpenid();
      var open_id = getApp().globalData.openid;
      that.data.setInter = setInterval(
        function () {
          var numVal = that.data.num - 1;
          that.setData({ num: numVal });
          if (that.data.num == 0) {
            wx.redirectTo({
              url: '../index/index?openid=' + getApp().globalData.openid,
            })
          }
        }
        , 1000);   
    }
  },

  onGetOpenid: function () {
    console.log()
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.userInfo.openId)
        app.globalData.openid = res.result.userInfo.openId
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '.../error/error',
        })
      }
    })
  },

  onUnload: function(){
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  }
})
