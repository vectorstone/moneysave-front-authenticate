import request from '@/utils/request'

const api_name = '/admin/user'

export function login(data) {
  return request({
    url: `${api_name}/login`,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: `${api_name}/info`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${api_name}/logout`,
    method: 'post'
  })
}
