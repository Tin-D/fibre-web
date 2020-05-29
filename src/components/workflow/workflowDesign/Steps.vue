<template>
    <div>
        <el-form size="mini">
            <el-form-item>
                <el-button icon="el-icon-plus" type="primary" @click="StepsEditorDialog.handleAdd">新增步骤</el-button>
            </el-form-item>
        </el-form>

        <lan-client-table :data="configs.steps"
                          :max-height="tableHeight"
                          :show-operation-column="false"
        >

            <el-table-column label="名称" prop="name"/>

            <el-table-column label="代码" prop="code"/>

            <el-table-column label="类型" prop="type">
                <template slot-scope="{ row }">
                    {{ renderWorkflowStepType(row.type) }}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="350">
                <template slot-scope="{ row }">
                    <el-button size="mini" icon="fa fa-arrow-up" @click="handleUp(row)">上移</el-button>
                    <el-button size="mini" icon="fa fa-arrow-down" @click="handleDown(row)">上移</el-button>
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="StepsEditorDialog.handleEdit(row)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="fa fa-trash" @click="StepsEditorDialog.handleRemove(row)"> 删除</el-button>
                </template>
            </el-table-column>

        </lan-client-table>

        <steps-editor v-if="StepsEditorDialog.show"
                      :current-step="StepsEditorDialog.currentStep"
                      :steps="configs.steps"
                      @close="StepsEditorDialog.handleClose"
        />
    </div>
</template>

<script>
    import LanClientTable from '@/roadhog/LanClientTable';
    import StepsEditor from '@/components/workflow/workflowDesign/StepsEditor';
    import { confirmDialog } from '@/roadhog/alert';
    import { renderWorkflowStepType } from '@/store/enum';

    export default {
        components: { StepsEditor, LanClientTable },
        data () {
            return {
                tableHeight: 500,
                StepsEditorDialog: {
                    show: false,
                    currentStep: null,
                    handleClose: (returnValue) => {
                        if (returnValue && returnValue.refresh) {
                            if (this.StepsEditorDialog.currentStep) {
                                Object.assign(this.StepsEditorDialog.currentStep, returnValue.step);
                            } else {
                                this.configs.steps.push(returnValue.step);
                            }
                        }
                        this.StepsEditorDialog.show = false;
                        this.StepsEditorDialog.currentStep = null;
                    },
                    handleAdd: () => {
                        this.StepsEditorDialog.show = true;
                        this.StepsEditorDialog.currentStep = null;
                    },
                    handleEdit: async (row) => {
                        this.StepsEditorDialog.show = true;
                        this.StepsEditorDialog.currentStep = row;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });
                        const index = this.configs.steps.indexOf(row);
                        this.configs.steps.splice(index, 1);
                    },
                },
            };
        },
        methods: {
            renderWorkflowStepType,
            handleUp (row) {
                const index = this.configs.steps.indexOf(row);
                if (index === 0) {
                    return;
                }
                this.configs.steps.splice(index, 1);
                this.configs.steps.splice(index - 1, 0, row);
            },
            handleDown (row) {
                const index = this.configs.steps.indexOf(row);
                if (index === this.configs.steps.length - 1) {
                    return;
                }
                this.configs.steps.splice(index, 1);
                this.configs.steps.splice(index + 1, 0, row);
            },
            validate () {
                return true;
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
