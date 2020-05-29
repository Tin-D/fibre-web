import { generateCurdManager } from '@/store/baseManager';

const url = '/customer';

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'customers',
    serverPagination: true,
});

export default store;
