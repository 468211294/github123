//接口配置表
// const host = "https://material.jhlovess.cn/apis/material"
// const api_login = host +"/users/login" ;//登录接口
// const api_banner = host +"/carousels/by_client";//轮播图接口
const src ="https://material.jhlovess.cn/apis/material";
const host={
  wxLogin:"https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code",//首页
  login: src+"/users/login",//首页-登录
  banner: src+"/carousels/by_client",//首页-轮播
  scrollMsg:src+"/messages/by_client",//首页-实时交易信息
  saleGoods:src+"/products/promotion/by_client",//首页-新品推荐
  companyList:src+"/shops/by_client",//首页-厂家列表
  companyGoods:src+"/products/by_client?shop=",//厂家商品列表
  placeOrder:src+"/orders/by_client",//下单接口
  orderlist: src+"/orders/by_client?status=",//订单列表
  myTeams:src+"/distributions/by_client?type=&limit=&page=&sort=",
  code:src+"/users/detail",//获取推广码,个人信息
  bg:src+"/backgrounds/by_client",//获取推广背景
  orderPay:function(id){
    return src+"/orders/payment/"+id+"/by_client"
  },
  updateMsg: src+"/users",//提交修改个人信息,
  aboutUs: src + "/info",//获取关于我们信息,
  withDraw: src +"/withdrawals/by_client",//申请提现
  confirmReceiving:function(id){//确认收货订单接口
    return src + "/orders/"+id+"/by_client" 
  },
  saleData:src+"/aggregations/by_client",//个人中心-获取分销数据
  saleCenter:src+"/commissions/by_client", //分销中心统计数据
  withDrawRecord:src + "/withdrawals/by_client"
  
//   提现记录
// GET / withdrawals / by_client ? q = { status: ['pending', 'finished'] } & sort=& limit=& page=

}
module.exports.host = host;
// module.exports.api_login = api_login;
// module.exports.api_banner = api_banner;