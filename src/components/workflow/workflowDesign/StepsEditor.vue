<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="false"
        width="70%"
    >

        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="120px"
                 size="mini"
        >

            <el-form-item label="名称" prop="name">
                <el-input v-model.trim="form.name"/>
            </el-form-item>

            <el-form-item label="代码" prop="code">
                <el-input v-model.trim="form.code"/>
            </el-form-item>

            <el-form-item label="步骤类型" prop="type">
                <el-radio v-model="form.type" label="OneOf">多人共同执行</el-radio>
                <el-radio v-model="form.type" label="Parallel">并行</el-radio>
                <el-radio v-model="form.type" label="Serial">串行</el-radio>
            </el-form-item>

            <el-form-item label="超时时间(小时)" prop="deadline">
                <el-input v-model="form.deadline" placeholder="不填代表没有超时"/>
            </el-form-item>

            <el-form-item label="执行者模式" prop="executorMode">
                <el-radio v-model="form.executorMode" label="0">人员选择器</el-radio>
                <el-radio v-model="form.executorMode" label="1">表达式</el-radio>
                <el-radio v-model="form.executorMode" label="2">无执行者</el-radio>
            </el-form-item>

            <el-form-item label="执行者" prop="executor" v-show="form.executorMode !== '2'">
                <organization-input v-model="form.executorIds"
                                    :mode="['department', 'user', 'post', 'group']"
                                    v-if="form.executorMode === '0'"
                                    style="width: 100%;"
                />
                <el-input v-model="form.executorExpression" placeholder="执行者表达式" v-else/>
            </el-form-item>

            <el-form-item label="执行者按组分配" prop="keepExecutorId" v-show="form.executorMode !== '2'">
                <el-checkbox v-model="form.keepExecutorId"/>
            </el-form-item>

            <el-form-item label="无执行者策略" prop="emptyExecutorFailed">
                <el-switch
                    v-model="form.emptyExecutorFailed"
                    active-text="报错"
                    inactive-text="该步骤按 '同意' 执行">
                </el-switch>
            </el-form-item>

            <el-form-item label="额外参数配置" prop="extendInfo">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="额外参数配置"
                    v-model="form.extendInfo"
                />
            </el-form-item>

        </el-form>

        <el-form size="mini">
            <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="BranchEditorDialog.handleAdd">新增分支</el-button>
                <strong style="color: red; margin-left: 5px;">
                    分支按照先后顺序执行，且匹配到第一个成功后就会忽略后面的分支，空白条件分支默认成立，且总是最后执行
                </strong>
            </el-form-item>
        </el-form>

        <lan-client-table :data="form.branches"
                          :max-height="300"
                          :show-operation-column="false"
        >

            <el-table-column label="名称" prop="name"/>

            <el-table-column label="条件" prop="expression"/>

            <el-table-column label="步骤" prop="stepCode">
                <template slot-scope="{ row }">
                    <span v-if="getStepName(row)">
                        {{ getStepName(row) }} ({{ row.stepCode }})
                    </span>
                    <strong style="color: red" v-else>
                        找不到这个步骤: {{ row.stepCode }}
                    </strong>
                </template>
            </el-table-column>

            <el-table-column label="启用" prop="enable" :formatter="renderBooleanRow"/>

            <el-table-column label="操作" width="350">
                <template slot-scope="{ row }">
                    <el-button size="mini" icon="fa fa-arrow-up" @click="BranchEditorDialog.handleUp(row)">上移</el-button>
                    <el-button size="mini" icon="fa fa-arrow-down" @click="BranchEditorDialog.handleDown(row)">上移</el-button>
                    <el-button size="mini" icon="fa fa-edit" @click="BranchEditorDialog.handleEdit(row)" type="primary"> 编辑</el-button>
                    <el-button size="mini" icon="fa fa-trash" @click="BranchEditorDialog.handleRemove(row)" type="danger"> 删除</el-button>
                </template>
            </el-table-column>

        </lan-client-table>

        <branch-editor v-if="BranchEditorDialog.show"
                       :branch="BranchEditorDialog.branch"
                       :steps="steps"
                       @close="BranchEditorDialog.handleClose"
        />
    </lan-form-dialog>
</template>

<script>
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import OrganizationInput from '@/components/common/OrganizationInput';
    import LanClientTable from '@/roadhog/LanClientTable';
    import BranchEditor from '@/components/workflow/workflowDesign/BranchEditor';
    import { confirmDialog } from '@/roadhog/alert';

    class Step {
        constructor () {
            this.name = null;
            this.code = null;
            this.deadline = null;
            this.executorMode = '0';
            this.executor = null;
            this.executorIds = [];
            this.emptyExecutorFailed = true;
            this.executorExpression = null;
            this.keepExecutorId = false;
            this.type = 'OneOf';
            this.extendInfo = null;
            this.branches = [];
        }
    }

    export default {
        components: { BranchEditor, LanClientTable, OrganizationInput },
        mixins: [dialogMixin()],
        watch: {
            'form.executorMode' (newValue) {
                if (newValue === '0') {
                    this.form.executor = [];
                } else if (newValue === '1') {
                    this.form.executor = null;
                } else {
                    this.form.emptyExecutorFailed = false;
                }
            },
        },
        data () {
            const title = this.currentStep ? `修改步骤: ${this.currentStep.name}` : '新增步骤';
            const form = new Step();
            if (this.currentStep) {
                Object.assign(form, this.currentStep);
                if (form.executorMode === '0') {
                    form.executorIds = form.executor ? JSON.parse(form.executor) : [];
                } else {
                    form.executorExpression = form.executor;
                }
            }

            return {
                title,
                form,
                rules: {
                    name: [validators.required()],
                    code: [validators.required()],
                },
                BranchEditorDialog: {
                    show: false,
                    branch: null,
                    handleClose: (returnValue) => {
                        if (returnValue?.refresh) {
                            if (this.BranchEditorDialog.branch) {
                                Object.assign(this.BranchEditorDialog.branch, returnValue.branch);
                            } else {
                                form.branches.push(returnValue.branch);
                            }
                        }

                        this.BranchEditorDialog.show = false;
                        this.BranchEditorDialog.branch = null;
                    },
                    handleAdd: () => {
                        this.BranchEditorDialog.show = true;
                        this.BranchEditorDialog.branch = null;
                    },
                    handleEdit: (row) => {
                        this.BranchEditorDialog.show = true;
                        this.BranchEditorDialog.branch = row;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });
                        const index = this.form.branches.indexOf(row);
                        this.form.branches.splice(index, 1);
                    },
                    handleUp: (row) => {
                        const index = this.form.branches.indexOf(row);
                        if (index === 0) {
                            return;
                        }
                        this.form.branches.splice(index, 1);
                        this.form.branches.splice(index - 1, 0, row);
                    },
                    handleDown: (row) => {
                        const index = this.form.branches.indexOf(row);
                        if (index === this.form.branches.length - 1) {
                            return;
                        }
                        this.form.branches.splice(index, 1);
                        this.form.branches.splice(index + 1, 0, row);
                    },
                },
            };
        },
        methods: {
            getStepName (row) {
                const value = row.stepCode;
                if (value) {
                    return this.steps.find(s => s.code === value)?.name;
                }
                return null;
            },
            async handleSubmit () {
                await this.$refs.form.validate();
                const values = this.processValues(this.form);
                this.closeDialog({ refresh: true, step: values });
            },
            processValues (values) {
                if (values.executorMode === '0') {
                    values.executor = JSON.stringify(values.executorIds);
                } else if (values.executorMode === '1') {
                    values.executor = values.executorExpression;
                } else {
                    values.executor = '';
                    values.emptyExecutorFailed = false;
                }
                delete values.executorIds;
                delete values.executorExpression;
                return values;
            },
        },
        props: {
            currentStep: {
                type: Object,
            },
            steps: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
