<template>
    <div>
        <page-header/>
        <div v-if="!isLoading">
            <fieldset>
                <legend>网站Logo图标</legend>

                <div>
                    <input type="file" @change="handleLogoChange"/>
                </div>

                <el-image fit="fill" style="height: 71px; width: 163px;" :src="form.logo"/>
            </fieldset>

            <fieldset>
                <legend>密码策略</legend>

                <el-form size="mini" label-position="left" label-width="100px">
                    <el-form-item label="复杂度">
                        <el-checkbox label="包含大写字母" v-model="form.passwordPolicy.upperLetter"/>
                        <el-checkbox label="包含小写字母" v-model="form.passwordPolicy.lowerLetter"/>
                        <el-checkbox label="包含特殊字符( `~!@#$%^&*()[]{} )" v-model="form.passwordPolicy.specialLetter"/>
                    </el-form-item>

                    <el-form-item label="最小长度">
                        <el-input-number v-model.number="form.passwordPolicy.minLength" :min="5"/>
                    </el-form-item>

                    <el-form-item label="有效期（天）">
                        <el-input-number v-model.number="form.passwordPolicy.validity" :min="0"/>
                        <span style="margin-left: 5px;">0代表永不过期</span>
                    </el-form-item>
                </el-form>

            </fieldset>

            <fieldset>
                <legend>登录失败策略</legend>

                <el-form size="mini" label-position="left" label-width="100px">
                    <el-form-item label="策略详情">
                        <el-input-number :min="1" v-model="form.loginPolicy.timeRangeMinutes"/>
                        分钟内，
                        连续登录失败
                        <el-input-number :min="0" v-model="form.loginPolicy.maxFailedTimes"/>
                        次（0表示没有限制），锁定帐户
                    </el-form-item>
                </el-form>
            </fieldset>

            <fieldset>
                <legend>用户手册</legend>

                <file-list :limit="1" :recorder-id="form.userManualRecorderId" v-model="form.userManual"/>
            </fieldset>

            <div style="margin-top: 10px;">
                <el-button type="primary" icon="fa fa-save" size="mini" @click="handleSave"> 保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { alertError, alertMessage } from '@/roadhog/alert';
    import FileList from '@/components/common/FileList';
    import defaultLogo from '@/assets/images/logo.png';
    import { generateFileJson } from '@/roadhog/utils';

    const url = '/dynamic_system_configs';

    const USER_MANUAL_URL = '/user_manual';

    export default {
        components: { FileList },
        created () {
            this.load();
        },
        data () {
            return {
                isLoading: true,
                form: {
                    passwordPolicy: {
                        upperLetter: false,
                        lowerLetter: false,
                        numberLetter: false,
                        specialLetter: false,
                        minLength: 5,
                        validity: 0,
                    },
                    loginPolicy: {
                        maxFailedTimes: 0,
                        timeRangeMinutes: 60,
                    },
                    logo: null,
                    userManualRecorderId: null,
                    userManual: null,
                },
            };
        },
        methods: {
            async loadDynamicConfigs () {
                const { data } = await axios.get(url);
                _.forEach(data, ({ configType, config }) => {
                    const configKey = _.camelCase(configType);
                    switch (configKey) {
                        case 'passwordPolicy':
                            Object.assign(this.form[configKey], JSON.parse(config));
                            break;
                        case 'logo':
                            this.form[configKey] = JSON.parse(config);
                            break;
                        case 'loginPolicy':
                            Object.assign(this.form[configKey], JSON.parse(config));
                            break;
                        default:
                            break;
                    }
                });
                if (!this.form.logo) {
                    this.form.logo = defaultLogo;
                }
            },
            async loadUserManual () {
                const { data } = await axios.get(`${USER_MANUAL_URL}/get_last`);
                if (data) {
                    this.form.userManualRecorderId = data.attachmentListToken;
                }
            },
            async handleLogoChange (e) {
                const files = e.target.files;
                if (!files || files.length === 0) {
                    return;
                }

                const logoFile = await generateFileJson(e.target.files[0]);
                if (!['image/png', 'image/jpg', 'image/jpeg'].includes(logoFile.contentType)) {
                    await alertError('只允许上传: png, jpg类型的文件');
                    return;
                }

                this.form.logo = `data:${logoFile.contentType};base64,${logoFile.content}`;
            },
            async load () {
                return Promise.all([
                    this.loadDynamicConfigs(),
                    this.loadUserManual(),
                ]).finally(() => {
                    this.isLoading = false;
                });
            },
            async handleSave () {
                const values = {};
                _.forOwn(this.form, (value, key) => {
                    if (!['userManualRecorderId', 'userManual'].includes(key)) {
                        values[_.upperFirst(key)] = JSON.stringify(value);
                    }
                });
                await axios.put(url, values);

                // 保存用户手册
                if (this.form.userManual && !this.form.userManual.token) {
                    await axios.post(USER_MANUAL_URL, this.form.userManual);
                }

                alertMessage('保存成功');
                this.load();
            },
        },
    };
</script>
