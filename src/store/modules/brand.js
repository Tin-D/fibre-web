import { generateCurdManager } from '@/store/baseManager';

const url = '/brand';

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'brands',
    serverPagination: false,
});

export default store;
