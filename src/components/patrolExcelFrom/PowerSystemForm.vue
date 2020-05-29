<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">

        <el-form-item label="电源系统巡检登记表：" prop="powerSystem">
            <el-input v-model="form.powerSystem"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 电源系统巡检登记表
     */

    export default {
        data () {
            return {
                form: {
                    id: null,
                    powerSystem: null,
                },
                rules: {
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.powerSystemLog);
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
