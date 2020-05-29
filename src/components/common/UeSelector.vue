<template>
    <el-select :value="value"
               :multiple="multiple"
               :clearable="clearable"
               filterable
               @change="handleChange"
    >
        <el-option v-for="o of options"
                   :key="o.id"
                   :value="o.id"
                   :label="o.fullName || o.name"
        />
    </el-select>
</template>

<script>
    import { actionTypes } from '@/store/actionTypes';

    export default {
        data () {
            return {
                options: [],
            };
        },
        methods: {
            async loadOptions () {
                this.options = await this.$store.dispatch(`workflow/${actionTypes.workflow.parseUeExpression}`, this.expression);
                if (this.defaultFirstOption) {
                    const selectedValue = this.options?.length > 0 ? this.options[0].id : null;
                    if (this.multiple) {
                        this.handleChange(selectedValue == null ? [] : [selectedValue]);
                    } else {
                        this.handleChange(selectedValue);
                    }
                }
            },
            handleChange (value) {
                this.$emit('input', value);
            },
        },
        watch: {
            expression: {
                handler () {
                    this.loadOptions();
                },
                immediate: true,
            },
        },
        props: {
            value: {
                type: [String, Array],
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            clearable: {
                type: Boolean,
                default: false,
            },
            expression: {
                type: String,
                required: true,
            },
            defaultFirstOption: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
