import { generateCurdManager } from '@/store/baseManager';
import { actionTypes } from '@/store/actionTypes';
import axios from 'axios';

const url = '/user'; // 和后端索取url地址

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'users',
    serverPagination: true,
});

const { actions } = store;

/**
 * 重置用户密码
 * @param store
 * @param id {string} 用户id
 * @returns {Promise<string>} 新密码
 */
actions[actionTypes.user.resetPassword] = async (store, id) => {
    const { data } = await axios.put(`/user/reset_password/${id}`);
    return data.message;
};

actions[actionTypes.user.resetMyPassword] = async (store, values) => {
    const { data } = await axios.put('/user/reset_my_password', values);
    return data;
};

actions[actionTypes.user.importUsers] = async (store, values) => {
    const { data } = await axios.post('/import_users', values);
    return data;
};

export default store;
