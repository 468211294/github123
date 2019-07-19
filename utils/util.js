const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// zzx-公共方法
const publicMethod={
  // 转换图片链接地址
  transformUrl:function(arr,key){
    for(var i=0;i<arr.length;i++){
      arr[i][key] = getApp().globalData.host + arr[i][key]
    }
    return arr;
  },
  // 遍历数组,添加字段名,字段值,arr:数组,key:键名,value:键值
  addKey:function(arr,key,value){
    for (var i = 0; i < arr.length; i++) {
      arr[i][key] = value
    }
    return arr;
  },
  // 获取数组中的最大值
  getMax:function(arr){
    return Math.max.apply(Math, arr);
  },
  // 获取数组中的最小值
  getMin:function(arr){
    return Math.min.apply(Math, arr);
  }
}
module.exports = {
  formatTime: formatTime,
  publicMethod: publicMethod
}
