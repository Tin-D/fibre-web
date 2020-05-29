<template>
    <el-cascader
        :value="value"
        :options="departments"
        @change="handleChange"
        :props="{multiple, emitPath, checkStrictly, value: 'id', label: 'name'}"
        :disabled="disabled || readonly"
        :clearable="clearable"
        :show-all-levels="showAllLevels"
        filterable
        :placeholder="placeholder"
    />
</template>

<script>
    import { getterTypes } from '@/store/getterTypes';

    export default {
        computed: {
            departments () {
                if (this.rootId) {
                    return this.$store.getters[`department/${getterTypes.department.getTreeData}`](this.rootId);
                }
                return this.$store.getters[`department/${getterTypes.department.getTreeData}`];
            },
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value);
            },
        },
        props: {
            multiple: {
                type: Boolean,
                default: false,
            },
            value: {},
            checkStrictly: { // 是否允许选择任意一级部门
                type: Boolean,
                default: false,
            },
            emitPath: {
                type: Boolean,
                default: false,
            },
            rootId: {
                type: String,
            },
            placeholder: {
                type: String,
                default: '请选择部门',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            showAllLevels: {
                type: Boolean,
                default: true,
            },
            clearable: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
