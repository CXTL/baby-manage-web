import request from '@/utils/request'



export function createInvest(data) {
  return request({
    url: '/finance/invest/addInvest',
    method: 'post',
    data: data
  })
}

export function updateInvest(data) {
  return request({
    url: '/finance/invest/updateInvest',
    method: 'post',
    data: data
  })
}


export function deleteInvest(params) {
  return request({
    url: '/finance/invest/deleteInvest',
    method: 'post',
    params: params
  })
}
