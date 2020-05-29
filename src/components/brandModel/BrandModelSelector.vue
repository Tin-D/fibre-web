<template>
    <el-cascader
        :props="{value: 'id', label: 'name', children: 'children', disabled: 'disabled', emitPath: false}"
        :placeholder="placeholder"
        :options="options"
        :show-all-levels="showAllLevels"
        clearable
        :disabled="disabled"
        filterable
        style="width: 100%;"
        :value="value"
        @change="handleChange">
    </el-cascader>
</template>

<script>/**
 *此组件为select型号选择
 * 先选品牌再选型号
 */

    import { getterTypes } from '@/store/getterTypes';

    export default {
        computed: {
            options () {
                const equipmentType = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentCode}`]('EquipmentType');
                const brands = this.$store.state.brand.brands;
                const brandModels = this.$store.state.brandModel.brandModels;
                const res = [];

                _.forEach(_.orderBy(equipmentType, ['name'], ['asc']), i => {
                    const item = {
                        id: i.id,
                        name: i.name,
                        children: _.chain(brands).orderBy(['orderNumber'], ['asc']).filter(n => n.equipmentTypeId === i.id).map(e => ({
                            id: e.id,
                            name: e.name,
                            children: _.chain(brandModels).orderBy(['orderNumber'], ['asc']).filter(o => o.brandId === e.id).map(c => ({
                                id: c.id,
                                name: c.name,
                            })).value(),
                        })).value(),
                    };
                    res.push(item);
                });
                return res;
            },
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value);
            },
            equipmentTypeName (equipmentTypeId) {
                const code = this.getDictionaryCode(equipmentTypeId);
                return code.name;
            },
        },
        props: {
            value: {
                type: String,
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '请选择型号',
            },
            disabled: {
                type: Boolean,
            },
            showAllLevels: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
