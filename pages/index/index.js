//index.js
//获取应用实例
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    code:"",
    show:false,//授权弹窗隐藏/显示,默认隐藏
    banner:{
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration:500,
      imgUrls: [
        { url: '/images/banner1.jpg'},
        { url:'/images/banner2.jpg' },
        { url: '/images/banner3.jpg' },
      ],
    },
    scrollMsg:"",
    marquee: 0,   //每次移动X坐标
    windowWidth: 0,     //小程序宽度
    maxScroll: 300      ,//文本移动至最左侧宽度及文本宽度
    goods:[],
    companys:[],
    aboutUs:{
      content: "",
      address:"",
      phone:""

      }
  },
  //事件处理函数
  onLoad: function (options) {
    const t=this;
    t.update();//检查更新
    wx.hideTabBar()
    // -----实时滚动
    // var query = wx.createSelectorQuery();
    // console.log("111111111111")
    // query.select('.r_rowScroll').boundingClientRect(function (res) {
    //   console.log("++++", res.width)
    // }).exec()
   

    // var w = wx.getSystemInfoSync().windowWidth;
    // console.log("打印这个w",w)
    // var str = '滚动文本信息';
    // t.setData({
    //   marquee: w
    // });
    // t.data.maxScroll = str.length * 15 + 4;
    // t.data.windowWidth = w;
    // t.scrolltxt();
    // ----实时滚动结束
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    const that=this;
    const userMsg = wx.getStorageSync('userMsg')
    console.log("打印缓存", !!userMsg);
    if (!!userMsg){
      console.log("打印!!userMsg", !!userMsg)
      that.getBanner();
      that.getScrollMsg();//获取滚动信息
      that.getNewGoods();//获取新品推荐
      that.getManufacturers();//获取厂家列表
      that.getAboutUs();//获取关于我们信息
    }else{
      that.wxlogin()
    }
    
   //获取用户当前的授权列表状态。
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        // 如果用户已授权公开信息
        if (res.authSetting["scope.userInfo"]==true){
          // 显示底部导航
          wx.showTabBar();
          that.setData({
            show:false
          })
        }else{
          wx.hideTabBar()
          that.setData({
            show: true
          })

        }
      }
    })

    // 获取轮播图
    // setTimeout(function(){
    //   that.getBanner();
    //   that.getScrollMsg();//获取滚动信息
    //   that.getNewGoods();//获取新品推荐
    //   that.getManufacturers();//获取厂家列表
    //   that.getAboutUs();//获取关于我们信息
    // },3000)
    

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
  // 轮播滚动
  scrolltxt: function () {
    var t = this;
    var d = t.data;

    var interval = setInterval(function () {
      var next = d.marquee - 1; //每次移动距离
      if (next < 0 && Math.abs(next) > d.maxScroll) {
        next = d.windowWidth;
        clearInterval(interval);
        t.scrolltxt();
      }
      t.setData({
        marquee: next
      });
    }, 50);
  },
  // 获取用户公开信息的回调函数
  onGotUserInfo:function(e){
    const that=this;
    // return new Promise(function (resolve, reject) {
    console.log("获取信息",e.detail)
    console.log(e.detail.rawData)
    // 如果用户允许授权公开信息
    if (e.detail.errMsg =="getUserInfo:ok"){
      // 将用户数据传给接口
      // 将用户公开信息存入缓存
      wx.setStorageSync('openMsg',JSON.parse(e.detail.rawData))
      console.log("打印这个公开信息缓存", wx.getStorageSync('openMsg'))
      that.setData({
        show: false
      })
      wx.showTabBar();
      that.userLogin(function(){
        that.getBanner();
        that.getScrollMsg();//获取滚动信息
        that.getNewGoods();//获取新品推荐
        that.getManufacturers();//获取厂家列表
        that.getAboutUs();//获取关于我们信息
      });
      
    }
    // })
  },
  // 跳转到订单页面
  skip_myOrder:function(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
      complete:function(){
        var a = getCurrentPages()
        console.log("111111111", a)
      }
    })   
  },
  // 获取banner数据
  getBanner:function(){
    const that=this;
    wx.request({
      url: api.host.banner,
      data: {
       
      },
      header: {
        'content-type': 'application/json',// 默认值
        'Cookie':(wx.getStorageSync('userMsg'))
      },
      success(res) {
        console.log("轮播图片-接口传回数据",res.data)
        const bannerImgArr = res.data.data;
        for (var i = 0; i < bannerImgArr.length;i++){
          bannerImgArr[i].src = app.globalData.host + bannerImgArr[i].src;
        }
        const _bannerImg = bannerImgArr;
        that.setData({
          bannerImg: _bannerImg
        })
        
      }
    })
  },
  // wx.login
  wxlogin:function(){
    const that=this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log("登录成功",res.code)
          that.code=res.code
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // 调用userlogin接口
  userLogin:function(callback){
    const that=this;
    // console.log(wx.getStorageSync('openMsg'))
    // var openMsg = wx.getStorageSync('openMsg');
    // openMsg = encodeURIComponent(JSON.stringify(openMsg))
    // openMsg = decodeURIComponent(openMsg);
    // var json = JSON.parse(openMsg)
    // console.log("对象",json);
    // console.log("111111111",json[''])
    console.log("打印缓存微信昵称",wx.getStorageSync('openMsg').nickName)
    wx.request({
      url: api.host.login, 
      header: {
        'content-type': 'application/json' // 默认值
        // 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method:'post',
      data: {
        js_code: that.code,
        username: wx.getStorageSync('openMsg').nickName,
        phone: "",
        country: wx.getStorageSync('openMsg').country,
        province: wx.getStorageSync('openMsg').province,
        city: wx.getStorageSync('openMsg').city,
        address: "kljlkjlkj",
        email: "123456@qq.com",
        introduction: "11111",
        superior: "",
        headphoto: wx.getStorageSync('openMsg').avatarUrl,
        sex: wx.getStorageSync('openMsg').gender == 0 ? 'unknown' : wx.getStorageSync('openMsg').gender==1?'male':'female'
      },
      success(res) {
        console.log("打印成功信息",res);
        wx.setStorageSync('code_id', res.data.data._id)
        // console.log("------------", res.header.Set-Cookie)
        console.log("===========",res.header);
        var cookiesString = res.header["Set-Cookie"];
        var jehadsama_material = cookiesString.substring(
          cookiesString.indexOf('jehadsama_material'),
          cookiesString.indexOf(';'),
        );
        var zssIndex = cookiesString.indexOf('zss_material');
        var zss_material = cookiesString.substring(
          zssIndex,
          cookiesString.indexOf(';', zssIndex),
        );
        var a = jehadsama_material + ';' + zss_material;
        
        wx.setStorageSync('userMsg', a );//将cookies保存到缓存userMsg
        callback();
        // that.getBanner();
        
      },
      fail(res){
        console.log("打印失败信息",res)
      }
    })


  },
  // 获取实时交易数据
  getScrollMsg:function(){
    const that=this;
    wx.request({
      url: api.host.scrollMsg,
      data:{},
      method:'get',
      header:{
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      success(res){
        console.log("滚动信息获取--成功",res)
        var scrollArr=[];//用于保存滚动信息
        for(var i=0;i<res.data.data.length;i++){
          scrollArr.push(res.data.data[i].content)
        }
        var scrollArrText = scrollArr.join("   ;   ")
        console.log("合并滚动信息",scrollArrText)
        that.setData({
          scrollMsg: scrollArrText
        })
        that.scroll()
      },
      fail(res){
        console.log("滚动信息获取--失败", res)
      }

    })

  },
  // 获取新品推荐
  getNewGoods:function(){
    const that=this;
    wx.request({
      url: api.host.saleGoods,
      method:'get',
      header:{
        'content-type': 'application/json',
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data:{
        page:0,
        limit:2
      },
      success(res){
        console.log("新品推荐-接口返回参数", res);
        const newsGoods = utils.publicMethod.transformUrl(res.data.data,'cover')
        console.log("打印这个转换后的数组", newsGoods)
        that.setData({
          goods: newsGoods
        })
        
      },
      fail(res){
        console.log("新品推荐-失败", res)
      }
    })
  },
  // 新品推荐跳转到商品列表
  skip_saleGood:function(e){
    wx.setStorageSync('shop', e.currentTarget.dataset.shop);
    wx.setStorageSync('unitname', e.currentTarget.dataset.unitname);
    var unitlogo = app.globalData.host+e.currentTarget.dataset.unitlogo
    wx.setStorageSync('unitlogo', unitlogo);
    app.globalData.entry=0;
    wx.navigateTo({
      url: '/pages/goodList/goodList',
    })
  },
  // 获取厂家列表
  getManufacturers:function(){
    const that=this;
    wx.request({
      url: api.host.companyList,
      method:'get',
      header:{
        'content-type': 'application/json',
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      success(res){
        console.log("成功-企业",res)
        const _companys = utils.publicMethod.transformUrl(res.data.data, 'headphoto')
        that.setData({
          companys:res.data.data
        })
      },
      fail(res){
        console.log("失败-企业", res)
      }
    })

  },
  // 获取关于我们,联系方式
  getAboutUs:function(){
    const that=this;
    wx.request({
      url: api.host.aboutUs,
      header:{
        'content-type': 'application/json',
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      method:'get',
      data:{},
      success(res){
        console.log("获取关于我们信息成功",res)
        var _aboutUs=that.data.aboutUs;
        _aboutUs.content=res.data.data.about_us;
        _aboutUs.address=res.data.data.address;
        _aboutUs.phone=res.data.data.phone;
        that.setData({
          aboutUs:_aboutUs
        })
        // console.log("1111111")
        // console.log("成功-获取关于我们信息",res)
      },
      fail(res){
        console.log("失败-获取关于我们信息", res)
      }
    })
  },
  // 跳转到厂家商品列表
  skip_goodList:function(e){
    app.globalData.entry = 1;
    console.log("打印这个id参数", e.currentTarget.dataset.id);
    wx.setStorageSync('shop', e.currentTarget.dataset.id);
    wx.setStorageSync('unitname', e.currentTarget.dataset.unitname)
    wx.setStorageSync('unitlogo', e.currentTarget.dataset.unitlogo)
    wx.navigateTo({
      url: '/pages/goodList/goodList',
    })
  },
  // 客服回调
  handleContact:function(e){
    console.log(e.path)
    console.log(e.query)
  },
  // 拨打电话
  callPhone:function(){
    const that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.aboutUs.phone
    })
  },
  //版本检测更新
  update:function(){
    const updateManager = wx.getUpdateManager()//实例化updateManager对象

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("打印更新对象",res.hasUpdate)
      // 如果存在新版本
      if(res.hasUpdate){
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title: '升级失败',
            content: '新版本下载失败，请检查网络！',
            showCancel: false
          });

        })

      }
    })

    

    
  },
  // 封装实时滚动方法
  scroll:function(text){
    const t=this;
    var query = wx.createSelectorQuery();
    console.log("111111111111")
    query.select('.r_rowScroll').boundingClientRect(function (res) {
      console.log("++++", res.width)
    }).exec()


    var w = wx.getSystemInfoSync().windowWidth;
    console.log("打印这个w", w)
    var str = t.data.scrollMsg;
    t.setData({
      marquee: w
    });
    t.data.maxScroll = str.length * 15 + 4;
    t.data.windowWidth = w;
    t.scrolltxt();
  }

})
