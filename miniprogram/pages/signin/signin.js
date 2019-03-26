// ono/signin/signin.js
const util = require("../../utils/util.js")
const db = wx.cloud.database()

Page({

  data: {
    id: null,
    openId: null,
    day: '',
    month: '',
    date: '',
    today: '',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    showCaldenlar: false,
    disabled: true,
    disabledText: ""
  },

  onLoad: function (options) {
    var date = new Date();
    var yearMonth = util.formatYearMonth(date)
      , nowMonthDate = util.getNowMonthDate(date)
      , nowYearDate = util.getNowYearDate(date)
      , month = this.formatMonth(date.getMonth() + 1)
      , year = date.getFullYear()
      , day = this.formatDay(date.getDate())
      , today = `${year}-${month}-${day}`;
    let calendar = this.generateThreeMonths(year, month)
    console.log(options)
    this.setData({
      id: options.id,
      month: month,
      year: year,
      day: day,
      date: yearMonth,
      today: today,
      beSelectDate: today,
      calendar: calendar,
      nowMonthDate: nowMonthDate,
      nowYearDate: nowYearDate
    })
    console.log(this.data)
    this.fetchById()
  },

  onShow: function () {
    var that = this;
    wx.getStorage({
      key: "openid",
      success: function (res) {
        that.setData({
          openid: res.data
        });
      },
    });
  },

  onReady: function() {
    var pageWidth, pageHeight = 0;
    wx.getSystemInfo({
      success(res) {
        pageWidth = res.windowWidth;
      }
    })  

    var x = (pageWidth /750) * 121.25
      , y = (pageWidth / 750) * 80
      , radius = (pageWidth / 750) * 60

    console.log(this.data.id)
    console.log(this.data.year)
    console.log(this.data.month)
    console.log(this.data.day)    
    console.log("------------")
    var now = new Date();
    var arr = util.signDateArray(now) 
    wx.cloud.callFunction({
      name: 'statisticsData',
      data: { 
        arr: arr,
        signid: this.data.id
        },
      success: res => {
        console.log(res)
      },
      fail: err => {
        wx.showToast({
          title: '网络开了小差~',
          icon: 'none',
          duration: 2000
        })
      },
      complete: err => {
        wx.hideLoading();
      }
    })



    // 页面渲染完成  
    this.paintCanvas('canvasArc1', 6, 7, x, y, radius)
    this.paintCanvas('canvasArc2', 22, 31, x, y, radius)
    this.paintCanvas('canvasArc3', 213, 365, x, y, radius)
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
          that.deleteOneSignIn(id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //新增一个打卡记录
  insertOneRecord(){
    this.insertOneSignInRecord();
  },


  paintCanvas(canvasId, signCount, dateCount, x, y, radius) {
    var cxt_arc = wx.createCanvasContext(canvasId);//创建并返回绘图上下文context对象。 
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#d2d2d2');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径 
    cxt_arc.arc(x, y, radius, 0, 2 * Math.PI, false);//设置一个原点(60,40)，半径为30的圆的路径到当前路径 
    cxt_arc.stroke();//对当前路径进行描边 

    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#1EB5A1');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径 
    cxt_arc.arc(x, y, radius, -Math.PI * 1 / 2, 2 * (signCount / dateCount) * Math.PI - Math.PI * 1 / 2, false);
    cxt_arc.stroke();//对当前路径进行描边 

    cxt_arc.draw();
  },

  deleteOneSignIn(id){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'remove',
      data: { signid: id },
      success: res => {
        wx.reLaunch({
          url: '../index/index?openid='+this.data.openId
        })
      },
      fail: err => {
        wx.showToast({
          title: '网络开了小差~',
          icon: 'none',
          duration: 2000
        })
      },
      complete: err => {
        wx.hideLoading();
      }
    })
  },

  fetchById() {
    wx.showLoading({
      title: '加载中',
    })
    console.log(this.data)
    wx.cloud.callFunction({
      name: 'fetchbyid',
      data: { signid: this.data.id },
      success: res => {
        if (res.result.data != null && res.result.data.length > 0) {
          var sign = res.result.data[0];
          wx.setNavigationBarTitle({
            title: sign.name,
          })
          console.log(sign.last_sign_date) 
          var select = false;
          var lastSignDate = null;
          if (sign.last_sign_date != null) {
            lastSignDate = new Date(sign.last_sign_date);
            select = util.formatOtherDate(lastSignDate) == this.data.today;
          } 

          this.setData({
            disabled:  select,
            lastSignDate: lastSignDate,
            disabledText: select ? "今日已打卡" : "完成今日打卡"
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '网络开了小差~',
          icon: 'none',
          duration: 2000
        })
      },
      complete: err => {
        wx.hideLoading()
      }
    })
  },

  insertOneSignInRecord(){
    wx.showLoading({
      title: '加载中',
    })
    var signid = this.data.id;
    var lastSignDate = this.data.lastSignDate == null ? null : this.data.lastSignDate.getTime();
    var nowDate = new Date().getTime();
    wx.cloud.callFunction({
      name: 'insertrecord',
      data: { 
        signid: signid,
        lastSignDate: lastSignDate,
        nowDate: nowDate
      },
      success: res => {
        this.onLoad({id: this.data.id});
        this.onReady();
      },
      fail: err => {
        wx.showToast({
          title: '网络开了小差~',
          icon: 'none',
          duration: 2000
        })
      },
      complete: err => {
        wx.hideLoading()
      }
    })
  },

















  //日历处理方法
  showCaldenlar() {
    this.setData({
      showCaldenlar: !this.data.showCaldenlar
    })
  },

  /**
 * 
 * 左右滑动
 * @param {any} e 
 */
  swiperChange(e) {
    const lastIndex = this.data.swiperIndex
      , currentIndex = e.detail.current
    let flag = false
      , { year, month, day, today, date, calendar, swiperMap } = this.data
      , change = swiperMap[(lastIndex + 2) % 4]
      , time = this.countMonth(year, month)
      , key = 'lastMonth'

    if (lastIndex > currentIndex) {
      lastIndex === 3 && currentIndex === 0
        ? flag = true
        : null
    } else {
      lastIndex === 0 && currentIndex === 3
        ? null
        : flag = true
    }
    if (flag) {
      key = 'nextMonth'
    }

    year = time[key].year
    month = time[key].month
    date = `${year}-${month}`
    day = ''
    if (today.indexOf(date) !== -1) {
      day = today.slice(-2)
    }

    time = this.countMonth(year, month)
    calendar[change] = null
    calendar[change] = this.generateAllDays(time[key].year, time[key].month)

    this.setData({
      swiperIndex: currentIndex,
      //文档上不推荐这么做，但是滑动并不会改变current的值，所以随之而来的计算会出错
      year,
      month,
      date,
      day,
      calendar
    })

    console.log(this.data.calendar)
  },
	/**
	 * 
	 * 点击切换月份，生成本月视图以及临近两个月的视图
	 * @param {any} year 
	 * @param {any} month 
	 * @returns {object} calendar
	 */
  generateThreeMonths(year, month) {
    let { swiperIndex, swiperMap, calendar } = this.data
      , thisKey = swiperMap[swiperIndex]
      , lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1]
      , nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1]
      , time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    return calendar
  },


  //点击某日期
  bindDayTap(e) {
    console.log(e)
    let { month, year } = this.data
      , time = this.countMonth(year, month)
      , tapMon = e.currentTarget.dataset.month
      , day = e.currentTarget.dataset.day
    if (tapMon == time.lastMonth.month) {
      this.changeDate(time.lastMonth.year, time.lastMonth.month)
    } else if (tapMon == time.nextMonth.month) {
      this.changeDate(time.nextMonth.year, time.nextMonth.month)
    } else {
      this.setData({
        day
      })
    }
    let beSelectDate = e.currentTarget.dataset.date;
    this.setData({
      beSelectDate,
      showCaldenlar: false
    })
  },
  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2)
      , year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },
  prevMonth(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    console.log(time.lastMonth.year)
    console.log(time.lastMonth.month)
    console.log(this.data.swiperIndex)
    this.changeDate(time.lastMonth.year, time.lastMonth.month)
    console.log(this.data.swiperIndex)
  },
  nextMonth(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    console.log(this.data.swiperIndex)
    var changeIndex = this.data.swiperIndex == 3 ? 0 : this.data.swiperIndex + 1;

    this.changeDate(time.nextMonth.year, time.nextMonth.month)
  },
	/**
	 * 
	 * 直接改变日期
	 * @param {any} year 
	 * @param {any} month 
	 */
  changeDate(year, month) {
    let { day, today } = this.data
      , calendar = this.generateThreeMonths(year, month)
      , date = `${year}-${month}`
    date.indexOf(today) === -1
      ? day = '01'
      : day = today.slice(-2)

    this.setData({
      calendar,
      day,
      date,
      month,
      year,
    })
  },
	/**
	 * 
	 * 月份处理
	 * @param {any} year 
	 * @param {any} month 
	 * @returns 
	 */
  countMonth(year, month) {
    let lastMonth = {
      month: this.formatMonth(parseInt(month) - 1)
    }
      , thisMonth = {
        year,
        month,
        num: this.getNumOfDays(year, month)
      }
      , nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12
      ? `${parseInt(year) - 1}`
      : year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1
      ? `${parseInt(year) + 1}`
      : year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  currentMonthDays(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    return this.generateDays(year, month, numOfDays)
  },
	/**
	 * 生成上个月应显示的天
	 * @param {any} year 
	 * @param {any} month 
	 * @returns 
	 */
  lastMonthDays(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1)
      , lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12
        ? `${parseInt(year) - 1}`
        : year
      , lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1) //本月1号是周几
      , days = []
    if (startWeek == 7) {
      return days
    }

    const startDay = lastNum - startWeek

    return this.generateDays(lastMonthYear, lastMonth, lastNum, { startNum: startDay, notCurrent: true })
  },
	/**
	 * 生成下个月应显示天
	 * @param {any} year 
	 * @param {any} month
	 * @returns 
	 */
  nextMonthDays(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1)
      , nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1
        ? `${parseInt(year) + 1}`
        : year
      , nextNum = this.getNumOfDays(nextMonthYear, nextMonth)  //下月天数
    let endWeek = this.getWeekOfDate(year, month)						 //本月最后一天是周几
      , days = []
      , daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, { startNum: 1, notCurrent: true })
  },
	/**
	 * 
	 * 生成一个月的日历
	 * @param {any} year 
	 * @param {any} month 
	 * @returns Array
	 */
  generateAllDays(year, month) {
    let lastMonth = this.lastMonthDays(year, month)
      , thisMonth = this.currentMonthDays(year, month)
      , nextMonth = this.nextMonthDays(year, month)

      , days = [].concat([null,null,null,null,null], thisMonth, nextMonth)

    console.log(lastMonth)
    console.log(thisMonth)
    console.log(nextMonth)

    return days
  },
	/**
	 * 
	 * 生成日详情
	 * @param {any} year 
	 * @param {any} month 
	 * @param {any} daysNum 
	 * @param {boolean} [option={
	 * 		startNum:1,
	 * 		grey: false
	 * 	}] 
	 * @returns Array 日期对象数组
	 */
  // 疑似云开发处理部位
  generateDays(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    const weekMap = ['一', '二', '三', '四', '五', '六', '日']
    let days = []
    for (let i = option.startNum; i <= daysNum; i++) {
      let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
      let day = this.formatDay(i)
      days.push({
        date: `${year}-${month}-${day}`,
        //切入字段
        event: false,
        day,
        week,
        month,
        year
      })
    }
    return days
  },
	/**
	 * 
	 * 获取指定月第n天是周几		|
	 * 9月第1天： 2017, 08, 1 |
	 * 9月第31天：2017, 09, 0 
	 * @param {any} year 
	 * @param {any} month 
	 * @param {number} [day=0] 0为最后一天，1为第一天
	 * @returns number 周 1-7, 
	 */
  getWeekOfDate(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';
    return dateOfMonth;
  },
	/**
	 * 
	 * 获取本月天数
	 * @param {number} year 
	 * @param {number} month 
	 * @param {number} [day=0] 0为本月0最后一天的
	 * @returns number 1-31
	 */
  getNumOfDays(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
	/**
	 * 
	 * 月份处理
	 * @param {number} month 
	 * @returns format month MM 1-12
	 */
  formatMonth(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },
  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
  }

})