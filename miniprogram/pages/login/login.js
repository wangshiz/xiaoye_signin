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
    isScope: false
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.showToast({
        title: '网络似乎开了小差～',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this;
  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
           wx.redirectTo({
             url: '../index/index'
           })   
        } else {
          that.setData({
            isScope: true
          })
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

      that.data.setInter = setInterval(
        function () {
          var numVal = that.data.num - 1;
          that.setData({ num: numVal });
          if (that.data.num == 0) {
  
            wx.redirectTo({
              url: '../index/index',
            })
          }
        }
        , 1000);   
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.event.userInfo.openId)
        var openid = res.result.event.userInfo.openId;
        wx.setStorage({//存储到本地
          key: "openid",
          data: openid
        })
        app.globalData.openid = openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '网络似乎开了小差～',
          icon: 'none',
          duration: 2000
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
