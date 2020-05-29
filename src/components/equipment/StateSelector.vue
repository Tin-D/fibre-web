<template>
    <el-select :value="value"
               clearable
               :disabled="readonly"
               filterable
               @change="handleChange"
               placeholder="请选择设备状态">
        <el-option v-for="(item, key) in State"
                   :key="key"
                   :label="key"
                   :value="item">
        </el-option>
    </el-select>
</template>

<script>
    /**
     * 此组件为设备状态select组件
     */
    import State from '@/components/equipment/State';

    export default {
        data () {
            return {
                State,
            };
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value);
            },
        },
        props: {
            value: {
                type: String,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
