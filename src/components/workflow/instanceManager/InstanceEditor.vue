<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @close="handleClose"
        :is-loading="false"
    >
        <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="基本信息" name="baseInfo">
                <base-info :recorder="instanceDetails || recorder"/>
            </el-tab-pane>
            <el-tab-pane label="任务管理" name="task" v-if="instanceDetails">
                <log-list :data="instanceDetails" :max-height="tableHeight" manager-mode @refresh="loadInstanceDetails"/>
            </el-tab-pane>
        </el-tabs>

        <div slot="buttons">
            <el-button size="mini" @click="loadInstanceDetails">刷新</el-button>
        </div>

    </lan-form-dialog>
</template>

<script>
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { renderWorkflowInstanceStatus } from '@/store/enum';
    import BaseInfo from '@/components/workflow/instanceManager/BaseInfo';
    import { actionTypes } from '@/store/actionTypes';
    import LogList from '@/components/workflow/workflowDesign/LogList';
    import { dialogAutoHeightTableMixin } from '@/components/common/autoHeightTableMixin';

    export default {
        components: { LogList, BaseInfo },
        mixins: [dialogMixin(), dialogAutoHeightTableMixin()],
        created () {
            this.loadInstanceDetails();
        },
        data () {
            return {
                tableHeight: 0,
                activeTab: 'baseInfo',
                instanceDetails: null,
            };
        },
        computed: {
            title () {
                return `流程实例管理: ${this.recorder.name} (${renderWorkflowInstanceStatus(this.instanceDetails?.status)})`;
            },
        },
        methods: {
            renderWorkflowInstanceStatus,
            async loadInstanceDetails () {
                this.instanceDetails = await this.$store.dispatch(`workflow/${actionTypes.workflow.getInstanceStatus}`, this.recorder.id);
                this.instanceDetails.workflowName = this.recorder.workflowName;
            },
        },
        props: {
            recorder: {
                type: Object,
                required: true,
            },
        },
    };
</script>
