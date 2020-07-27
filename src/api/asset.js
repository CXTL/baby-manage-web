import request from '@/utils/request'



export function createAsset(data) {
  return request({
    url: '/finance/asset/addAsset',
    method: 'post',
    data: data
  })
}

export function updateAsset(data) {
  return request({
    url: '/finance/asset/updateAsset',
    method: 'post',
    data: data
  })
}


export function deleteAsset(params) {
  return request({
    url: '/finance/asset/deleteAsset',
    method: 'post',
    params: params
  })
}
