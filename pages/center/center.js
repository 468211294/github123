// pages/center/center.js
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
      headIcon:"/images/headImg.png",
      userName:"二狗子",
      userAcount:"12345678",
      data:[
        {label:"订单",value:""},
        {label:"会员",value:""},
        {label: "佣金", value: ""}
      ]
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getMsg(function(){
      that.getSaleData();
    })
    
    // const that=this;
    // that.getSaleData();
    // const that=this;
    // var _peopleMsg={};
    // _peopleMsg.headIcon = wx.getStorageSync('openMsg').avatarUrl;
    // _peopleMsg.userName = wx.getStorageSync('openMsg').nickName;
    // that.setData({
    //   peopleMsg.
    // })

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
  // 获取个人信息数据
  getMsg:function(callback){
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
        _peopleMsg.headIcon=res.data.data.headphoto;
        _peopleMsg.userName = res.data.data.username;
        _peopleMsg.userAcount = res.data.data.phone;
        callback()
        

      },
      fail(res) {
        console.log("个人中心获取个人信息-失败", res)
      }
    })
  },
  // 获取分销数据
  getSaleData:function(){
    const that=this;
    wx.request({
      url: api.host.saleData,
      method:'get',
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{},
      success(res){
        console.log("个人中心获取统计数据-成功",res)
        var _peopleMsg = that.data.peopleMsg;
        // _peopleMsg.headIcon = wx.getStorageSync('openMsg')['avatarUrl']
        _peopleMsg.data[0].value=res.data.data[0];
        _peopleMsg.data[1].value = res.data.data[1];
        _peopleMsg.data[2].value = res.data.data[2];
        that.setData({
          peopleMsg: _peopleMsg
        })

      },
      fail(res){
        console.log("个人中心获取统计数据-失败", res)
      }
    })
  },
  // 跳转到我的订单
  skip_myOrder:function(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  // 跳转到分销中心
  skip_saleCenter:function(){
    wx.navigateTo({
      url: '/pages/saleCenter/saleCenter',
    })
  },
  // 跳转到我的团队
  skip_myTeam:function(){
    wx.navigateTo({
      url: '/pages/myTeam/myTeam',
    })
  },
  //跳转到提现明细
  skip_withdrawDetail:function(){
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  // 跳转到修改个人信息页面
  skip_form:function(){
    wx.navigateTo({
      url: '/pages/form/form',
    })
  }
})