<template>
    <curd-index store-module-name="brandModel"
                state-list-property="brandModels"
                :default-sort="{prop: 'name', order: 'ascending'}"
                :filter-method="['name']"
                :editor="brandModelEditor"
                pagination
    >

        <el-table-column label="名称" prop="name" sortable/>

        <el-table-column :formatter="renderDictionaryCodeRow" label="设备类型" prop="equipmentTypeId" sortable/>

        <el-table-column label="品牌" prop="brandId" :formatter="renderBrandNameRow" sortable/>

        <el-table-column label="排序" prop="orderNumber" sortable/>

    </curd-index>
</template>

<script>
    import CurdIndex from '@/components/common/CurdIndex';
    import brandModelEditor from '@/components/brandModel/BrandModelEditor';
    import { getterTypes } from '@/store/getterTypes';

    export default {
        components: { CurdIndex },
        data () {
            return {
                brandModelEditor,
            };
        },
        methods: {
            renderBrandNameRow (row, column) {
                let value = row[column.property];
                if (value == null) {
                    return null;
                }

                if (!_.isArray(value)) {
                    value = [value];
                }

                const result = [];
                _.forEach(value, (i) => {
                    const code = this.$store.getters[`brand/${getterTypes.common.getById}`](i);
                    result.push(code ? code.name : 'unknown');
                });

                return result.join('; ');
            },
        },
    };
</script>
