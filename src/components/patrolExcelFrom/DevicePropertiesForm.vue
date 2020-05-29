<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">

        <el-form-item label="设备属性表：" prop="deviceProperties">
            <el-input v-model="form.deviceProperties"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 设备属性表
     */

    export default {
        data () {
            return {
                form: {
                    id: null,
                    deviceProperties: null,
                },
                rules: {
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.devicePropertiesLog);
                },
            },
        },
        methods: {
            async collectValues () {
                await this.$refs.form.validate();
                return this.form;
            },
        },
        props: {
            result: {
                type: Object,
            },
        },
    };
</script>
