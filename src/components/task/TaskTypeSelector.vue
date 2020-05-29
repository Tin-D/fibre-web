<template>
    <el-select :value="value"
               clearable
               :disabled="disabled"
               @change="handleChange"
               placeholder="请选择任务类型">
        <el-option v-for="(item, key) in TaskType"
                   :key="key"
                   :label="key"
                   :value="item">
        </el-option>
    </el-select>
</template>

<script>
    /**
     * 此组件为任务类型select组件
     */
    import TaskType from '@/components/task/TaskType';

    export default {
        data () {
            return {
                TaskType,
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
            disabled: {
                type: Boolean,
            },
        },
    };
</script>
