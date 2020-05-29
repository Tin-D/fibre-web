<template>
    <div>
        <el-form size="mini" inline class="toolbar" v-if="showToolbar">
            <el-form-item>
                <el-input v-model="pagination.query.instanceName" placeholder="标题"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search">检索</el-button>
            </el-form-item>
        </el-form>

        <lan-server-table :pagination.sync="pagination"
                          :default-sort="pagination.defaultSort"
                          @load="load"
                          :max-height="maxHeight"
                          :show-operation-column="false"
        >
            <el-table-column prop="instanceName" label="标题" sortable="custom">
                <template slot-scope="{ row }">
                    <el-button type="text" @click.stop.prevent="$emit('row-click', row)" :title="row.instanceName">{{ row.instanceName }}</el-button>
                </template>
            </el-table-column>

            <el-table-column v-for="c of displayColumns"
                             :key="c.prop"
                             :prop="c.prop"
                             :label="c.label"
                             :formatter="c.formatter"
                             :sortable="c.sortable ? 'custom' : false"
            />
        </lan-server-table>
    </div>
</template>

<script>
    import LanServerTable from '@/roadhog/LanServerTable';
    import { Pagination } from '@/roadhog/Pagination';
    import { actionTypes } from '@/store/actionTypes';
    import { renderWorkflowAction, renderWorkflowTaskStatus, WorkflowTaskStatus } from '@/store/enum';

    export default {
        components: { LanServerTable },
        created () {
            if (this.initConditions) {
                Object.assign(this.pagination.query, this.initConditions);
            }

            this.load(true);
        },
        data () {
            return {
                pagination: new Pagination({
                    sortField: 'startDateTime',
                    sortOrder: 'desc',
                    workflowCode: this.workflowCode,
                    instanceName: null,
                    statuses: [],
                    executorIds: [],
                    actualExecutorIds: [],
                    startDateTimeRange: [],
                    finishDateTimeRange: [],
                }),
                columns: [
                    {
                        prop: 'workflowName',
                        label: '流程',
                        sortable: true,
                    },
                    {
                        prop: 'stepName',
                        label: '步骤',
                        sortable: true,
                    },
                    {
                        prop: 'status',
                        label: '状态',
                        sortable: true,
                        formatter: this.renderStatusRow,
                    },
                    {
                        prop: 'startDateTime',
                        label: '任务分配时间',
                        sortable: true,
                        formatter: this.renderDateTimeRow,
                    },
                    {
                        prop: 'finishDateTime',
                        label: '任务分配时间',
                        sortable: true,
                        formatter: this.renderDateTimeRow,
                    },
                    {
                        prop: 'deadline',
                        label: '超时时间',
                        sortable: true,
                        formatter: this.renderDateTimeRow,
                    },
                    {
                        prop: 'instanceStartUserFullName',
                        label: '发起人',
                        sortable: true,
                    },
                    {
                        prop: 'executorName',
                        label: '待办人/对象',
                        sortable: true,
                    },
                    {
                        prop: 'actualExecutorName',
                        label: '办理人',
                        sortable: true,
                    },
                    {
                        prop: 'action',
                        label: '动作',
                        sortable: true,
                        formatter: this.renderActionRow,
                    },
                ],
            };
        },
        computed: {
            displayColumns () {
                let c;
                if (this.pagination.query.statuses.includes(WorkflowTaskStatus.Todo)) {
                    c = ['workflowName', 'stepName', 'startDateTime', 'deadline', 'instanceStartUserFullName', 'executorName'];
                } else if (this.pagination.query.statuses.includes(WorkflowTaskStatus.Finish)) {
                    c = ['workflowName', 'startDateTime', 'finishDateTime', 'executorName', 'actualExecutorName', 'action'];
                }
                if (c) {
                    return _.filter(this.columns, n => c.includes(n.prop));
                }
                return this.columns;
            },
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.setPage(1);
                }

                const result = await this.$store.dispatch(`workflow/${actionTypes.workflow.getTasks}`, this.pagination.query);
                this.pagination.setResult(result);
                this.$emit('refresh', this.pagination.result.items);
            },
            renderStatusRow (row, column) {
                return renderWorkflowTaskStatus(row[column.property]);
            },
            renderActionRow (row, column) {
                return renderWorkflowAction(row[column.property]);
            },
        },
        props: {
            workflowCode: { // 流程代码
                type: String,
                required: false,
            },
            initConditions: {
                type: Object,
            },
            maxHeight: {
                type: Number,
                default: 1400,
            },
            showToolbar: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
