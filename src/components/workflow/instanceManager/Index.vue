<template>
    <div>
        <page-header/>

        <el-form class="toolbar" inline size="mini">
            <el-form-item v-if="multiple">
                <el-select v-model="currentWorkflowCode" default-first-option>
                    <el-option v-for="w of workflows"
                               :key="w.id"
                               :label="w.name"
                               :value="w.code"
                    />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="标题" v-model="pagination.query.instanceName" clearable/>
            </el-form-item>

<!--            <el-form-item>-->
<!--                <el-input placeholder="流程名称" v-model="pagination.query.workflowName" clearable/>-->
<!--            </el-form-item>-->

            <el-form-item>
                <organization-input v-model="pagination.query.startUserId" placeholder="发起人（单选）" :max-items="1" :mode="['user']"/>
            </el-form-item>

            <el-form-item>
                <el-select v-model="pagination.query.status" clearable placeholder="状态">
                    <el-option v-for="k of Object.keys(WorkflowInstanceStatus)"
                               :key="k"
                               :label="renderWorkflowInstanceStatus(k)"
                               :value="k"
                    />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">检索</el-button>
            </el-form-item>
        </el-form>

        <lan-server-table :pagination="pagination"
                          :max-height="tableHeight"
                          :default-sort="pagination.defaultSort"
                          :show-operation-column="false"
                          @load="load"
        >
            <el-table-column label="标题" prop="name" sortable="custom">
                <template slot-scope="{ row }">
                    <el-button type="text" size="mini" :title="row.name" @click="InstanceEditorDialog.handleView(row)">{{ row.name }}</el-button>
                </template>
            </el-table-column>

            <el-table-column label="流程名称" prop="workflowId" sortable="custom" width="200px">
                <template slot-scope="{ row }">
                    {{ row.workflowName }}
                </template>
            </el-table-column>

            <el-table-column label="步骤" prop="currentStepId" sortable="custom" width="200px">
                <template slot-scope="{ row }">
                    {{ row.currentStepName }}
                </template>
            </el-table-column>

            <el-table-column label="发起人" prop="startUserFullName" sortable="custom" width="100px"/>

            <el-table-column label="状态" prop="status" :formatter="renderWorkflowInstanceStatusRow" sortable="custom" width="100px"/>

            <el-table-column label="开始时间" prop="startTime" :formatter="renderDateTimeRow" sortable="custom" width="150px"/>

            <el-table-column label="结束时间" prop="finishTime" :formatter="renderDateTimeRow" sortable="custom" width="150px"/>
        </lan-server-table>

        <instance-editor v-if="InstanceEditorDialog.show"
                         :recorder="InstanceEditorDialog.recorder"
                         @close="InstanceEditorDialog.handleClose"
        />
    </div>
</template>

<script>
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import { Pagination } from '@/roadhog/Pagination';
    import { actionTypes } from '@/store/actionTypes';
    import LanServerTable from '@/roadhog/LanServerTable';
    import { renderWorkflowInstanceStatus, renderWorkflowTaskStatus, WorkflowInstanceStatus } from '@/store/enum';
    import OrganizationInput from '@/components/common/OrganizationInput';
    import InstanceEditor from '@/components/workflow/instanceManager/InstanceEditor';

    export default {
        components: { OrganizationInput, LanServerTable, InstanceEditor },
        mixins: [autoHeightTableMixin()],
        async created () {
            this.multiple = _.isArray(this.workflowCode);
            if (this.multiple) {
                this.workflows = await this.$store.dispatch(`workflow/${actionTypes.workflow.parseWorkflow}`, this.workflowCode);
                this.currentWorkflowCode = this.workflows[0].code;
            } else {
                this.currentWorkflowCode = this.workflowCode;
            }
            this.load();
        },
        data () {
            return {
                tableHeight: 0,
                workflows: [],
                currentWorkflowCode: null,
                multiple: false,
                WorkflowInstanceStatus,
                pagination: new Pagination({
                    sortField: 'startTime',
                    sortOrder: 'desc',
                    instanceName: null,
                    workflowName: null,
                    startUserId: [],
                    workflowCode: null,
                    status: WorkflowInstanceStatus.Running,
                }),
                InstanceEditorDialog: {
                    show: false,
                    recorder: null,
                    handleClose: () => {
                        this.InstanceEditorDialog.show = false;
                        this.InstanceEditorDialog.recorder = null;
                        this.load();
                    },
                    handleView: (row) => {
                        this.InstanceEditorDialog.show = true;
                        this.InstanceEditorDialog.recorder = row;
                    },
                },
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (!this.currentWorkflowCode) {
                    return;
                }

                if (gotoFirstPage) {
                    this.pagination.setPage(1);
                }

                const query = _.cloneDeep(this.pagination.query);
                query.workflowCode = this.currentWorkflowCode;

                query.startUserId = query.startUserId.length > 0 ? query.startUserId[0] : null;
                query.status = query.status === '' ? null : query.status;
                const result = await this.$store.dispatch(`workflow/${actionTypes.workflow.getInstances}`, query);
                this.pagination.setResult(result);
            },
            renderWorkflowInstanceStatus,
            renderWorkflowInstanceStatusRow (row, column) {
                return renderWorkflowInstanceStatus(row[column.property]);
            },
            renderWorkflowTaskStatusRow (row, column) {
                return renderWorkflowTaskStatus(row[column.property]);
            },
        },
        watch: {
            currentWorkflowCode () {
                this.load();
            },
        },
        props: {
            workflowCode: {
                type: [String, Array],
            },
        },
    };
</script>
