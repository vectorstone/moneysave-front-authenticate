import request from '@/utils/request'
const api_name = '/admin/book'
export default {
  //查询分页数据
  getPageList(pageNum,pageSize,searchVo){
    return request({
      url: `${api_name}/${pageNum}/${pageSize}`,
      method: 'POST',
      data: searchVo
    })
  },
  //根据id删除账单
  removeById(id){
    return request({
      url: `${api_name}/${id}`,
      method: 'DELETE'
    })
  },
  //根据id修改账单
  updateById(book){
    return request({
      url: `${api_name}`,
      method: 'PUT',
      data: book
    })
  },
  //新增账单
  save(book){
    return request({
      url: `${api_name}`,
      method: 'POST',
      data: book
    })
  },
  //获取月份对应的总支出数据
  getMonthCost(start,end){
    return request({
      url: `${api_name}/echarts/cost/monthly/${start}/${end}`,
      method: 'GET'
    })
  },
  //获取每天的支出数据
  getDayCost(){
    return request({
      url: `${api_name}/echarts/cost/largeArea`,
      method: 'GET'
    })
  }
}
