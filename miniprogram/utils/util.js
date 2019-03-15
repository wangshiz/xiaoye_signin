const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]



const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}

const formatYearMonth = date =>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1 
  return [year, month].map(formatNumber).join('-')
}

const formatYear = date => {
  return date.getFullYear()
}

const formatMonth = date => {
  return monthArray[date.getMonth()]
}



const formatDay = date => {
  return date.getDate()
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getNowMonthDate = date => {

  return new Date(date.getFullYear(), date.getMonth() + 1,0).getDate()
}

const getNowYearDate = date => {
  var start_date = new Date(date.getFullYear(), 1, 0)
    , end_date = new Date(date.getFullYear() + 1, 1, 0);

  return parseInt((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24))
}

module.exports = {
  formatTime: formatTime,
  formatYear: formatYear,
  formatMonth: formatMonth,
  formatDay: formatDay,
  formatDate: formatDate,
  formatYearMonth: formatYearMonth,
  getNowMonthDate: getNowMonthDate,
  getNowYearDate: getNowYearDate
}
