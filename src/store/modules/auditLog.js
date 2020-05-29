import { generateCurdManager } from '@/store/baseManager';

const url = '/audit_log';

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'logs',
    serverPagination: true,
});

export default store;
