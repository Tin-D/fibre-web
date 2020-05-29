<template>
    <div v-loading="isLoading">
        <page-header/>

        <el-form inline class="toolbar" size="mini">
            <el-form-item title="名称">
                <el-input v-model.trim="pagination.query.name" placeholder="名称" clearable/>
            </el-form-item>

            <el-form-item title="创建用户名称">
                <el-input placeholder="创建用户名称" clearable v-model.trim="pagination.query.createUserFullName"/>
            </el-form-item>

            <el-form-item title="执行用户名称">
                <el-input placeholder="执行用户名称" clearable v-model.trim="pagination.query.finishUserFullName"/>
            </el-form-item>

            <el-form-item title="是否完成" >
                <el-select v-model="pagination.query.finish" clearable placeholder="请选择完成进度">
                    <el-option v-for="item in finish"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"/>
                </el-select>
            </el-form-item>

            <el-form-item title="任务类型">
                <task-type-selector v-model="pagination.query.taskType"/>
            </el-form-item>

            <el-form-item title="请选择日期">
                <el-date-picker
                    end-placeholder="结束日期"
                    range-separator="至"
                    start-placeholder="开始日期"
                    type="daterange"
                    v-model="pagination.query.searchTime">
                </el-date-picker>
                <span> : </span>
                <el-select clearable
                           filterable
                           placeholder="精准日期搜索"
                           style="width: 170px;"
                           title="精准日期搜索"
                           v-model="pagination.query.dateField">
                    <el-option
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        v-for="item in dateField">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="TaskEditorDialog.handleAdd">新增</el-button>
            </el-form-item>

        </el-form>

        <lan-server-table :pagination="pagination"
                          @load="load"
                          :max-height="tableHeight"
                          :default-sort="pagination.defaultSort"
                          @edit="TaskEditorDialog.handleEdit"
                          @remove="TaskEditorDialog.handleRemove"
                          :operationButtons="operationButtons"
                          :operationColumnWidth="230"
        >

            <el-table-column label="名称" prop="name" sortable="custom"/>

            <el-table-column label="编号" prop="code" sortable="custom"/>

            <el-table-column label="创建用户账号" prop="createUsername" sortable="custom"/>

            <el-table-column label="创建用户名称" prop="createUserFullName" sortable="custom"/>

            <el-table-column label="执行用户账号" prop="finishUserName" sortable="custom"/>

            <el-table-column label="执行用户名称" prop="finishUserFullName" sortable="custom"/>

            <el-table-column label="创建时间" prop="createTime" :formatter="renderDateTimeRow" sortable="custom"/>

            <el-table-column label="完成时间" prop="finishTime" :formatter="renderDateTimeRow" sortable="custom"/>

            <el-table-column :formatter="renderFinishRow" label="是否完成" prop="finish" sortable="custom"/>

            <el-table-column label="任务类型" prop="taskType" :formatter="renderTaskTypeRow" sortable="custom"/>

            <el-table-column label="备注" prop="remark" sortable="custom" />

        </lan-server-table>

        <task-editor v-if="TaskEditorDialog.show"
                     :id="TaskEditorDialog.id"
                     @close="TaskEditorDialog.handleClose"
                     @remove="TaskEditorDialog.handleRemove"/>

        <task-detail :id="TaskDetailDialog.id"
                     :task-data="TaskDetailDialog.taskData"
                     @close="TaskDetailDialog.handleClose"
                     v-if="TaskDetailDialog.show"/>

    </div>
</template>

<script>
    import { Pagination } from '@/roadhog/Pagination';
    import { actionTypes } from '@/store/actionTypes';
    import { confirmDialog } from '@/roadhog/alert';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import LanServerTable from '@/roadhog/LanServerTable';
    import TaskEditor from '@/components/task/TaskEditor';
    import TaskTypeSelector from '@/components/task/TaskTypeSelector';
    import TaskDetail from '@/components/task/TaskDetail';

    export default {
        mixins: [autoHeightTableMixin()],
        components: {
            LanServerTable,
            TaskEditor,
            TaskTypeSelector,
            TaskDetail,
        },
        data () {
            return {
                operationButtons: [{
                    text: '详情',
                    icon: 'el-icon-s-order',
                    handler: (row) => {
                        this.TaskDetailDialog.handleOpen(row);
                    },
                }],
                tableHeight: 0,
                isLoading: true,
                finish: [
                    {
                        label: '是',
                        value: true,
                    },
                    {
                        label: '否',
                        value: false,
                    },
                ],
                pagination: new Pagination({
                    sortField: 'name',
                    sortOrder: 'asc',
                    name: null,
                    taskType: null,
                    finish: null,
                    searchTime: null,
                    dateField: null,
                }),
                TaskEditorDialog: {
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.TaskEditorDialog.show = false;
                        this.TaskEditorDialog.id = null;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.TaskEditorDialog.show = true;
                        this.TaskEditorDialog.id = null;
                    },
                    handleEdit: (row) => {
                        this.TaskEditorDialog.show = true;
                        this.TaskEditorDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });

                        await this.$store.dispatch(`task/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
                TaskDetailDialog: {
                    show: false,
                    id: null,
                    taskData: null,
                    handleOpen: (row) => {
                        this.TaskDetailDialog.show = true;
                        this.TaskDetailDialog.id = row.id;
                        this.TaskDetailDialog.taskData = row;
                    },
                    handleClose: () => {
                        this.TaskDetailDialog.show = false;
                        this.TaskDetailDialog.id = null;
                    },
                },
                dateField: [
                    {
                        value: 'create_time',
                        label: '创建时间',
                    },
                    {
                        value: 'finish_time',
                        label: '完成时间',
                    },
                ],
            };
        },
        created () {
            this.load();
        },
        methods: {
            renderTaskTypeRow (row, column, cellValue) {
                let ret = '';
                switch (cellValue) {
                    case 'Maintenance':
                        ret = '运维任务';
                        break;
                    case 'Troubleshooting':
                        ret = '处障任务';
                        break;
                }
                return ret;
            },
            renderFinishRow (row, column, cellValue) {
                if (cellValue !== null) {
                    return cellValue ? '是' : '否';
                } else {
                    return null;
                }
            },
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.query.page = 1;
                }

                const response = await this.$store.dispatch(`task/${actionTypes.common.list}`, this.pagination.query);
                this.pagination.setResult(response);
                this.isLoading = false;
            },
        },
    };
</script>
