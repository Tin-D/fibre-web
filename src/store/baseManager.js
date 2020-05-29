import { mutationTypes } from '@/store/mutationTypes';
import { actionTypes } from '@/store/actionTypes';
import axios from 'axios';
import { createDebounce } from '@/roadhog/utils';
import { getterTypes } from '@/store/getterTypes';

export const generateCurdManager = ({ namespaced, url, listProperty, serverPagination = false }) => {
    const state = {
        [listProperty]: [],
    };

    const mutations = {
        [mutationTypes.common.setListData] (state, data) {
            state[listProperty] = data;
        },
    };

    const getUrl = () => _.isFunction(url) ? url() : url;

    const actions = {
        async [actionTypes.common.get] (store, id) {
            const response = await axios.get(`${getUrl()}/${id}`);
            return response.data;
        },
        [actionTypes.common.list]: createDebounce(async ({ commit }, query) => {
            const realUrl = serverPagination ? `${getUrl()}/pagination` : getUrl();
            console.log(`do list from: ${realUrl}`);
            let response;
            if (serverPagination) {
                response = await axios.post(realUrl, query);
                commit(mutationTypes.common.setListData, response.data.items);
            } else {
                response = await axios.get(realUrl);
                commit(mutationTypes.common.setListData, response.data);
            }

            return response.data;
        }),
        async [actionTypes.common.add] ({ dispatch }, data) {
            const response = await axios.post(getUrl(), data, { formPost: true, loading: true });
            if (!serverPagination) {
                dispatch(actionTypes.common.list);
            }

            if (!response.data || !response.data.message) {
                throw new Error('response not contain insert item id');
            }

            return response.data.message;
        },
        async [actionTypes.common.edit] ({ dispatch }, { id, data }) {
            await axios.put(`${getUrl()}/${id}`, data, { formPost: true, loading: true });
            if (!serverPagination) {
                dispatch(actionTypes.common.list);
            }
        },
        async [actionTypes.common.remove] ({ dispatch }, id) {
            await axios.delete(`${getUrl()}/${id}`, { formPost: true, loading: true });
            if (!serverPagination) {
                dispatch(actionTypes.common.list);
            }
        },
        async [actionTypes.common.checkUnique] (store, { id, property, value }) {
            property = property || 'name';
            if (value == null || value === '') {
                return false;
            }
            const response = await axios.post(`${getUrl()}/check_unique`, { id, property, value });
            return response.data.success;
        },
    };

    const getters = {
        [getterTypes.common.getById] (state) {
            return (id) => state[listProperty].find((n) => n.id === id);
        },
    };

    return {
        state,
        actions,
        mutations,
        getters,
        namespaced: namespaced === false || true,
    };
};
