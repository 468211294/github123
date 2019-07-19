// pages/withdrawApprication/withdrawApprication.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "提交成功！等待审核~",
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
    // wx.redirectTo({
    //   url: '/pages/index/index'
    // })
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
  skip_withdrawDetail:function(){
    wx.navigateTo({
      url: '/pages/withdrawDetail/withdrawDetail',
    })
  },
  skip_saleCenter: function () {
    wx.redirectTo({
      url: '/pages/saleCenter/saleCenter',
    })
  }
})