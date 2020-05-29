<template>
    <lan-form-dialog
        ref="lanDialog"
        title="修改用户信息"
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
            <el-form-item label="帐号" prop="username">
                <el-input v-model="form.username" disabled/>
            </el-form-item>

            <el-form-item label="姓名" prop="fullName">
                <el-input v-model="form.fullName" disabled/>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="邮箱"/>
            </el-form-item>

            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" placeholder="电话"/>
            </el-form-item>

            <el-form-item label="角色" prop="groups">
                <el-tag v-for="g of currentUser.groups"
                        :key="g.id"
                        style="margin-right: 10px;"
                >
                    {{ g.name }}
                </el-tag>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import axios from 'axios';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import * as validators from '@/roadhog/validators';
    import { actionTypes } from '@/store/actionTypes';

    export default {
        mixins: [formPageMixin(), dialogMixin()],
        methods: {
            initForm () {
                return {
                    username: {
                        default: this.currentUser.username,
                        rules: [validators.required()],
                    },
                    fullName: {
                        default: this.currentUser.fullName,
                        rules: [validators.required()],
                    },
                    email: {
                        default: this.currentUser.email,
                        rules: [validators.email()],
                    },
                    phone: {
                        default: this.currentUser.phone,
                    },
                };
            },
            async commit (values) {
                await axios.put('/user/user_profile', values);
                await this.$store.dispatch(actionTypes.auth.getCurrentUser);
                this.closeDialog();
            },
        },
    };
</script>
