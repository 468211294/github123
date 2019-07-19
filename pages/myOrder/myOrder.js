// pages/myOrder/myOrder.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
// const date = require('../../utils/date.js');
let QRCode = require("../../utils/qrCode.js").default;
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
      dialog:false,
      empty:false,
      show:false,
      scroll:true,
      tabOptions:[
        { label: "未支付", state: "unpaid", select: true},
        { label: "待提货", state:"paid",select:false},
        { label: "已提货", state:"finished",select:false}
      ],
      orderArr:[]
      

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let sysinfo = wx.getSystemInfoSync();
      console.log(sysinfo)
      let qrcode = new QRCode('qrcode', {
        text: '',
        //获取手机屏幕的宽和长  进行比例换算
        width:150,
        height:150,
        // width: sysinfo.windowWidth * 660 / 750,
        // height: sysinfo.windowWidth * 660 / 750,
        //二维码底色尽量为白色， 图案为深色
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.correctLevel.H
      });
      //将一个局部变量共享
      this.QR = qrcode;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      const that=this;
      that.getOrderData();
      
      // that.getOrderData('unpaid')
      // wx.request({
      //   url: api.host.orderlist + "unpaid",
      //   method: 'get',
      //   header: {
      //     'content-type': 'application/json',
      //     'Cookie': (wx.getStorageSync('userMsg'))
      //   },
      //   data: {},
      //   success(res) {
      //     console.log("获取订单成功",res)
      //     var data = res.data.data
      //     // 如果存在订单
      //     if(data.length>0){
      //       for (var i = 0; i < data.length; i++) {
      //         utils.publicMethod.transformUrl(data[i].products, 'cover')//转换图片地址
      //         data[i].created_at = new Date(data[i].created_at).format("yyyy-MM-dd hh:mm:ss")//转换日期格式
      //       }
      //       that.setData({
      //         orderArr: data,
      //         empty: false
      //       })
      //       console.log("打印这个订单列表", that.data.orderArr)
      //     }else{//显示空图标
      //       that.setData({
      //         orderArr: data,
      //         empty:true
      //       })
      //     }
          
          
      //   },
      //   fail(res) {
      //     console.log("获取订单失败", res)
      //   }

      // })

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
    // 获取订单数据
    getOrderData:function(){
      const that=this;
      // const state
      for (var i = 0; i < that.data.tabOptions.length;i++){
        if (that.data.tabOptions[i].select == true) {//获取tab选项中所选中的状态
          var state = that.data.tabOptions[i].state;
          wx.request({
            url: api.host.orderlist + state,
            method: 'get',
            header: {
              'content-type': 'application/json',
              'Cookie': (wx.getStorageSync('userMsg'))
            },
            data: {},
            success(res) {
              console.log("获取订单成功", res)
              var data = res.data.data
              // 如果存在订单
              if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                  utils.publicMethod.transformUrl(data[i].products, 'cover')//转换图片地址
                  data[i].created_at = new Date(data[i].created_at).format("yyyy-MM-dd hh:mm:ss")//转换日期格式
                }
                that.setData({
                  orderArr: data,
                  empty: false
                })
                console.log("打印这个订单列表", that.data.orderArr)
              } else {//显示空图标
                that.setData({
                  orderArr: data,
                  empty: true
                })
              }


            },
            fail(res) {
              console.log("获取订单失败", res)
            }

          })

        }else{

        }
      }
      
    },

    // tab切换
    changeTab:function(e){
      const that=this;
      const _tabOptions=that.data.tabOptions;
      const state = e.currentTarget.dataset.state;
      console.log("打印这个序号", e.currentTarget);
      for (var i = 0; i < _tabOptions.length;i++){
        if(e.currentTarget.dataset.index==i){
          _tabOptions[i].select = true;
        }else{
          _tabOptions[i].select = false;
        }
      }
      that.setData({
        tabOptions: _tabOptions
      })
      that.getOrderData();
      // wx.request({
      //   url: api.host.orderlist+state,
      //   method:'get',
      //   header:{
      //     'content-type': 'application/json',
      //     'Cookie': (wx.getStorageSync('userMsg'))
      //   },
      //   data:{},
      //   success(res){
      //     var data=res.data.data
      //     if(data.length>0){
      //       for (var i = 0; i < data.length; i++) {
      //         utils.publicMethod.transformUrl(data[i].products, 'cover');
      //         data[i].created_at = new Date(data[i].created_at).format("yyyy-MM-dd hh:mm:ss")
      //       }
      //       that.setData({
      //         orderArr: data,
      //         empty: false
      //       })
      //       console.log("打印这个订单列表", that.data.orderArr)
      //     }else{
      //       that.setData({
      //         orderArr: data,
      //         empty: true
      //       })
      //     }
          
      //   },
      //   fail(res){

      //   }

      // })
    },
    // 点击生成二维码
    createQRcode:function(e){
      const that=this;
      that.setData({
        show:true
      })
      var orderId=e.currentTarget.dataset.orderid
      that.QR.clear();
      that.QR.makeCode(orderId); 
    },
    // 关闭遮罩层,二维码
    closeMask:function(){
      const that=this;
      that.setData({
        show:false
      })
    },
    // 日期格式转换
    // 去支付
    toPay:function(e){
      const that=this;
      var _id = e.currentTarget.dataset.orderid;
      that.confirmApi(_id).then((res)=>{
        that.requestPayment(res)

      })
      
    },
    // 调用支付接口
    confirmApi: function (ordId) {
      return new Promise(function (resolve, reject) {
        wx.request({
          url: api.host.orderPay(ordId),
          method: 'get',
          header: {
            'content-type': 'application/json',// 默认值
            'Cookie': (wx.getStorageSync('userMsg'))
          },
          data: {
            _id: ordId
          },
          success(res) {
            console.log("确认支付成功", res)
            resolve(res)
          },
          fail(res) {
            console.log("确认支付失败", res)
          }

        })
      })

    },
  // 发起微信支付wx.requestPayment
  requestPayment: function (obj) {
    console.log("打印这个obj", obj)
    var data = obj.data.data;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success(res) {
        console.log("支付成功", res)
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
      }

    })
  },
  // 打开确认收货弹窗
  openDialog:function(e){
    const that=this;
    wx.setStorageSync('orderid', e.currentTarget.dataset.orderid);
    that.setData({
      dialog:true
    })
  },
  // 确认收货
  confirm:function(){
    const that = this;
    that.setData({
      dialog: false
    })
    that.getConfirmApi(wx.getStorageSync('orderid'))
  },
  // 取消确认收货
  cancel:function(){
    const that = this;
    that.setData({
      dialog: false
    })
  },
  // 调用确认订单接口
  getConfirmApi:function(id){
    const that=this;
    wx.request({
      url: api.host.confirmReceiving(id),
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      method:'put',
      data:{

      },
      success(res){
        console.log("确认收货成功",res)
        that.getOrderData();//刷新订单列表
      },
      fail(res){
        console.log("确认收货失败", res)
      }
    })
  }



    
})