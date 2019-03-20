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

//获取本周的开始日期
const getWeekStartDate = date => {
  const nowDayOfWeek = date.getDay() == 0 ? 7 : date.getDay(); //今天是本周的第几天
  return new Date(date.getFullYear(), date.getMonth(), date.nowDay - nowDayOfWeek + 1);
}

//获取本周的结束日期
const getWeekEndformatDate = date => {
  const nowDayOfWeek = date.getDay() == 0 ? 7 : date.getDay(); //今天是本周的第几天
  return new Date(date.getFullYear(), date.getMonth(), date.nowDay + (6 - nowDayOfWeek + 1));
}

//获取本月的开始日期
const getMonthStartDate = date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

//获取本月的结束日期
const getMonthEndDate = date => {
  const day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  return new Date(date.getFullYear(), date.getMonth(), day);
}


//获取本年的开始日期
const getYearStartDate = date => {
  return new Date(date.getFullYear(), 0, 1);
}

//获取本年的结束日期
const getYearEndDate = date => {
  return new Date(date.getFullYear(), 11, 31);
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
  getWeekStartDate: getWeekStartDate,
  getWeekEndformatDate: getWeekEndformatDate,
  getMonthStartDate: getMonthStartDate,
  getMonthEndDate: getMonthEndDate,
  getYearStartDate: getYearStartDate,
  getYearEndDate: getYearEndDate

}
