import request from '@/utils/request'


export function createMenu(data) {
  return request({
    url: '/system/menus/addMenu',
    method: 'post',
    data: data
  })
}

export function updateMenu(data) {
  return request({
    url: '/system/menus/updateMenu',
    method: 'post',
    data: data
  })
}


export function deleteMenu(params) {
  return request({
    url: '/system/menus/deleteMenu',
    method: 'post',
    params: params
  })
}

export function fetchTreeList() {
  return request({
    url: '/system/menus/treeList',
    method: 'get'
  })
}


export function listMenuByRoleId(params) {
  return request({
    url: '/system/menus/listMenuByRoleId',
    method: 'get',
    params: params
  })
}



