<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">

        <el-form-item label="消防系统巡检登记表：" prop="fireFightingSystem">
            <el-input v-model="form.fireFightingSystem"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 消防系统巡检登记表
     */

    export default {
        data () {
            return {
                form: {
                    id: null,
                    fireFightingSystem: null,
                },
                rules: {
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.fireFightingSystemLog);
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
