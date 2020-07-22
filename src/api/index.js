import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/api/users/listByPage',
        method: 'get',
        params: query
    });
};
