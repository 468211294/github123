// pages/myTeam/myTeam.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty:false,
    count:0,
    footer:false,
    tabOptions: [
      { label: "二级", value: "first", select: true },
      { label: "三级", value: "second", select: false }
      // { label: "三级", value: "2", select: false }
    ],
    teams:[
      // { userName: "热爱生活", headImg: "/images/headPic.png", totalMoney: "100.00", orderNum: "100", allCommission: "100", referrer:"我我我",member:"100"},
      // { userName: "热爱生活", headImg: "/images/headPic.png", totalMoney: "100.00", orderNum: "100", allCommission: "100", referrer: "我我我", member: "100" },
      // { userName: "热爱生活", headImg: "/images/headPic.png", totalMoney: "100.00", orderNum: "100", allCommission: "100", referrer: "我我我", member: "100" },
      // { userName: "热爱生活", headImg: "/images/headPic.png", totalMoney: "100.00", orderNum: "100", allCommission: "100", referrer: "我我我", member: "100" },
      // { userName: "热爱生活", headImg: "/images/headPic.png", totalMoney: "100.00", orderNum: "100", allCommission: "100", referrer: "我我我", member: "100" }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that=this;
    that.getTeamsData('first','','','');
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
  // tab切换
  changeTab: function (e) {
    const that = this;
    var state;
    const _tabOptions = that.data.tabOptions;
    console.log("打印这个序号", e.currentTarget);
    for (var i = 0; i < _tabOptions.length; i++) {
      if (e.currentTarget.dataset.index == i) {
        _tabOptions[i].select = true;
        state = _tabOptions[i].value
      } else {
        _tabOptions[i].select = false;
      }
    }
    that.setData({
      tabOptions: _tabOptions
    })
    that.getTeamsData(state)
  },
  // 获取团队数据
  getTeamsData: function (type,limit,page,sort){
    const that = this;
    wx.request({
      url: "https://material.jhlovess.cn/apis/material/distributions/by_client?type="+type,
      method: 'get',
      header: {
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{
        type: type
      },
      success(res){
        console.log("获取团队成功", res)
        var data=res.data.data;
        if(data.length>0){
          that.setData({
            teams:data,
            empty:false,
            footer:true,
            count:res.data.count
          })
        }else{
          console.log("获取团队成功",data)
          that.setData({
            teams: data,
            empty: true,
            footer:false,
            count: res.data.count
          })
        }
      },
      fail(res){
        console.log("获取团队失败", res)
      }
    })
    
  }
})