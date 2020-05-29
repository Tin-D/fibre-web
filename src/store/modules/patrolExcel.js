import axios from 'axios';
import { generateCurdManager } from '@/store/baseManager';
import { actionTypes } from '@/store/actionTypes';

const url = '/patrol_excel';

const store = generateCurdManager({
    namespaced: true,
    url: url,
    listProperty: 'patrolExcels',
    serverPagination: false,
});

const { actions } = store;

Object.assign(actions, {
    async [actionTypes.patrolExcel.findByEquipmentTypeId] (store, equipmentTypeId) {
        const { data } = await axios.get(`${url}/find_by_equipment_type_id/${equipmentTypeId}`);
        return data;
    },
});

export default store;
