<template>
    <el-form ref="form"
             :model="configs"
             :rules="rules"
             label-width="120px"
             size="mini"
    >

        <el-form-item label="名称" prop="name">
            <el-input v-model.trim="configs.name" placeholder="名称"/>
        </el-form-item>

        <el-form-item label="代码" prop="code">
            <el-input v-model.trim="configs.code" placeholder="创建后不允许修改" :disabled="!isCreate"/>
        </el-form-item>

        <el-form-item label="启用" prop="enable">
            <el-checkbox v-model="configs.enable"/>
            <span style="margin-left: 10px;">如果禁用，该流程无法启动新的实例，已启动的实例不受影响</span>
        </el-form-item>

        <el-form-item label="表单记录生成类" prop="recorderCreatorClassName">
            <el-input v-model.trim="configs.recorderCreatorClassName" placeholder="例如：com.xmgsd.boa.controller.ReceiveController"/>
        </el-form-item>

        <el-form-item label="流程管理员" prop="admins">
            <organization-input v-model="configs.admins" :mode="['user', 'department', 'post', 'group']"/>
        </el-form-item>

<!--        <el-form-item label="定时发起" prop="enableCron">-->
<!--            <el-checkbox v-model="configs.enableCron"/>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="定时策略" prop="cronExpression" v-if="configs.enableCron">-->
<!--            <el-input placeholder="cron表达式" v-model="configs.cronExpression">-->
<!--                <el-button type="default" slot="append" @click="handleParseCronExpression">测试表达式</el-button>-->
<!--            </el-input>-->
<!--        </el-form-item>-->
    </el-form>
</template>

<script>
    import * as validators from '@/roadhog/validators';
    import { actionTypes } from '@/store/actionTypes';
    import OrganizationInput from '@/components/common/OrganizationInput';
    import { alertMessage } from '@/roadhog/alert';

    export default {
        components: { OrganizationInput },
        data () {
            return {
                rules: {
                    name: [
                        validators.required(),
                        validators.validateAsync(async (value) => {
                            return this.$store.dispatch(`workflow/${actionTypes.common.checkUnique}`, {
                                id: this.configs.id,
                                property: 'name',
                                value,
                            });
                        }),
                    ],
                    code: [
                        validators.required(),
                        validators.validateAsync(async (value) => {
                            return this.$store.dispatch(`workflow/${actionTypes.common.checkUnique}`, {
                                id: this.configs.id,
                                property: 'code',
                                value,
                            });
                        }, '该代码已经被使用'),
                    ],
                    recorderCreatorClassName: [
                        validators.validateAsync(async (value) => {
                            if (value == null || value === '') {
                                return true;
                            }
                            return this.$store.dispatch(`workflow/${actionTypes.workflow.checkRecorderCreatorClassName}`, value);
                        }, '找不到这个类'),
                    ],
                    cronExpression: [
                        validators.required.bind(this)({ onlyIf: 'enableCron', formProperty: 'configs' }),
                    ],
                },
                OrganizationSelectorDialog: {
                    show: false,
                    handleOpen: () => {
                        this.OrganizationSelectorDialog.show = false;
                    },
                    handleClose: () => {

                    },
                },
            };
        },
        methods: {
            async validate () {
                await this.$refs.form.validate();
                return true;
            },
            async handleParseCronExpression () {
                if (this.configs.cronExpression) {
                    const result = await this.$store.dispatch(`workflow/${actionTypes.workflow.parseCronExpression}`, this.configs.cronExpression);
                    let message = '<div>最近10次执行时间如下:</div>';
                    _.forEach(result, r => {
                        message += `<div style="color: green;">${this.renderDateTime(r)}</div>`;
                    });
                    alertMessage(message, true);
                }
            },
        },
        props: {
            isCreate: {
                type: Boolean,
                required: true,
            },
            configs: {
                type: Object,
                required: true,
            },
        },
    };
</script>
