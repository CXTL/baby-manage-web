import request from '@/utils/request'


export function createMenu(data) {
  return request({
    url: '/api/menus/addMenu',
    method: 'post',
    data: data
  })
}

export function updateMenu(data) {
  return request({
    url: '/api/menus/updateMenu',
    method: 'post',
    data: data
  })
}


export function deleteMenu(params) {
  return request({
    url: '/api/menus/deleteMenu',
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/api/menus/treeList',
    method: 'get'
  })
}


export function listMenuByRoleId(params) {
  return request({
    url: '/api/menus/listMenuByRoleId',
    method: 'get',
    params: params
  })
}



