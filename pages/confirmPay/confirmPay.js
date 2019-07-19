// pages/confirmPay/confirmPay.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:"",//合计总价
    totalRebate: "",//总返利
    carNumber:""//车牌号


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
    const orderGoods = wx.getStorageSync('orderGoods')
    that.setData({
      goods:orderGoods,
      unitlogo: wx.getStorageSync('unitlogo'),
      unitname: wx.getStorageSync('unitname'),
      unitid: wx.getStorageSync('companyid')
    })
    that.sum(that.data.goods)
    // 如果存在车牌号缓存,则获取缓存车牌号
    if (!!wx.getStorageSync('carnumber')&&wx.getStorageSync('carnumber')!=""){
      that.setData({
        carNumber: wx.getStorageSync('carnumber')
      })
    }
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
  // 减掉数量
  reduceNum: function (e) {
    const that = this;
    console.log("执行减1")
    const idx = e.currentTarget.dataset.idx;
    const _goods = that.data.goods;
    if (_goods[idx].number > 0) {
      _goods[idx].number--
      _goods[idx].totalCommission = (((_goods[idx].commission) * (_goods[idx].number)).toFixed(2)) * _goods[idx].price;//计算佣金
      that.setData({
        goods: _goods
      })
      that.sum(that.data.goods)
    } else {
      that.setData({
        prompt: true,
        promptText: "选购数量不能低于0"
      })
      setTimeout(function () {
        that.setData({
          prompt: false,
          promptText: ""
        })
      }, 2000)
    }
  },
  // 增加数量
  addNum: function (e) {
    const that = this;
    const idx = e.currentTarget.dataset.idx;
    const _goods = that.data.goods;
    _goods[idx].number++;
    _goods[idx].totalCommission = (((_goods[idx].commission) * (_goods[idx].number)).toFixed(2)) * _goods[idx].price;//计算佣金
    that.setData({
      goods: _goods
    })
    that.sum(that.data.goods)
  },
  //勾选的金额统计
  sum: function (arr) {
    const that = this;
    var totalMoney = 0;
    var totalCommission = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].checked == true) {
        var price = (arr[i].price) * (arr[i].number)
        // var commission = (arr[i].commission) * (arr[i].number)//当前商品总佣金
        var commission = (arr[i].totalCommission)//当前商品总佣金
        totalMoney += price;
        totalCommission += commission
      }
    }
    that.setData({
      totalPrice: totalMoney.toFixed(2),
      totalRebate: totalCommission.toFixed(2)
    })


  },
  // 车牌号正则表达式
  isVehicleNumber:function (vehicleNumber) {
    var result = false;
    if(vehicleNumber.length == 7){
      var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      result = express.test(vehicleNumber);
    }
    return result;
  },
  confirm:function(){
    const that=this;
    if (that.data.carNumber != "" && that.isVehicleNumber(that.data.carNumber)){
      that.confirmPay(function () {
        that.confirmApi(that.data.goodsArr).then((res) => {
          that.requestPayment(res)
        })
      })
    }else{
      wx.showToast({
        title: '请输入正确车牌号',
        icon:'none'
      })
    }
    
  },
  // 确认支付
  confirmPay:function(callback){
    const that=this;
    console.log("打印这个订单列表数组",that.data.goods)
    for (var i = 0; i < that.data.goods.length;i++){
      if (that.data.goods[i].number==0){
        wx.showToast({
          title: '商品数量必须大于0',
          icon: 'none',
          duration: 1500
        })
        return false
      }else{
        var _goods = that.data.goods;
        var _goodsArr = [];//用于保存新数组
        for (var i = 0; i < _goods.length; i++) {
          var json = {};
          json.productID = _goods[i]._id;
          json.typeID = _goods[i].typeId;
          json.amount = _goods[i].number;
          _goodsArr.push(json);
          that.setData({
            goodsArr: _goodsArr
          })
        }
        callback()
      }
    }

    
    

    // wx.navigateTo({
    //   url: '/pages/paySuccess/paySuccess',
    // })  
  },
  confirmApi: function (productArr) {
    const that=this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: api.host.placeOrder,
        method: 'post',
        header: {
          'content-type': 'application/json',// 默认值
          'Cookie': (wx.getStorageSync('userMsg'))
        },
        data: {
          shop: wx.getStorageSync('shop'),
          products: productArr,
          remarks: "",
          plate:that.data.carNumber
        },
        success(res) {
          console.log("确认支付成功", res)
          resolve(res)
            // wx.navigateTo({
            //   url: '/pages/paySuccess/paySuccess',
            // })
        },
        fail(res) {
          console.log("确认支付失败", res)
        }

      })
    })
  },
  // 输入车牌号
  inputCarNumber:function(e){
    const that=this;
    console.log("打印这个输入的车牌号",e.detail);
    that.setData({
      carNumber:e.detail.value
    })

  },
  // 发起微信支付wx.requestPayment
  requestPayment: function (obj) {
    const that=this;
    console.log("打印这个obj",obj)
    var data = obj.data.data;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success(res) {
        console.log("支付成功",res)
        wx.navigateTo({
              url: '/pages/paySuccess/paySuccess',
            })
      },
      fail(res) {
        console.log("支付失败", res)
        wx.showToast({
          title: '支付失败',
          icon: '',
          duration: 2000
        })
        return
      },
      complete(){
        wx.setStorageSync('carnumber', that.data.carNumber);//缓存所提交的车牌号
      }

    })
  }
})