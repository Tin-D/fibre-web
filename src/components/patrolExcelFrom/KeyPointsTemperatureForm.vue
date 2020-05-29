<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">

        <el-form-item label="关键点温度测量登记表：" prop="keyPointsTemperature">
            <el-input v-model="form.keyPointsTemperature"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 关键点温度测量登记表
     */

    export default {
        data () {
            return {
                form: {
                    id: null,
                    keyPointsTemperature: null,
                },
                rules: {
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.keyPointsTemperatureLog);
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
