import request from '@/utils/request'



export function createInvestor(data) {
  return request({
    url: '/finance/investor/addInvestor',
    method: 'post',
    data: data
  })
}

export function updateInvestor(data) {
  return request({
    url: '/finance/investor/updateInvestor',
    method: 'post',
    data: data
  })
}


export function deleteInvestor(params) {
  return request({
    url: '/finance/investor/deleteInvestor',
    method: 'post',
    params: params
  })
}


export function listInvestor(params) {
  return request({
    url: '/finance/investor/listInvestor',
    method: 'post',
    params: params
  })
}
