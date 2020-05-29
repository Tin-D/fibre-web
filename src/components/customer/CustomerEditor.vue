<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData"
    >

        <el-form v-if="!isLoadingFormData"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px"
                 size="mini">

            <el-form-item label="名称" prop="name">
                <el-input placeholder="名称" v-model="form.name"/>
            </el-form-item>

            <el-form-item label="联络人" prop="chargeUserFullName">
                <el-input placeholder="联络人" v-model="form.chargeUserFullName"/>
            </el-form-item>

            <el-form-item label="联系电话" prop="tel">
                <el-input placeholder="联系电话" v-model="form.chargeUserPhone"/>
            </el-form-item>

            <el-form-item label="邮箱" prop="chargeUserEmail">
                <el-input placeholder="邮箱" v-model="form.chargeUserEmail"/>
            </el-form-item>
        </el-form>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { models } from '@/store/models';

    const storeModuleName = models.customer;

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                partTitle: '客户',
            };
        },
        methods: {
            initForm () {
                return {
                    name: {
                        rules: [validators.required()],
                    },
                    chargeUserFullName: {},
                    chargeUserPhone: {},
                    chargeUserEmail: {
                        rules: [validators.email()],
                    },
                };
            },
        },
    };
</script>
