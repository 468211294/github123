// pages/paySuccess/paySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"支付成功,待厂家备货",
    prompt: "您的订单已成功提交,我们将尽快为您准备货物, 感谢您的支持~"

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
  
  skip_index:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  skip_myOrder:function(){
    wx.redirectTo({
      url: '/pages/myOrder/myOrder',
    })
  }

})