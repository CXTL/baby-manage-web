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
