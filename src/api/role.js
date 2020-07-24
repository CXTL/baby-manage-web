import request from '@/utils/request'



export function createRole(data) {
  return request({
    url: '/api/roles/addRole',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/roles/updateRole',
    method: 'post',
    data: data
  })
}


export function deleteRole(params) {
  return request({
    url: '/api/roles/deleteRole',
    method: 'post',
    params: params
  })
}

export function fetchAllRoleList() {
  return request({
    url: '/api/roles/listAll',
    method: 'get'
  })
}
