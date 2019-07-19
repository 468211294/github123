// pages/withdraw/withdraw.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headMsg:{
      remaining:0,//账户余额
      remainingToday:"1000"
    },
    payOptions:[//支付选项
      { imgUrl: "/images/wechat_icon.png", label: "微信", value: "wxpay",select:false },
      { imgUrl: "/images/alipay_icon.png", label: "支付宝", value: "alipay", select: false},
      { imgUrl: "/images/bank_icon.png", label: "银联", value: "bank", select: true }
    ],
    money:0,
    payWays:"",//支付方式
    alipay:false,
    wxpay:false,
    bank:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getSaleCenterData();//获取当前账户余额
    that.initForm();//初始化表单

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
  // 选择支付方式
  selectPay:function(e){
    const that=this;
    const idx = e.currentTarget.dataset.index;
    const payment = e.currentTarget.dataset.payment;
    console.log(idx);
    var _payOptions = that.data.payOptions;
    for (var i = 0; i < _payOptions.length;i++){
      if(i==idx){
        _payOptions[i].select=true;
      }else{
        _payOptions[i].select = false;
      }
    }
    that.setData({
      payOptions:_payOptions,
      payWays: payment
    })
    that.showForm();
  },
  //获取分销中心数据
  getSaleCenterData: function () {
    const that = this;
    wx.request({
      url: api.host.saleCenter,
      method: 'get',
      header: {
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data: {},
      success(res) {
        console.log("获取分销统计成功", res);
        var _headMsg = that.data.headMsg;
        _headMsg.remaining = res.data.data.undraw;
        
        that.setData({
          headMsg: _headMsg
        })

      },
      fail(res) {
        console.log("获取分销统计失败", res)
      }
    })
  },
  // 初始化表单
  initForm:function(){
    const that=this;
    for (var i = 0; i < that.data.payOptions.length;i++){
      if (that.data.payOptions[i].select==true){
        that.setData({
          payWays: that.data.payOptions[i].value
        })
      }
    }
    that.showForm();
  },
  // 提交提现申请
  formSubmit:function(e){
    const that=this;
    console.log(e.detail.value)
    // 当账户余额大于等于要提现的金额并且要提现的金额大于0时,触发提交提现申请接口
    if (that.data.money > 0 && that.data.headMsg.remaining >= that.data.money){
      wx.request({
        url: api.host.withDraw,
        method: 'post',
        header: {
          'content-type': 'application/json',// 默认值
          'Cookie': (wx.getStorageSync('userMsg'))
        },
        data: {
          amount: that.data.money,
          payment: {
            account: that.data.payWays == 'bank' ? e.detail.value.bankCardNumber : that.data.payWays == 'alipay' ? e.detail.value.alipayAccount : '',
            name: that.data.payWays == 'bank' ? e.detail.value.bankAccountName : that.data.payWays == 'alipay' ? e.detail.value.alipayName : '',
            payment: that.data.payWays
          }
        },
        success(res) {
          console.log("提交申请成功", res)
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          // let pages = getCurrentPages();//当前页面栈
          // let prevPage = pages[pages.length - 2];//上一页面
          // console.log("打印页面栈",pages)
          // ======

          

          // ======
          

          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/withdrawApprication/withdrawApprication',
            })
          }, 2000)
        },
        fail(res) {
          console.log("提交申请失败", res)
        }
      })
    }else{
      if(that.data.money==0){
        wx.showToast({
          title: '提现金额须大于0',
          icon: 'none',
          duration: 2000
        })
      }
    }
    
  },
  // 判断payWays是什么支付方式
  showForm:function(){
    const that=this;
    switch(that.data.payWays){
      case "bank":
        that.setData({
          bank:true,
          alipay: false,
          wxpay: false
        })
        break;
      case "alipay":
        that.setData({
          bank: false,
          alipay: true,
          wxpay: false
        })
        break;
      case "wxpay":
        that.setData({
          bank: false,
          alipay: false,
          wxpay: true
        })
        break;

    }
  },
  // 输入提现金额
  inputMonth:function(e){
    const that=this;
    console.log(e.detail.value)
    that.setData({
      money: e.detail.value
    })
  },
})