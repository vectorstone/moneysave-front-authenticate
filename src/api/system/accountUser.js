import request from '@/utils/request'

const api_name = '/admin/user'

export default {
  // 获取用户分页后的list
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // 根据id查询用户
  getSysUserById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  // 新增用户
  // 这个地方注意下, 测试下如果传过去的对象和后端接收的对象的名字不一样会不会出什么问题
  addUser(User) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data: User
    })
  },
  // 修改用户1 data传参
  editUser(sysUser){
    return request({
      url: `${api_name}`,
      method: 'put',
      data: sysUser
    })
  },
  // 根据id移除用户
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  // 批量移除用户
  removeBatch(idList) {
    return request({
      url: `${api_name}/remove`,
      method: 'DELETE',
      data: idList
    })
  },
  //检查用户名是否已存在
  checkUsername(username){
    return request({
      url: `${api_name}/checkUsername`,
      method: 'GET',
      params: { username }
    })
  }
}
