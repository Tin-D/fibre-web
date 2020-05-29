<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">

        <el-form-item label="巡检报告单：" prop="inspectionReport">
            <el-input v-model="form.inspectionReport"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 巡检报告单
     */

    export default {
        data () {
            return {
                form: {
                    id: null,
                    inspectionReport: null,
                },
                rules: {
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.inspectionReportLog);
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
