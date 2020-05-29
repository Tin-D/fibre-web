import axios from 'axios';
import { generateCurdManager } from '@/store/baseManager';
import { getterTypes } from '@/store/getterTypes';
import { generateTree } from '@/roadhog/utils';
import { actionTypes } from '@/store/actionTypes';

const url = '/dictionary_code';

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'codes',
});

const { getters, actions } = store;

// noinspection DuplicatedCode
Object.assign(getters, {
    [getterTypes.dictionaryCode.getByCode] (state) {
        return (code) => {
            return _.find(state.codes, n => n.code === code);
        };
    },
    [getterTypes.dictionaryCode.getCodeTree] (state) {
        const result = [];
        generateTree(null, state.codes, result, 'index');
        return result;
    },
    [getterTypes.dictionaryCode.getChildrenTreeByParentId] (state) {
        return (rootId, containRootCode) => {
            const root = _.find(state.codes, n => n.id === rootId);
            if (root == null) {
                return [];
            }
            const result = [root];
            generateTree([root], state.codes, result, 'index');
            return containRootCode ? result[0] : result[0].children;
        };
    },
    [getterTypes.dictionaryCode.getChildrenTreeByParentCode] (state) {
        return (rootCode, containRootCode) => {
            const root = _.find(state.codes, n => n.code === rootCode);
            if (root == null) {
                return [];
            }
            const result = [root];
            generateTree([root], state.codes, result, 'index');
            return containRootCode ? result[0] : result[0].children;
        };
    },
    [getterTypes.dictionaryCode.getParentsById] (state) {
        return (id) => {
            let node = _.find(state.codes, n => n.id === id);
            if (node == null) {
                return [];
            }

            const result = [node];
            while (node) {
                node = _.find(state.codes, n => n.id === node.parentId);
                if (node) {
                    result.unshift(node);
                }
            }

            return result;
        };
    },
    [getterTypes.dictionaryCode.getParentsByCode] (state) {
        return (code) => {
            let node = _.find(state.codes, n => n.code === code);
            if (node == null) {
                return [];
            }

            const result = [node];
            while (node) {
                node = _.find(state.codes, n => n.id === node.parentId);
                if (node) {
                    result.unshift(node);
                }
            }

            return result;
        };
    },
});

Object.assign(actions, {
    [actionTypes.dictionaryCode.forceRefresh] () {
        axios.get(`${url}/refresh`);
    },
});

export default store;
