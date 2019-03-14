// ono/signin/signin.js
const util = require("../../utils/util.js")
const db = wx.cloud.database()

Page({

  data: {
    id: null,
    openId: null,
    week: ['日', '一', '二', '三', '四', '五', '六'],
  },

  onLoad: function (options) {
    var date = new Date();
    var yearMonth = util.formatYearMonth(date)
    console.log(yearMonth);
    this.setData({
      id: options.id,
      openId: options.openid,
      yearMonth: yearMonth
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

    console.log(x)
    console.log(y)
    console.log(radius)

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
  }
})