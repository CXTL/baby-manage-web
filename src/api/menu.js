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

