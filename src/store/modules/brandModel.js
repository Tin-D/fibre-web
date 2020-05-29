import { generateCurdManager } from '@/store/baseManager';
import { getterTypes } from '@/store/getterTypes';

const url = '/brand_model';

const store = generateCurdManager({
    namespaced: true,
    url,
    listProperty: 'brandModels',
    serverPagination: false,
});

const { getters } = store;
Object.assign(getters, {
    [getterTypes.brandModel.renderBrandModel] (state, getters, rootState) {
        return (id) => {
            const brandModel = getters.getById(id);
            if (!brandModel) {
                return null;
            }

            const brand = rootState.brand.brands.find(i => i.id === brandModel.brandId);
            return `${brand.name} - ${brandModel.name}`;
        };
    },
});

export default store;
