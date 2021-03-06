const app = getApp()
const util = require("../../utils/util.js")
const db = wx.cloud.database()

Page({
  data: {
    showSignStatus: false,
    showAuthorizationStatus: false,
    logged: false,
    takeSession: false,
    month: null,
    day: null,
    nowDay: null,
    signInData: [],
    dateCount: 10,
    showFormStatus: false,
    signAddDisplay: false,
    openid: null,
    isFlash: false,
    length: -1
  },

  //打开form表单
  openForm(e){
    this.buildFormAnimation(e.currentTarget.dataset.status)
  },

  //跳转页面
  goToSignPage(e){
    var id = e.currentTarget.dataset.id;
    if (id != null){
      var openid = this.data.openid;
      wx.navigateTo({
        url: '../signin/signin?id='+id,
      })
    } else {
      //失败
      wx.showToast({
        title: '网络似乎开了小差～',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //添加习惯
  addSign(e){
    var name = e.detail.value.rName
      , that = this;
    if (name == null || name == ""){
      this.buildFormAnimation(e.currentTarget.dataset.status)
      return;
    }
    this.insertOneData(name);
  },

  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          marginBottom: (res.windowWidth / 750) * 110
        })
      }
    })  
    var date = new Date()
    this.setData({
      month: util.formatMonth(date),
      day: util.formatDay(date),
      nowDay: util.formatDate(date)
    })
    //查询
    this.getMySignData("onLoad");
  },

  onShow: function() {
    var that = this;
    wx.getStorage({
      key: "openid",
      success: function (res) {
        that.setData({
          openid: res.data
        });
      },
    });
    //查询
    if (this.data.isFlash) {
      this.getMySignData("onLoad");
      this.setData({
        isFlash: false
      })
    }
  },

  onPullDownRefresh: function () {
    this.onLoad();
  },

  onPageScroll: function (e) {
    var scrollTop = e.scrollTop
      , windowHeight = this.data.windowHeight
      , signHeight = this.data.signHeight;
    if (windowHeight + scrollTop < signHeight + 45) {
      if (this.data.signAddDisplay == false) {
        return;
      }
      this.buildAddAnimation("down")
    } else {
      if (this.data.signAddDisplay == true) {
        return;
      }
      this.buildAddAnimation("up")
    }
  },

  //执行动画效果
  buildFormAnimation(status) {
    //新建一个动画实例
    var animation = wx.createAnimation({
      duration: 250,  //执行时间
      timingFunction: "linear", //动画模式
      delay: 0  //延迟
    })
    this.animation = animation

    animation.translateY(500).scaleX(0).step();
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.translateY(0).scaleX(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (status == "close") {
        this.setData(
          {
            showFormStatus: false,
          }
        );
      }
    }.bind(this), 250)

    // 显示  
    if (status == "open") {
      this.setData(
        {
          showFormStatus: true,
        }
      );
    }
  },

  //执行动画效果
  buildAddAnimation(status) {
    //新建一个动画实例
    var animation = wx.createAnimation({
      duration: 250,  //执行时间
      timingFunction: "linear", //动画模式
      delay: 0  //延迟
    })
    this.animation = animation
    animation.translateY(100).scaleX(0).step();
    this.setData({
      animationAddData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.translateY(0).scaleX(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationAddData: animation
      })

      //关闭  
      if (status == "down") {
        this.setData(
          {
            signAddDisplay: false
          }
        );
      }
    }.bind(this), 250)

    // 显示  
    if (status == "up") {
      this.setData(
        {
          signAddDisplay: true
        }
      );
    }
  },


  getMySignData: function (scenes) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'fetch',
      success: res => {
        wx.hideLoading()
        if (res.result.data != null) {
          var arr = res.result.data;
          for (var i = 0; i < arr.length; ++i) {
            var beginDate = new Date(arr[i].begin_date);
            var date = util.formatDate(beginDate);
            arr[i].begin_date = date;
            if (arr[i].last_sign_date != null){
              var lastSignDate = new Date(arr[i].last_sign_date);
              var lastSignDay = util.formatDate(lastSignDate);
              arr[i].last_sign_date = lastSignDay;
            }
          }
          that.setData({
            signInData: arr,
            length: arr.length
          })
          
          if (scenes == "onLoad"){
            var signHeight
              , windowHeight = 0;
            wx.getSystemInfo({
              success: function (res) {
                // 可使用窗口宽度、高度
                windowHeight = res.windowHeight;
                // 计算主体部分高度,单位为px
              }
            })
            wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
              signHeight = rect.height;
              if (signHeight + that.data.marginBottom <= windowHeight) {
                that.buildAddAnimation("up")
              } else {
                that.buildAddAnimation("down")
              }
              that.setData({
                windowHeight: windowHeight,
                signHeight: signHeight
              })
            }).exec();
            wx.stopPullDownRefresh();
          }

          if (scenes == "add"){
            that.buildFormAnimation('close')
            wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
              that.setData({
                signHeight: rect.height
              })  
              if (rect.height + that.data.marginBottom > that.data.windowHeight) {
                that.buildAddAnimation("down")
              }
            }).exec();
          }
        }
      },
      fail: err => {
        wx.showToast({
          title: '网络开了小差~',
          icon: 'none',
          duration: 2000
        })
      },
    })
  },

  insertOneData(name){
    wx.showLoading({
      title: '添加中',
      mask: true
    })
    var nowDate = new Date().getTime()
    wx.cloud.callFunction({
      name: 'insert',
      data: {
        name: name,
        nowDate: nowDate,
        dateCount: this.data.dateCount
      },
      success: res => {
        if (res.result.pass == 0) {
          wx.showToast({
            title: '您已满添加的次数',
            icon: 'none',
            duration: 2000
          })
        }
        if (res.result.pass == 1) {
          wx.showToast({
            title: '您已添加该类习惯',
            icon: 'none',
            duration: 2000
          })
        }
        if (res.result.pass == 2) {
          this.getMySignData("add");
        }
      },
      fail: err => {
        wx.showToast({
          title: '网络开了小差~',
          icon: 'none',
          duration: 2000
        })
      },
    })
  }
})