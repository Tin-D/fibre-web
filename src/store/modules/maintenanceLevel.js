import { generateCurdManager } from '@/store/baseManager';
import { actionTypes } from '@/store/actionTypes';
import axios from 'axios';

const url = '/maintenance_level';

const store = generateCurdManager({
    namespaced: true,
    url: url,
    listProperty: 'maintenanceLevels',
    serverPagination: false,
});

const { actions } = store;

Object.assign(actions, {
    async [actionTypes.maintenanceLevel.findByEquipmentTypeId] (store, equipmentTypeId) {
        const { data } = await axios.get(`${url}/find_by_type_id/${equipmentTypeId}`);
        return data;
    },
});

export default store;
