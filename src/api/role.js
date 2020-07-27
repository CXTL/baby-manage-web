import request from '@/utils/request'



export function createRole(data) {
  return request({
    url: '/system/roles/addRole',
    method: 'post',
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/system/roles/updateRole',
    method: 'post',
    data: data
  })
}


export function deleteRole(params) {
  return request({
    url: '/system/roles/deleteRole',
    method: 'post',
    params: params
  })
}

export function fetchAllRoleList() {
  return request({
    url: '/system/roles/listAll',
    method: 'get'
  })
}



export function allocMenu(data) {
  return request({
    url: '/system/roles/allocMenu',
    method: 'post',
    data:data
  })
}
