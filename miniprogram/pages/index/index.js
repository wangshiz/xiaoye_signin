const app = getApp()
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSignStatus: false,
    showAuthorizationStatus: false,
    logged: false,
    takeSession: false,
    month: null,
    day: null,
    signInData: [
      { id: 1, name: '健身', date: '2017/01/02', dayCount: '20', contCount: '7' },
      { id: 2, name: '早起', date: '2017/01/02', dayCount: '31', contCount: '9' },
      { id: 3, name: '早睡', date: '2017/01/02', dayCount: '14', contCount: '3' },
      { id: 4, name: '看微信小程序', date: '2017/01/02', dayCount: '17', contCount: '7' },
      { id: 5, name: '吃早饭', date: '2017/01/02', dayCount: '17', contCount: '7' },
    ],
    dateCount: 10,
    showFormStatus: false,
    signAddDisplay: false,
  },
  //打开form表单
  openForm(e){
    console.log(e.currentTarget.dataset.status)
    this.buildFormAnimation(e.currentTarget.dataset.status)
  },

  //跳转页面
  goToSignPage(e){
    var id = e.currentTarget.dataset.id;

    if (id != null && id > 0){
      wx.navigateTo({
        url: '../signin/signin?id='+id,
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
  //删除习惯
  signDelete(e){
    var id = e.currentTarget.dataset.id
      , arrNo
      , that = this;
    wx.showModal({
      title: '',
      content: '确定要放弃吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log(id)
          var array = that.data.signInData;
          for (var i = 0; i < array.length; ++i) {
            var signId = array[i].id;
            if (id == signId) {
              arrNo = i
              continue;
            }
          }
          if (arrNo != null){
            array.splice(arrNo, 1);
          }

          that.setData({
            signInData: array,
          })
          setTimeout(function(){
            if (that.data.signHeight > that.data.windowHeight) {
              that.buildAddAnimation("up")
            }
            wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
              that.setData({
                signHeight: rect.height
              })
            }).exec();
          }, 500)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //添加习惯
  addSign(e){
    var name = e.detail.value.rName
      , array = this.data.signInData
      , date = this.data.nowDate;
    if (name == null || name == ""){
      this.buildFormAnimation(e.currentTarget.dataset.status)
      return;
    }

    var id = array[array.length - 1].id + 1;
    var newSign = { id: id, name: name, date: date, dayCount: '0', contCount: '0' };
    this.setData({
      signInData: this.data.signInData.concat(newSign)
    });
    this.buildFormAnimation(e.currentTarget.dataset.status)
    var that = this;
    setTimeout(function () {
      if (that.data.signHeight > that.data.windowHeight) {
        that.buildAddAnimation("down")
      }
      wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
        that.setData({
          signHeight: rect.height
        })
      }).exec();
    }, 500)


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    this.setData({
      month: util.formatMonth(date),
      day: util.formatDay(date),
      nowDate: util.formatDate(date)
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
    wx.createSelectorQuery().select('#sign').boundingClientRect(function (rect) {
      signHeight = rect.height;
      if (signHeight <= windowHeight) {
        that.buildAddAnimation("up")
      } else {
        that.buildAddAnimation("down")
      }
      that.setData({
        windowHeight: windowHeight,
        signHeight: signHeight
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function(){
      wx.stopPullDownRefresh()
    }, 3000)
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
            showFormStatus: false
          }
        );
      }
    }.bind(this), 250)

    // 显示  
    if (status == "open") {
      this.setData(
        {
          showFormStatus: true
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
  }

})