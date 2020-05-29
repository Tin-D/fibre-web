import axios from 'axios';
import { generateCurdManager } from '@/store/baseManager';
import { actionTypes } from '@/store/actionTypes';

const url = '/group';
const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'groups',
});

const { actions } = store;

Object.assign(actions, {
    async [actionTypes.group.addUsersToGroup] (store, { groupId, userIds }) {
        await axios.post(`${url}/users`, { groupId, userIds }, { formPost: true, loading: true });
    },
    async [actionTypes.group.removeUsersFromGroup] (store, { groupId, userIds }) {
        await axios.delete(`${url}/users`, { data: { groupId, userIds } }, { formPost: true, loading: true });
    },
    async [actionTypes.group.findGroupUsers] (store, groupId) {
        const { data } = await axios.get(`${url}/users/${groupId}`);
        return data;
    },
});

export default store;
