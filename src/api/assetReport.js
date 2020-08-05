import request from '@/utils/request'



export function exportAsset(params) {
  return request({
    url: '/report/asset/exportAsset',
    method: 'post',
    params: params,
    responseType: 'blob' // 这个不能少，必须要有，如果改成axios请求也要加上这个
  })
}

