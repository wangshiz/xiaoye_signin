const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


//YYYY/MM/DD HH:mm:ss
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//2019/03/20
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}

//2019-03-20
const formatOtherDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatYearMonth = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1 
  return [year, month].map(formatNumber).join('-')
}

//获取年份
const formatYear = date => {
  return date.getFullYear()
}

//获取月份
const formatMonth = date => {
  return monthArray[date.getMonth()]
}

//获取日期
const formatDay = date => {
  return date.getDate()
}

//月份处理
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//获取当月有多少天
const getNowMonthDate = date => {
  return new Date(date.getFullYear(), date.getMonth() + 1,0).getDate()
}

//获取今年多少天
const getNowYearDate = date => {
  var start_date = new Date(date.getFullYear(), 1, 0)
    , end_date = new Date(date.getFullYear() + 1, 1, 0);
  return parseInt((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24));
}

// 获取数据
const signDateArray = date => {
  var arr = new Array();
  var nowDayOfWeek = date.getDay() == 0 ? 7 : date.getDay(); //今天是本周的第几天
  var getWeekStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - nowDayOfWeek + 1).getTime()
    , getWeekEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 8 - nowDayOfWeek).getTime()
    , getMonthStartDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
    , getMonthEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime()
    , getYearStartDate = new Date(date.getFullYear(), 0, 1).getTime()
    , getYearEndDate = new Date(date.getFullYear() + 1, 0, 1).getTime();
  arr.push({ "startDate": getWeekStartDate, "endDate": getWeekEndDate})
  arr.push({ "startDate": getMonthStartDate, "endDate": getMonthEndDate })
  arr.push({ "startDate": getYearStartDate, "endDate": getYearEndDate })

  return arr;
}

const getXYRadius = () => {
  var pageWidth = 0
    , pageHeight = 0;
  wx.getSystemInfo({
    success(res) {
      pageWidth = res.windowWidth;
    }
  })  

  var x = (pageWidth / 750) * 121.25
  , y = (pageWidth / 750) * 80
  , radius = (pageWidth / 750) * 60

  return [x, y, radius];
}


module.exports = {
  formatTime: formatTime,
  formatYear: formatYear,
  formatMonth: formatMonth,
  formatDay: formatDay,
  formatDate: formatDate,
  formatYearMonth: formatYearMonth,
  getNowMonthDate: getNowMonthDate,
  getNowYearDate: getNowYearDate,
  formatOtherDate: formatOtherDate,
  signDateArray: signDateArray,
  getXYRadius: getXYRadius
}
