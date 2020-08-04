import request from '@/utils/request'



export function exportExcel() {
  return request({
    url: '/report/file/export',
    method: 'post',
    responseType: 'blob',
    headers: {
      "Content-Type": "multipart/form-data"
    },

  })
}

