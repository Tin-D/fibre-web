<template>
    <el-select :value="value"
               @change="handleValueChange"
               :multiple="multiple"
               :placeholder="placeholder"
               :clearable="!readonly"
               :disabled="readonly"
    >
        <el-option v-for="o of options"
                   :label="o.name"
                   :value="o.id"
                   :key="o.id"
        />
    </el-select>
</template>

<script>
    import { getterTypes } from '@/store/getterTypes';

    export default {
        computed: {
            options () {
                let result;
                if (this.rootId) {
                    result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentId}`](this.rootId);
                } else if (this.rootCode) {
                    result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentCode}`](this.rootCode);
                } else {
                    result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getCodeTree}`];
                }

                return result;
            },
        },
        methods: {
            handleValueChange (value) {
                this.$emit('input', value);
            },
            normalizer (node) {
                node.label = node.name;
                return node;
            },
        },
        props: {
            multiple: {
                type: Boolean,
                default: false,
            },
            value: {},
            rootId: {
                type: String,
            },
            rootCode: {
                type: String,
            },
            placeholder: {
                type: String,
                default: '请选择',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
