<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="theTitle"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData"
        width="70%"
    >

        <el-tabs type="border-card" v-model="currentTab">
            <el-tab-pane label="基本信息" name="baseInfo">
                <base-info :configs.sync="form.configs" :is-create="isCreate" ref="baseInfo"/>
            </el-tab-pane>

            <el-tab-pane label="步骤配置" name="steps">
                <steps :configs.sync="form.configs" :is-create="isCreate" ref="steps"/>
            </el-tab-pane>

            <el-tab-pane label="配置信息" name="jsonInfo">
                <json-config :configs.sync="form.configs" ref="jsonInfo"/>
            </el-tab-pane>
        </el-tabs>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import BaseInfo from '@/components/workflow/workflowDesign/BaseInfo';
    import Steps from '@/components/workflow/workflowDesign/Steps';
    import JsonConfig from '@/components/workflow/workflowDesign/JsonConfig';
    import { actionTypes } from '@/store/actionTypes';
    import { alertError } from '@/roadhog/alert';

    const storeModuleName = 'workflow';

    class WorkflowConfig {
        constructor () {
            this.id = null;
            this.name = null;
            this.code = null;
            this.enable = true;
            this.admins = [];
            this.recorderCreatorClassName = null;
            this.enableCron = false;
            this.cronExpression = null;
            this.steps = [];
        }
    }

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        components: { Steps, BaseInfo, JsonConfig },
        watch: {
            async currentTab (newValue) {
                if (newValue === 'jsonInfo') {
                    this.$refs[newValue].read();
                }
            },
        },
        data () {
            const tabs = ['baseInfo', 'steps', 'jsonInfo'];
            return {
                partTitle: '流程',
                currentTab: tabs[0],
                tabs,
            };
        },
        methods: {
            initForm () {
                const self = this;
                return {
                    configs: {
                        set: (formData) => {
                            if (self.isCreate) {
                                return new WorkflowConfig();
                            } else {
                                const configs = JSON.parse(formData.configs);
                                if (!configs) {
                                    alertError('流程配置信息错误');
                                    this.closeDialog();
                                    return;
                                }

                                const result = new WorkflowConfig();
                                Object.assign(result, configs);
                                return result;
                            }
                        },
                    },
                };
            },
            async handleSubmit () {
                let valid = true;
                for (let t of this.tabs) {
                    try {
                        await this.$refs[t].validate();
                    } catch (e) {
                        valid = false;
                        this.currentTab = t;
                        return false;
                    }
                }

                if (valid) {
                    const recorder = {
                        name: this.form.configs.name,
                        code: this.form.configs.code,
                        configs: JSON.stringify(this.form.configs),
                    };
                    if (this.isCreate) {
                        await this.$store.dispatch(`workflow/${actionTypes.common.add}`, recorder);
                    } else {
                        recorder.id = this.id;
                        await this.$store.dispatch(`workflow/${actionTypes.common.edit}`, { id: this.id, data: recorder });
                    }
                    this.committed({ refresh: true });
                }
            },
        },
        computed: {
            theTitle () {
                if (this.isCreate) {
                    return '新增流程';
                } else {
                    return `修改流程: ${this.form?.configs?.name}`;
                }
            },
        },
    };
</script>
