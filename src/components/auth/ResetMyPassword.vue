<template>
    <lan-form-dialog
        ref="lanDialog"
        title="修改密码"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="false"
    >

        <el-form v-if="!isLoadingFormData"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px"
                 size="mini"
                 v-loading="isLoading"
        >

            <el-form-item prop="oldPassword" label="旧密码">
                <el-input v-model="form.oldPassword" type="password" placeholder="旧密码"/>
            </el-form-item>

            <el-form-item prop="newPassword" label="新密码">
                <el-input v-model="form.newPassword" type="password" placeholder="新密码"/>
            </el-form-item>

            <el-form-item prop="confirmPassword" label="确认密码">
                <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码"/>
            </el-form-item>

            <el-form-item prop="code" v-if="webSettings.enableValidCode" label="验证码">
                <el-input v-model="form.code" placeholder="验证码" style="width: 200px;"/>

                <div style="position: absolute; top: -9px; left: 210px;">
                    <img :src="validImgUrl"
                         @click="handleClickValidImage"
                         title="点击刷新"
                         style="padding-top: 10px;"
                         alt="验证码"
                    />
                </div>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { alertError, alertMessage } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';

    export default {
        mixins: [formPageMixin(null), dialogMixin()],
        data () {
            return {
                validImgUrl: '/api/code_image',
                isLoading: false,
            };
        },
        computed: {
            webSettings () {
                return this.$store.state.global.webSettings;
            },
        },
        methods: {
            initForm () {
                const result = {
                    oldPassword: { rules: [validators.required()] },
                    newPassword: {
                        rules: [
                            validators.required(),
                            validators.passwordValidator(
                                this.$store.state.global.webSettings.passwordLength,
                                this.$store.state.global.webSettings.passwordUseStrictPolicy
                            ),
                        ],
                    },
                    confirmPassword: { rules: [validators.required(), validators.equal_to(this, { field: 'newPassword', message: '两次输入的密码不一致' })] },
                };

                if (this.webSettings.enableValidCode) {
                    result.code = { rules: [validators.required()] };
                }

                return result;
            },
            handleClickValidImage () {
                this.validImgUrl = `/api/code_image?time=${new Date().getMilliseconds()}`;
            },
            async commit (values) {
                values.username = this.username;
                const data = await this.$store.dispatch(`user/${actionTypes.user.resetMyPassword}`, values);
                if (data.success) {
                    alertMessage('修改成功，请您重新登录');
                    this.closeDialog({ refresh: true });
                } else {
                    let message = '';
                    if (data.message === 'valid code error') {
                        message = '验证码错误';
                    } else {
                        message = data.message;
                    }
                    alertError(message);
                    this.handleClickValidImage();
                }
            },
        },
        props: {
            username: {
                type: String,
                required: true,
            },
        },
        title: {
            type: String,
            default: '设置新密码',
        },
    };
</script>
