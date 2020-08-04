import request from '@/utils/request';

//用户列表
export const fetchUserData = query => {
    return request({
        url: '/system/users/listByPage',
        method: 'post',
        data: query
    });
};

//菜单列表
export const fetchMenuData = query => {
    return request({
        url: '/system/menus/listByPage',
        method: 'post',
        data: query
    });
};


//角色列表
export const fetchRoleData = query => {
    return request({
        url: '/system/roles/listByPage',
        method: 'post',
        data: query
    });
};

//帐套列表
export const fetchAccountData = query => {
    return request({
        url: '/finance/account/listByPage',
        method: 'post',
        data: query
    });
};


//帐套列表
export const fetchSubjectData = query => {
    return request({
        url: '/finance/subject/listByPage',
        method: 'post',
        data: query
    });
};

//投资列表
export const fetchInvestData = query => {
    return request({
        url: '/finance/invest/listByPage',
        method: 'post',
        data: query
    });
};


//资产列表
export const fetchAssetData = query => {
    return request({
        url: '/finance/asset/listByPage',
        method: 'post',
        data: query
    });
};

//获取资产报表详情信息
export const fetchAssetReportData = query => {
    return request({
        url: '/report/asset/listAssetInfoByPage',
        method: 'post',
        data: query
    });
};


//获取全部帐套信息
export const listAccountData = () => {
    return request({
        url: '/finance/account/listAll',
        method: 'get'
    });
};

