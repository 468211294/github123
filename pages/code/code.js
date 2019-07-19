// pages/code/code.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myMsg:{
      headImg:"",
      name:""
    },
    myCode:"",
    bg:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    that.getBg().then((res)=>{
      that.getQrCode();
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取小程序码
  getQrCode:function(){
    const that=this;
    wx.request({
      url: api.host.code,
      method:"get",
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{},
      success(res){
        console.log("获取二维码成功",res)
        res.data.data.wxqrcode = app.globalData.host + res.data.data.wxqrcode
        var data=res.data.data;
        var _myMsg=that.data.myMsg
        _myMsg.headIcon=data.headphoto;
        _myMsg.name=data.username;
        console.log("打印这个二维码连接", data.wxqrcode)
        that.setData({
          myMsg:_myMsg,
          myCode:data.wxqrcode
        })
      },
      fail(res){
        console.log("获取二维码失败", res)
      }
    })

  },
  // 获取背景图片
  getBg:function(){
    const that=this;
    return new Promise(function (resolve, reject) {
    wx.request({
      url: api.host.bg,
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      method:'get',
      data:{
      },
      success(res){
        console.log("获取背景成功",res)
        if(res.data.data==null){
          var data = res.data.data;
          var _bg = "/images/bg.jpg"
          that.setData({
            bg:_bg
          })
        }
        if(!!res.data.data.src){
          var data=res.data.data;
          data.src = getApp().globalData.host + data.src;
          var _bg=data.src;
          that.setData({
            bg:_bg
          })
        }
      },
      fail(res){
        console.log("获取背景失败", res)
      },
      complete(res){
        resolve()
      }
    })
    })
  }
})