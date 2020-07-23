import request from '@/utils/request';

export const fetchUserData = query => {
    return request({
        url: '/api/users/listByPage',
        method: 'post',
        data: query
    });
};

export const fetchMenuData = query => {
    return request({
        url: '/api/menus/listByPage',
        method: 'post',
        data: query
    });
};
