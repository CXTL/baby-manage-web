import request from '@/utils/request'



export function createUser(data) {
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

export function fetchAllRoleList() {
  return request({
    url: '/api/roles/listAll',
    method: 'get'
  })
}

export function getRoleByAdmin(params) {
  return request({
    url: '/api/roles/listRoleByUserId',
    method: 'get',
    params: params
  })
}

export function deleteUser(params) {
  return request({
    url: '/api/users/deleteUser',
    method: 'post',
    params: params
  })
}
export function allocRole(data) {
  return request({
    url: '/api/users/allocRole',
    method: 'post',
    data: data
  })
}
