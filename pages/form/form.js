// pages/form/form.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    items:[
      { label: "男", value: "male", checked:false },
      { label: "女", value: "female", checked:false }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    that.getUserMsg()

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
  // 提交表单信息
  formSubmit:function(e){
    console.log("打印提交的表单信息",e.detail.value)
  },
  // 获取用户信息
  getUserMsg:function(){
    const that=this;
    wx.request({
      url: api.host.code,
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      method:'get',
      data:{},
      success(res){
          var data=res.data.data;
          console.log("获取个人信息成功",res)
          var _items=that.data.items;
        for (var i = 0; i < _items.length;i++){
          if (_items[i].value==res.data.data.sex){
            _items[i].checked=true;
          }
        }
          that.setData({
            name:data.username,
            phone:data.phone,
            items:_items
          })
      },
      fail(res){
        console.log("获取个人信息失败", res)
      },
      complate(res){

      }
    })
  },
  // 提交表单信息
  formSubmit:function(e){
    console.log("打印信息",e.detail.value)
    var data = e.detail.value;
    console.log("打印名字",data.name)
    wx.request({
      url: api.host.updateMsg,
      method:'put',
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{
        username: data.name,
        phone:data.phone,
        sex:data.sex
      },
      success(res){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          complete:function(){
            setTimeout(function(){
              // var page = getCurrentPages()
              // var beforePage = page[page.length - 2];//获取上一个页面实例对象
              // console.log("打印页面栈",page);
              // console.log("打印上一个页面", beforePage);
              wx.navigateBack({
                delta: 1
              })
            },1000)
            
          }
        })
    
      }

    })
  }
})