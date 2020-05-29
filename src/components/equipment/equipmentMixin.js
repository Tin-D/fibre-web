import { getterTypes } from '@/store/getterTypes';

export const equipmentMixin = {
    methods: {
        renderBrandNameRow (row, column) {
            return this.$store.getters[`brandModel/${getterTypes.brandModel.renderBrandModel}`](row[column.property]);
        },
    },
};
