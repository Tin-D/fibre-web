<template>
    <div>
        <el-form size="mini" inline>
            <el-form-item label="流程状态">
                <el-tag>{{ renderWorkflowInstanceStatus(data.status) }}</el-tag>
            </el-form-item>
            <el-form-item label="查看模式">
                <el-radio v-model="mode" label="step" :disabled="isLoadStepTodoExecutors">按步骤</el-radio>
                <el-radio v-model="mode" label="task">按任务</el-radio>
            </el-form-item>

            <el-form-item v-if="managerMode">
                <el-button size="mini" @click="OrganizationSelectorDialog.handleOpen(null)">加签人员</el-button>
            </el-form-item>
        </el-form>

        <lan-client-table :data="displayData"
                          :max-height="maxHeight"
                          :show-operation-column="false"
        >

            <el-table-column type="expand" v-if="mode === 'step'">
                <template slot-scope="{ row }">
                    <el-table :data="row.tasks" border highlight-current-row stripe>
                        <el-table-column v-for="(value, key) of taskColumns"
                                         :key="key"
                                         :prop="key"
                                         :label="value.label"
                                         :sortable="value.sortable"
                                         :formatter="value.formatter"
                        />
                    </el-table>
                </template>
            </el-table-column>

            <el-table-column v-for="(value, key) of displayColumns"
                             :key="key"
                             :prop="key"
                             :label="value.label"
                             :sortable="value.sortable"
                             :formatter="value.formatter"
                             :width="value.width || 'auto'"
            />

            <el-table-column label="操作" :width="displayOperationColumn ? '130':'1'">
                <template slot-scope="{ row }" v-if="displayOperationColumn && row.status === WorkflowTaskStatus.Todo">
                    <el-button size="mini" type="text" title="取消当前任务" @click="cancelTask(row)" style="margin-left: 0">取消</el-button>
                    <el-button size="mini" type="text" title="将当前任务交给其他人处理" style="margin-left: 0"
                               @click="OrganizationSelectorDialog.handleOpen(row)">转办
                    </el-button>
                </template>
            </el-table-column>

        </lan-client-table>

        <organization-selector-dialog v-if="OrganizationSelectorDialog.show"
                                      :mode="['user']"
                                      :value="[]"
                                      @close="OrganizationSelectorDialog.handleClose"
        />
    </div>
</template>

<script>
    import axios from 'axios';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { renderWorkflowAction, renderWorkflowInstanceStatus, renderWorkflowTaskStatus, WorkflowTaskStatus } from '@/store/enum';
    import { alertError, confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import OrganizationSelectorDialog from '@/components/common/OrganizationSelectorDialog';

    const displayMode = {
        step: 'step',
        task: 'task',
    };

    export default {
        components: { OrganizationSelectorDialog, LanClientTable },
        created () {
            _.forOwn(this.taskColumns, (value, key) => {
                if (!['stepName'].includes(key)) {
                    this.shortTaskColumns[key] = value;
                }
            });

            if (this.data.steps) {
                try {
                    this.isLoadStepTodoExecutors = true;
                    _.forEach(this.data.steps, async (n) => {
                        this.stepExecutors[n.id] = await this.parseTodoExecutors(n.todoExecutors);
                    });
                } finally {
                    this.isLoadStepTodoExecutors = false;
                }
            }
        },
        data () {
            return {
                mode: displayMode.task,
                WorkflowTaskStatus,
                stepColumns: {
                    name: {
                        label: '步骤名称',
                    },
                    startTime: {
                        label: '开始时间',
                        formatter: this.renderDateTimeRow,
                    },
                    finishTime: {
                        label: '结束时间',
                        formatter: this.renderDateTimeRow,
                    },
                    result: {
                        label: '结果',
                        formatter: this.renderWorkflowActionRow,
                    },
                    todoExecutors: {
                        label: '待分配任务',
                        formatter: (row) => this.stepExecutors[row.id],
                    },
                },
                taskColumns: {
                    remark: {
                        label: '意见',
                    },
                    action: {
                        label: '动作',
                        formatter: this.renderWorkflowActionRow,
                        width: 80,
                    },
                    actualExecutorName: {
                        label: '执行人',
                        formatter: (row, column) => {
                            switch (row.status) {
                                case WorkflowTaskStatus.Todo:
                                case WorkflowTaskStatus.Cancel:
                                    return row.executorName;
                                case WorkflowTaskStatus.Finish:
                                    return row[column.property];
                                default:
                                    return null;
                            }
                        },
                        width: 100,
                    },
                    stepName: {
                        label: '步骤名称',
                        width: 100,
                    },
                    startDateTime: {
                        label: '开始时间',
                        formatter: this.renderDateTimeRow,
                        width: 85,
                    },
                    deadline: {
                        label: '超时时间',
                        formatter: this.renderDateTimeRow,
                        width: 85,
                    },
                    finishDateTime: {
                        label: '完成时间',
                        formatter: this.renderDateTimeRow,
                        width: 85,
                    },
                    status: {
                        label: '状态',
                        formatter: this.renderWorkflowTaskStatusRow,
                        width: 50,
                    },
                    description: {
                        label: '备注',
                    },
                },
                shortTaskColumns: {},
                stepExecutors: {},
                isLoadStepTodoExecutors: true,
                OrganizationSelectorDialog: {
                    show: false,
                    row: null,
                    handleClose: async (returnValue) => {
                        if (returnValue?.length > 0) {
                            // 检验当前人员是否有待办任务
                            const duplicateExecutor = this.data.executors.find(e => returnValue.find(i => i.id === e.id));
                            if (duplicateExecutor) {
                                await alertError(`用户'${duplicateExecutor.name}'已经拥有待办任务，不能重新分配。`);
                                return;
                            }

                            if (this.OrganizationSelectorDialog.row) {
                                await this.transfer(this.OrganizationSelectorDialog.row, returnValue[0].id);
                            } else {
                                await this.addExecutors(returnValue.map(i => i.id));
                            }
                        }
                        this.OrganizationSelectorDialog.show = false;
                        this.OrganizationSelectorDialog.row = null;
                    },
                    handleOpen: (row) => {
                        this.OrganizationSelectorDialog.show = true;
                        this.OrganizationSelectorDialog.row = row;
                    },
                },
            };
        },
        computed: {
            displayData () {
                if (!this.data.steps) {
                    return [];
                }

                if (this.mode === displayMode.step) {
                    return this.data.steps;
                } else if (this.mode === displayMode.task) {
                    const result = [];
                    _.forEach(this.data.steps, n => {
                        _.forEach(n.tasks, t => {
                            t.stepName = n.name;
                            result.push(t);
                        });
                    });
                    return result;
                } else {
                    return [];
                }
            },
            displayColumns () {
                if (this.mode === displayMode.step) {
                    return this.stepColumns;
                } else if (this.mode === displayMode.task) {
                    return this.taskColumns;
                }
                return null;
            },
            displayOperationColumn () {
                return this.managerMode && this.mode === displayMode.task;
            },
        },
        methods: {
            renderWorkflowInstanceStatus,
            renderStatusRow (row, column) {
                return renderWorkflowTaskStatus(row[column.property]);
            },
            renderWorkflowActionRow (row, column) {
                return renderWorkflowAction(row[column.property]);
            },
            renderWorkflowTaskStatusRow (row, column) {
                return renderWorkflowTaskStatus(row[column.property]);
            },
            async parseTodoExecutors (value) {
                if (!value) {
                    return null;
                }

                const executorIds = [];
                _.forEach(JSON.parse(value), n => {
                    if (n.includes('$gfw_add_user$')) {
                        const parse = JSON.parse(n.substring('$gfw_add_user$'.length));
                        executorIds.push(parse.executorId);
                    } else {
                        executorIds.push(n);
                    }
                });

                const { data } = await axios.post('/workflow/parse_executor', executorIds);
                return _.map(data, 'name').join(';');
            },
            async cancelTask (row) {
                await confirmDialog({ message: '如果该任务是当前步骤的最后一个任务，会导致该流程实例挂起。确定要取消该任务吗' });
                await this.$store.dispatch(`workflow/${actionTypes.workflow.cancelTask}`, { instanceId: this.data.id, taskId: row.id });
                this.$emit('refresh', this.data.id);
            },
            async addExecutors (executorIds) {
                await this.$store.dispatch(`workflow/${actionTypes.workflow.addExecutorsToStep}`, { instanceId: this.data.id, executorIds });
                this.$emit('refresh', this.data.id);
            },
            async transfer (row, executorId) {
                await this.$store.dispatch(`workflow/${actionTypes.workflow.transfer}`, {
                    instanceId: this.data.id,
                    taskId: row.id,
                    toUserId: executorId,
                    remark: '任务转办',
                });
                this.$emit('refresh', this.data.id);
            },
        },
        props: {
            data: {
                type: Object,
                required: true,
            },
            maxHeight: {
                type: Number,
                default: 500,
            },
            managerMode: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
