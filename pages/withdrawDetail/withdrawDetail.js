// pages/withdrawDetail/withdrawDetail.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    limit:100,
    withdrawDetail:[
      // { date: "今天07:25", state: "0", stateText: "提现成功", money: "100.00" },
      // { date: "今天07:25", state: "1", stateText: "待审核", money: "100.00" },
      // { date: "今天07:25", state: "2", stateText: "提现失败", money: "100.00" },
      // { date: "今天07:25", state: "3", stateText: "结算中", money: "100.00" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    that.getWithDrawData();

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
    const that = this;
    console.log("下拉动作触发")
    if(that.data.page>0){
      that.setData({
        page: that.data.page--
      })
      getWithDrawData()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that=this;
    console.log("上拉触底动作触发")
    that.setData({
      page:that.data.page++
    })
    getWithDrawData()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取提现记录
  getWithDrawData:function(){
    const that=this;
    wx.request({
      url: api.host.withDrawRecord,
      method:'get',
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{
        q:{"status":["pending","finished"]},
        page:that.data.page,
        limit:that.data.limit
      },
      success(res){
        console.log("获取提现记录成功",res)
        for(var i=0;i<res.data.data.length;i++){
          res.data.data[i].created_at = new Date(res.data.data[i].created_at).format("yyyy-MM-dd hh:mm:ss")//转换日期格式
          if (res.data.data[i].status=="pending"){
            res.data.data[i].stateText="结算中"
          }
          if (res.data.data[i].status == "finished") {
            res.data.data[i].stateText = "已完成"
          }
        }
        that.setData({
          withdrawDetail:res.data.data

        })
      },
      fail(res){
        console.log("获取提现记录失败", res)
      }
    })

  }
})