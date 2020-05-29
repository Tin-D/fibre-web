<template>
    <lan-form-dialog
        ref="lanDialog"
        title="查看审计日志"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData"
    >

        <el-form v-if="!isLoadingFormData"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px"
                 size="mini"
        >

            <el-form-item label="功能模块">
                <el-input v-model="form.moduleName" readonly/>
            </el-form-item>

            <el-form-item label="操作用户">
                <el-input v-model="form.fullName" readonly/>
            </el-form-item>

            <el-form-item label="时间">
                <el-input v-model="form.created" readonly/>
            </el-form-item>

            <el-form-item label="访问成功">
                <el-input v-model="form.success" readonly/>
            </el-form-item>

            <el-form-item label="访问地址">
                <el-input v-model="form.url" readonly/>
            </el-form-item>

            <el-form-item label="访问类型">
                <el-input v-model="form.method" readonly/>
            </el-form-item>

            <el-form-item label="参数">
                <el-input type="textarea" v-model="form.params" readonly/>
            </el-form-item>

            <el-form-item label="详情">
                <el-input type="textarea" v-model="form.details" readonly/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';

    const storeModuleName = 'auditLog';

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        methods: {
            initForm () {
                return {
                    fullName: {},
                    ip: {},
                    url: {},
                    method: {},
                    params: {},
                    success: {
                        set: (formData) => this.renderBoolean(formData?.success),
                    },
                    details: {},
                    moduleName: {},
                    methodName: {},
                    operation: {},
                    created: {
                        set: (formData) => (formData && formData.created) ? this.renderDateTime(formData.created) : null,
                    },
                };
            },
            processValues (values) {
                return values;
            },
        },
    };
</script>
