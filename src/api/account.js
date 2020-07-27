import request from '@/utils/request'



export function createAccount(data) {
  return request({
    url: '/finance/account/addAccount',
    method: 'post',
    data: data
  })
}

export function updateAccount(data) {
  return request({
    url: '/finance/account/updateAccount',
    method: 'post',
    data: data
  })
}


export function deleteAccount(params) {
  return request({
    url: '/finance/account/deleteAccount',
    method: 'post',
    params: params
  })
}
