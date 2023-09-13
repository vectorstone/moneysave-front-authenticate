import request from '@/utils/request'
export default {
  //获取登录和注册的日活的数量
  getList(start,end){
    return request({
      url: `/admin/core/statistics/${start}/${end}`,
      method: 'GET'
    })
  }
}
