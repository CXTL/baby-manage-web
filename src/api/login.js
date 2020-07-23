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

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/api/logout',
    method: 'post'
  })
}

export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function createAdmin(data) {
  return request({
    url: '/api/users/addUser',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/users/updateUser',
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(params) {
  return request({
    url: '/api/users/delete',
    method: 'post',
    params: params
  })
}


export function deleteBatchAdmin(params) {
  return request({
    url: '/api/users/deleteBatch',
    method: 'post',
    params: params
  })
}


export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function allocRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}
