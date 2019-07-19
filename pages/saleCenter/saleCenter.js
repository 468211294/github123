// pages/saleCenter/saleCenter.js
//获取应用实例
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleMsg:{
      headIcon: "",//头像
      userName: "",//名字
      userAcount: "",//手机号
      commission:"8888.88",//可提现佣金
      commissionDetail:[
        { label:"已提现佣金",value:"0"},
        { label: "提现中佣金", value: "0" }
      ]
    },
    entryMsg:{
      orderCommission:"100.00",
      withdrawDetail:"100.00",
      myMember:"100"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    that.getMsg(function(){
      that.getSaleCenterData()
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
  // 跳转到订单列表
  skip_myOrder:function(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  // 跳转到提现明细
  skip_withdrawDetail:function(){
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  // 跳转到提现
  skip_withDraw:function(){
    wx.navigateTo({
      url: '/pages/withdraw/withdraw',
    })
  },
  // 获取个人信息数据
  getMsg: function (callback) {
    const that = this;
    wx.request({
      url: api.host.code,
      method: 'get',
      header: {
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data: {},
      success(res) {
        console.log("个人中心获取个人信息-成功", res)
        var _peopleMsg = that.data.peopleMsg;
        _peopleMsg.headIcon = res.data.data.headphoto;
        _peopleMsg.userName = res.data.data.username;
        _peopleMsg.userAcount = res.data.data.phone;
        callback()


      },
      fail(res) {
        console.log("个人中心获取个人信息-失败", res)
      }
    })
  },
  //获取分销中心数据
  getSaleCenterData:function(){
    const that=this;
    wx.request({
      url: api.host.saleCenter,
      method:'get',
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{},
      success(res){
        console.log("获取分销统计成功",res);
        var _peopleMsg=that.data.peopleMsg;
        _peopleMsg.commission = res.data.data.undraw;
        _peopleMsg.commissionDetail[0].value=res.data.data.withdrew;
        _peopleMsg.commissionDetail[1].value = res.data.data.withdrawing;
        that.setData({
          peopleMsg: _peopleMsg
        })

      },
      fail(res){
        console.log("获取分销统计失败", res)
      }
    })
  },
  // 跳转到我的团队
  skip_myTeam:function(){
    wx.navigateTo({
      url: '/pages/myTeam/myTeam',
    })
  },
  // 跳转到推广二维码
  skip_code:function(){
    wx.switchTab({
      url: '/pages/code/code',
    })
  }
})