import request from '@/utils/request'



//获取首页报表数据
export const fetchInOutAssetData = query => {
  return request({
    url: '/report/asset/listInOutAssetInfoByPage',
    method: 'post',
    data: query
  });
};


//获取首页统计图数据
export const fetchInOutChartReportData = query => {
  return request({
    url: '/report/asset/getInOutChartData',
    method: 'post',
    data: query
  });
};
