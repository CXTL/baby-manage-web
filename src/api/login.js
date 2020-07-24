import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/admin/api/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}










