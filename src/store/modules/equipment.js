import { generateCurdManager } from '@/store/baseManager';

const store = generateCurdManager({
    namespaced: true,
    url: '/equipment',
    listProperty: 'equipments',
    serverPagination: true,
});

export default store;
