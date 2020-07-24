import request from '@/utils/request';

//用户列表
export const fetchUserData = query => {
    return request({
        url: '/api/users/listByPage',
        method: 'post',
        data: query
    });
};

//菜单列表
export const fetchMenuData = query => {
    return request({
        url: '/api/menus/listByPage',
        method: 'post',
        data: query
    });
};


//角色列表
export const fetchRoleData = query => {
    return request({
        url: '/api/roles/listByPage',
        method: 'post',
        data: query
    });
};
