import axios from 'axios';
import { generateCurdManager } from '@/store/baseManager';
import { getterTypes } from '@/store/getterTypes';
import { generateTree } from '@/roadhog/utils';
import { actionTypes } from '@/store/actionTypes';
import { debounceFn } from '@/roadhog/debounce';
import { mutationTypes } from '@/store/mutationTypes';

const store = generateCurdManager({
    namespaced: true,
    url: '/department',
    listProperty: 'departments',
    serverPagination: false,
});

const { getters, actions, mutations } = store;

mutations[mutationTypes.common.setListData] = (state, data) => {
    _.forEach(data, n => {
        n.type = 'department';
        return true;
    });
    state.departments = data;
};

actions[actionTypes.department.findDepartmentUsers] = debounceFn(async (store, departmentId) => {
    const { data } = await axios.get(`/department/${departmentId}/users`);
    return data;
}, 100);

getters[getterTypes.department.getTreeData] = (state) => {
    const result = [];
    generateTree(null, state.departments, result, 'orderNumber');
    return result;
};

getters[getterTypes.department.getTreeDataByRoot] = (state) => {
    return (rootId) => {
        const result = [];
        generateTree(rootId, state.departments, result, 'orderNumber');
        return result;
    };
};

export default store;
