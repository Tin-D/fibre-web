<template>
    <lan-form-dialog
        ref="lanDialog"
        title="修改密码"
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

            <el-form-item label="当前密码" prop="oldPassword">
                <el-input type="password" v-model="form.oldPassword" placeholder="当前密码"/>
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.newPassword" placeholder="新密码"/>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="form.confirmPassword" placeholder="确认密码"/>
            </el-form-item>

            <el-form-item label="验证码" prop="code">
                <el-input v-model="form.code" placeholder="验证码" style="width: 138px;"/>

                <div style="position: absolute;
                                                top: 1px;
                                                left: 144px;
                                                width: 90px;
                                                height: 32px;
                                                overflow: hidden;
                                                -webkit-border-radius: 3px;
                                                -moz-border-radius: 3px;
                                                border-radius: 3px;
                                                border: 1px #66b1ff solid;"
                >
                    <img :src="validImgUrl"
                         @click="handleClickValidImage"
                         title="点击刷新"
                         style="margin-top: -1px;margin-left:-1px;"
                         alt="验证码"
                    />
                </div>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import axios from 'axios';
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { actionTypes } from '@/store/actionTypes';
    import { alertMessage } from '@/roadhog/alert';

    export default {
        mixins: [formPageMixin(), dialogMixin()],
        data () {
            return {
                validImgUrl: '/api/code_image',
            };
        },
        methods: {
            initForm () {
                const self = this;
                return {
                    oldPassword: {
                        rules: [validators.required()],
                    },
                    newPassword: {
                        rules: [
                            validators.required(),
                            validators.passwordValidator(
                                this.$store.state.global.webSettings.passwordLength,
                                this.$store.state.global.webSettings.passwordUseStrictPolicy
                            ),
                        ],
                    },
                    confirmPassword: {
                        rules: [
                            validators.required(),
                            validators.equal_to(self, { field: 'newPassword', message: '两次密码不相同' }),
                        ],
                    },
                    code: {
                        rules: [validators.required()],
                    },
                };
            },
            handleClickValidImage () {
                this.validImgUrl = `/api/code_image?time=${new Date().getMilliseconds()}`;
            },
            async commit (values) {
                try {
                    delete values.confirmPassword;
                    values.username = this.currentUser.username;
                    await axios.put('/user/reset_my_password', values, { formPost: true, loading: true });
                    await alertMessage('密码修改成功，请重新登录');
                    this.$store.dispatch(actionTypes.auth.logout);
                } catch {
                    this.handleClickValidImage();
                }
            },
        },
    };
</script>
