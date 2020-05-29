<template>
    <el-cascader
        :options="options"
        :placeholder="placeholder"
        :props="{value: 'id', label: 'name', children: 'children', disabled: 'disabled', emitPath: false}"
        :value="value"
        @change="handleChange"
        clearable
        filterable
        style="width: 100%;">
    </el-cascader>
</template>

<script>
    /**
     * 此组件为cascader品牌选择
     */
    import { getterTypes } from '@/store/getterTypes';

    export default {
        computed: {
            options () {
                const equipmentType = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentCode}`]('EquipmentType');
                const brands = this.$store.state.brand.brands;
                const res = [];

                _.forEach(_.orderBy(equipmentType, ['name'], ['asc']), i => {
                    const item = {
                        id: i.id,
                        name: i.name,
                        children: _.chain(brands).orderBy(['orderNumber'], ['asc']).filter(n => n.equipmentTypeId === i.id).map(e => ({
                            id: e.id,
                            name: e.name,
                        })).value(),
                    };
                    res.push(item);
                });
                return res;
            },
        },
        methods: {
            handleChange (value) {
                const res = this.$store.state.brand.brands.filter(i => i.id === value);
                this.$emit('typeId', res[0].equipmentTypeId);

                this.$emit('input', value);
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
                default: '请选择品牌',
            },
        },
    };
</script>
