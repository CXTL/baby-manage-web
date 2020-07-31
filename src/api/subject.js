import request from '@/utils/request'



export function createSubject(data) {
  return request({
    url: '/finance/subject/addSubject',
    method: 'post',
    data: data
  })
}

export function updateSubject(data) {
  return request({
    url: '/finance/subject/updateSubject',
    method: 'post',
    data: data
  })
}


export function deleteSubject(params) {
  return request({
    url: '/finance/subject/deleteSubject',
    method: 'post',
    params: params
  })
}


export function fetchTreeList() {
  return request({
    url: '/finance/subject/treeList',
    method: 'get'
  })
}

