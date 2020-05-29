import { generateCurdManager } from '@/store/baseManager';

const url = '/computer_room';

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'computerRooms',
    serverPagination: true,
});

export default store;
