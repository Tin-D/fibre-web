<template>
    <el-cascader
        :value="value"
        :options="options"
        @change="handleChange"
        :props="{multiple, emitPath, value: 'id', label: 'name', disabled: 'disabled', checkStrictly}"
        :disabled="disabled || readonly"
        :clearable="clearable"
        :show-all-levels="showAllLevels"
        :filterable="filterable"
        :placeholder="placeholder"
    />
</template>

<script>
    import { getterTypes } from '@/store/getterTypes';
    import { walkTree } from '@/roadhog/utils';

    export default {
        created () {
            this.$nextTick(() => {
                if (this.autoSelectFirstNode && this.options.length > 0 && (!this.value || this.value.length === 0)) {
                    this.$emit('input', this.emitPath ? [this.options[0].id] : this.options[0].id);
                }
            });
        },
        computed: {
            options () {
                let result;
                if (this.rootId) {
                    result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentId}`](this.rootId, this.containRootNode);
                } else if (this.rootCode) {
                    result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentCode}`](this.rootCode, this.containRootNode);
                } else {
                    result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getCodeTree}`];
                }

                result = this.containRootNode ? [result] : result;

                if (result && this.disableNodeIds) {
                    const disableNodeIds = _.isString(this.disableNodeIds) ? [this.disableNodeIds] : this.disableNodeIds;
                    walkTree(result, n => {
                        if (disableNodeIds.includes(n.id)) {
                            n.disabled = true;
                        }
                    });
                }

                return result;
            },
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value);
            },
        },
        props: {
            value: {},
            multiple: {
                type: Boolean,
                default: false,
            },
            emitPath: {
                type: Boolean,
                default: false,
            },
            clearable: {
                type: Boolean,
                default: false,
            },
            showAllLevels: {
                type: Boolean,
                default: true,
            },
            filterable: {
                type: Boolean,
                default: true,
            },
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
            containRootNode: {
                type: Boolean,
                default: false,
            },
            checkStrictly: { // 是否允许选择任意一级
                type: Boolean,
                default: false,
            },
            disableNodeIds: {
                type: [String, Array],
            },
            autoSelectFirstNode: { // 默认选择第一个节点
                type: Boolean,
                default: false,
            },
        },
    };
</script>
