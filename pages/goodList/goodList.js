// pages/goodList/goodList.js
const app = getApp();
const api = require('../../config/config.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty:false,
    promptText:"",
    prompt:false,
    show:false,
    company:{
      logo:"/images/huarun.png",
      name:"华润建材"
    },
    goods:[],
    typeArr:[],
    totalPrice:0,//合计
    totalRebate:0,//总返利
    dialog:false//弹窗提示输入手机号码
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
    that.getCompany().then(
      that.getGoodList()
    )
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
  // 获取企业名称,头像
  getCompany:function(callback){
    const that=this;
    const _company = that.data.company;
    _company.logo = wx.getStorageSync('unitlogo')
    _company.name = wx.getStorageSync('unitname')
    return new Promise(function (resolve, reject) {
      that.setData({
        company: _company
      })
      // callback()
      resolve();
    })
  },
  // 获取商品列表
  getGoodList:function(){
    const that=this;
    wx.request({
      url: app.globalData.entry == 1 ? api.host.companyGoods + wx.getStorageSync('shop') : api.host.companyGoods + wx.getStorageSync('shop'),
      method: 'get',
      header: {
        'content-type': 'application/json',// 默认值
        'Cookie': (wx.getStorageSync('userMsg'))
      },
      data: {
        page: 0,
        limit: 100

      },
      success(res) {
        console.log("成功-商品列表返回参数", res)
        const goodlist = utils.publicMethod.transformUrl(res.data.data, 'cover')
        const _goodlist = utils.publicMethod.addKey(goodlist, 'selectModel','请选择类型')
        const _goodlist2 = utils.publicMethod.addKey(_goodlist, 'number', 0)
        const _goodlist3 = utils.publicMethod.addKey(_goodlist2, 'checked', false);        
        console.log("打印这个_goodlist3", _goodlist3)
        const _goodlist4 = that.getPrice(res.data.data)
        for (var i = 0; i < _goodlist4.length; i++) {//添加键名totalCommission
          _goodlist4[i].totalCommission = _goodlist4[i].commission*100+"%"
        }

        console.log("打印转换后的_goodlist4", _goodlist4)
        if(_goodlist3.length>0){
          that.setData({
            goods: _goodlist3,
            empty:false
          })
        }else{
          that.setData({
            goods: _goodlist3,
            empty: true
          })
        }
        


      },
      fail(res) {
        console.log("失败-商品列表返回参数", res)
        wx.showModal({
          title: "提示",
          content: "请求超时,请检查网络是否通畅",
          confirmText: "确定"
        })
      }
    })
  },
  // 选择商品类型
  pickUp:function(e){
    
    console.log('picker发送选择改变，携带值为', e.detail.value)

  },
  // 1.打开所点击商品的类型弹窗
  selectType:function(e){
    const that=this;
    that.setData({
      show:true
    })
    console.log("打印数组索引", e.currentTarget.dataset.idx)
    app.globalData.selectGoodIndex = e.currentTarget.dataset.idx;
    const xuhao = e.currentTarget.dataset.idx
    that.confirmType(that.data.goods, xuhao)//获取类型数组
  },
  // 确定点击商品所有的类型
  confirmType:function(arr,idx){
    const that=this;
    console.log("打印所属类型", arr[idx].types)
    utils.publicMethod.addKey(arr[idx].types,'select',false)
    that.setData({
      typeArr:arr[idx].types
    })
    console.log("打印所选择商品的所有类型",that.data.typeArr)
  },
  // 取消
  cancel:function(){
    const that=this;
    that.setData({
      show:false
    })
  },
  //确定
  confirm:function(){
    const that = this;
    const _goods = that.data.goods;
    that.setData({
      show: false
    })
    for(var i=0;i<that.data.typeArr.length;i++){
      if (that.data.typeArr[i].select==true){
        var idx = app.globalData.selectGoodIndex
        console.log("点击确定打印所选择的规格", that.data.typeArr[i].size)
        _goods[idx].selectModel = that.data.typeArr[i].size; 
        _goods[idx].typeId = that.data.typeArr[i]._id; 
        _goods[idx].price=that.data.typeArr[i].price;
        _goods[idx].totalCommission = (that.data.typeArr[i].price) * _goods[idx].commission;
        console.log("打印这个选择类型之后确认的数组", _goods);
      }
    }
    that.setData({
      goods: _goods
    })
    that.sum(_goods)

  },
  selectOption:function(e){
    const that=this;
    const idx=e.currentTarget.dataset.index;
    const _typeArr = that.data.typeArr;
    for (var i = 0; i < _typeArr.length;i++){
      if(i==idx){
        _typeArr[i].select=true;
      }else{
        _typeArr[i].select=false;
      }
    }
    that.setData({
      typeArr: _typeArr
    })
    console.log("打印选择后的选项数组",that.data.typeArr)

  },
  // 复选框选择商品
  selectGood:function(e){
    const that=this;
    // const unitprice=0;
    var totalprice=0; 
    console.log("打印这个选中的radio",e.detail.value)
    that.checked(e.detail.value,that.data.goods,function(){
      that.sum(that.data.goods)
    })
    

  },
  //遍历商品品种的最大价格和最低价,并添加price属性
  getPrice:function(arr){
    for(var i=0;i<arr.length;i++){
      var _arr=[]
      for(var j=0;j<arr[i].types.length;j++){
        _arr.push(arr[i].types[j].price)
      }
      var min=utils.publicMethod.getMin(_arr);
      var max = utils.publicMethod.getMax(_arr);
      if(min!=max){
        arr[i].price=min+'—'+max
        // arr[i].price=min
      }else{
        arr[i].price=min
      }
    }
    return arr
  },
  // 减掉数量
  reduceNum:function(e){
    const that=this;
    console.log("执行减1")
    const idx=e.currentTarget.dataset.idx;
    const _goods=that.data.goods;
    if(_goods[idx].number>0){
      _goods[idx].number--
      _goods[idx].totalCommission = (((_goods[idx].commission) * (_goods[idx].number)).toFixed(2)) * _goods[idx].price;//计算佣金
      if (_goods[idx].number == 0) {
        _goods[idx].totalCommission = _goods[idx].commission*100+"%"
      }
      that.setData({
        goods:_goods
      })
      that.sum(that.data.goods)
    }else{
      that.setData({
        prompt:true,
        promptText:"选购数量不能低于0"
      })
      setTimeout(function(){
        that.setData({
          prompt: false,
          promptText: ""
        })
      },2000)
    }
  },
  // 增加数量
  addNum:function(e){
    const that = this;
    const idx = e.currentTarget.dataset.idx;
    const _goods = that.data.goods;
    _goods[idx].number++;
    _goods[idx].totalCommission = (((_goods[idx].commission) * (_goods[idx].number)).toFixed(2)) * _goods[idx].price;//计算佣金
    if (_goods[idx].number==0){
      _goods[idx].totalCommission = _goods[idx].commission
    }
    that.setData({
      goods:_goods
    })
    that.sum(that.data.goods)
  },
  // 标记已勾选的商品
  checked:function(arr,goodsArr,callback){//arr为勾选的商品数组,goodArr为商品列表数组
    const that=this;
    var _totalprice=0;
    for(var n=0;n<goodsArr.length;n++){
      goodsArr[n].checked=false;
    }
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < goodsArr.length; j++) {
        if (arr[i] == goodsArr[j]._id) {
          goodsArr[j].checked=true;
          // var unitprice = (goodsArr[j].price) * (goodsArr[j].number);
          // _totalprice += unitprice;
          break
        }else{
          // goodsArr[j].checked=false
        }

      }
    }
    that.setData({
      goods: goodsArr
    })
    console.log("打印勾选后的数组",that.data.goods)
    callback()
  },
  //勾选的金额统计
  sum:function(arr){
    const that=this;
    var totalMoney=0;
    var totalCommission=0;
    for(var i=0;i<arr.length;i++){
      if(arr[i].checked==true){
        var price=(arr[i].price)*(arr[i].number)
        var commission = (arr[i].totalCommission)//当前商品总佣金
        totalMoney+=price
        totalCommission += commission
        console.log("打印这个合计", totalMoney)
      }
      if(totalMoney=="NaN"){
        totalMoney="请选择类型"
      }
    }
    that.setData({
      totalPrice: totalMoney.toFixed(2),
      totalRebate: totalCommission.toFixed(2)
    })
    

  },
  // 结算
  closeAccount:function(){
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
        console.log("获取用户信息成功",res)
        // 如果用户存在手机号码
        if(res.data.data.phone!=""){
          that.successCloseAccount();
        }else{
          that.setData({
            dialog:true
          })
          // setTimeout(function(){
          //   that.setData({
          //     dialog: false
          //   })
          // },2000)

        }
      },
      fail(res){
        console.log("获取用户信息失败", res)
      }
    })
    

    // var orderGoods=[];
    // var _goods = that.data.goods;
    // for(var i=0;i<that.data.goods.length;i++){
    //   if (_goods[i].checked == true){
    //     orderGoods.push(_goods[i])
    //   }
    // }
    // console.log("打印勾选的数组",orderGoods)
    // for (var j = 0; j < orderGoods.length;j++){
    //   if (orderGoods[j].selectModel == "请选择类型"){
    //     that.setData({
    //       prompt:true,
    //       promptText:"请选择商品类型"
    //     })
    //     setTimeout(function(){
    //       that.setData({
    //         prompt: false,
    //         promptText: "请选择商品类型"
    //       })
    //     },2000)
    //     break;
    //   }else{
    //     if (j == orderGoods.length - 1) {
    //       wx.setStorageSync('orderGoods', orderGoods)
    //       wx.navigateTo({
    //         url: '/pages/confirmPay/confirmPay',
    //       })
    //     }
    //   }
    // }
  },
  // 成功结算,进入确认订单页面
  successCloseAccount: function () {
    const that = this;
    var orderGoods=[];
    var _goods = that.data.goods;
    for(var i=0;i<that.data.goods.length;i++){
      if (_goods[i].checked == true){
        orderGoods.push(_goods[i])
      }
    }
    console.log("打印勾选的数组",orderGoods)
    for (var j = 0; j < orderGoods.length;j++){
      // 如果商品未选择类型
      if (orderGoods[j].selectModel == "请选择类型"){
        that.setData({
          prompt:true,
          promptText:"请选择商品类型"
        })
        // 选择商品类型弹窗关闭
        setTimeout(function(){
          that.setData({
            prompt: false,
            promptText: "请选择商品类型"
          })
        },2000)
        break;
      }else{       
        if (j == orderGoods.length - 1) {
          wx.setStorageSync('orderGoods', orderGoods)
          wx.navigateTo({
            url: '/pages/confirmPay/confirmPay',
          })
        }
      }
    }
  },
  // 跳转到个人信息表单提交页面
  skip_form:function(){
    const that=this;
    that.setData({
      dialog:false
    })
    wx.navigateTo({
      url: '/pages/form/form',
    })
  }

})