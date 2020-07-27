import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/system/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/system/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/info',
    method: 'get',
  })
}










