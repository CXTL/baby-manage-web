import request from '@/utils/request'



export function createUser(data) {
  return request({
    url: '/system/users/addUser',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/system/users/updateUser',
    method: 'post',
    data: data
  })
}

export function fetchAllRoleList() {
  return request({
    url: '/system/roles/listAll',
    method: 'get'
  })
}

export function listAccountByUserId(params) {
  return request({
    url: '/system/account/getAccountByAdmin',
    method: 'get',
    params: params
  })
}

export function listRoleByUserId(params) {
  return request({
    url: '/system/roles/listRoleByUserId',
    method: 'get',
    params: params
  })
}

export function deleteUser(params) {
  return request({
    url: '/system/users/deleteUser',
    method: 'post',
    params: params
  })
}


export function allocRole(data) {
  return request({
    url: '/system/users/allocRole',
    method: 'post',
    data: data
  })
}


export function allocAccount(data) {
  return request({
    url: '/system/users/allocAccount',
    method: 'post',
    data: data
  })
}
