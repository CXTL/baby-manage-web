import request from '@/utils/request'



//获取首页报表数据
export const fetchHomeReportData = query => {
  return request({
    url: '/report/home/getHomeTableData',
    method: 'post',
    data: query
  });
};
