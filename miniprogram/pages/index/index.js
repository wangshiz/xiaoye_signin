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
    minusIcon: '../../images/ok.png'
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
        url: '../signin/signin?id='+id+'&openid='+openid,
        success: function (){

        },
        fail: function (){

        },
        complete: function (){
          
        }
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
      , openid = this.data.openid
      , that = this;
    if (name == null || name == ""){
      this.buildFormAnimation(e.currentTarget.dataset.status)
      return;
    }

    db.collection('busi_sign_in').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid: openid,
        name: name,
        begin_date: db.serverDate(),
        cont_count: 0,
        day_count: 0,
        last_sign_date: null        
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        if (res._id != null && res._id != "") {
          db.collection('busi_sign_in').where({
            openid: that.data.openid
          }).field({
            begin_date: true,
            cont_count: true,
            day_count: true,
            _id: true,
            name: true
          })
            .get({
              success(res) {
                if (res.data != null && res.data.length > 0) {
                  for (var i = 0; i < res.data.length; ++i) {
                    var date = util.formatDate(res.data[i].begin_date);
                    res.data[i].begin_date = date
                  }
                  that.setData({
                    signInData: res.data
                  })
                  that.buildFormAnimation(e.currentTarget.dataset.status)
                  setTimeout(function () {
                    wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
                      that.setData({
                        signHeight: rect.height
                      })
                      if (rect.height + 55 > that.data.windowHeight) {
                        that.buildAddAnimation("down")
                      }
                    }).exec();

                  }, 500)
                }
              }
            })
        }
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      openid: options.openid
    })

    var date = new Date()
    this.setData({
      month: util.formatMonth(date),
      day: util.formatDay(date),
      nowDay: util.formatDate(date)
    })
    var windowHeight = 0
      , signHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        // 可使用窗口宽度、高度
        windowHeight = res.windowHeight;
        // 计算主体部分高度,单位为px
      }
    })
    var that = this;
    db.collection('busi_sign_in').where({
      openid: this.data.openid
    }).field({
      begin_date: true,
      cont_count: true,
      day_count: true,
      _id: true,
      name: true,
      last_sign_date: true
    })
      .get({
        success(res) {
          if (res.data != null && res.data.length > 0) {
            for (var i = 0; i < res.data.length; ++i) {
              var date = util.formatDate(res.data[i].begin_date);
              res.data[i].begin_date = date;
              if (res.data[i].last_sign_date != null){
                var lastSignDay = util.formatDate(res.data[i].last_sign_date);
                res.data[i].last_sign_date = lastSignDay;
              }
            }
            that.setData({
              signInData: res.data
            })

            wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
              signHeight = rect.height;
              if (signHeight + 55 <= windowHeight) {
                that.buildAddAnimation("up")
              } else {
                that.buildAddAnimation("down")
              }
              that.setData({
                windowHeight: windowHeight,
                signHeight: signHeight
              })
            }).exec();
          }
        }
      })
  },

  onPullDownRefresh: function () {
    db.collection('busi_sign_in').where({
      openid: this.data.openid
    }).field({
      begin_date: true,
      cont_count: true,
      day_count: true,
      _id: true,
      name: true
    })
      .get({
        success(res) {
          if (res.data != null && res.data.length > 0) {
            for (var i = 0; i < res.data.length; ++i) {
              var date = util.formatDate(res.data[i].begin_date);
              res.data[i].begin_date = date
            }
            that.setData({
              signInData: res.data
            })
            wx.stopPullDownRefresh();

          }
        }
      })
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
})