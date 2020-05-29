import axios from 'axios';
import { generateCurdManager } from '@/store/baseManager';
import { actionTypes } from '@/store/actionTypes';

const baseUrl = '/task';

const store = generateCurdManager({
    namespaced: true,
    url: baseUrl,
    listProperty: 'tasks',
    serverPagination: true,
});

const { actions } = store;

Object.assign(actions, {
    async [actionTypes.task.findDetails] (store, taskId) {
        const { data } = await axios.get(`${baseUrl}/details/${taskId}`);
        return data;
    },
});

export default store;
