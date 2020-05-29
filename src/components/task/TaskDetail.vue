<template>
    <div>
        <lan-form-dialog :is-loading="isLoadingFormData"
                         :title="title"
                         @close="handleClose"
                         @submit="handleSubmit"
                         fullscreen
                         ref="lanDialog"
        >
            <el-form :model="form"
                     :rules="rules"
                     label-width="100px"
                     ref="form"
                     size="mini"
                     v-if="!isLoadingFormData"
            >

                <el-row>

                    <el-col :span="12">
                        <el-form-item label="任务类型" prop="taskType">
                            <task-type-selector :disabled="!isCreate" style="width: 100%;" v-model="form.taskType"/>
                        </el-form-item>

                        <el-form-item label="名称" prop="name">
                            <el-input :disabled="!isCreate" label="名称" v-model="form.name"/>
                        </el-form-item>

                        <el-form-item label="创建人" prop="createUserFullName">
                            <el-input disabled v-model="form.createUserFullName"/>
                        </el-form-item>

                        <el-form-item label="备注" prop="createTime">
                            <el-input v-model="form.remark"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="编号" prop="code">
                            <el-input disabled v-model="form.code"/>
                        </el-form-item>

                        <el-form-item label="客户及机房" prop="computerRoomId">
                            <computer-room-selector :readonly="!isCreate"
                                                    emitPath
                                                    multiple
                                                    show-all-levels
                                                    v-model="form.computerRoomId"/>
                        </el-form-item>

                        <el-form-item label="创建时间" prop="createTime">
                            <el-input :value="renderDateTime(form.createTime)" disabled/>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>

            <el-divider content-position="left">包含的设备</el-divider>

            <lan-client-table :data="form.details"
                              :default-sort="{prop: 'equipmentName', order: 'ascending'}"
                              :max-height="500"
                              :show-operation-column="false"
                              v-if="!isLoadingFormData"
            >
                <el-table-column label="名称" prop="equipmentName" sortable>
                    <template slot-scope="{ row }">
                        <el-link :underline="false" @click="EquipmentDetailDialog.handleOpen(row)" type="primary">{{row.equipmentName}}</el-link>
                    </template>
                </el-table-column>

                <el-table-column label="客户" prop="customerName" sortable/>

                <el-table-column label="机房" prop="computerRoomName" sortable/>

                <el-table-column :formatter="renderDictionaryCodeRow" label="设备类型" prop="equipmentTypeId" sortable/>

                <el-table-column :formatter="renderBrandNameRow" label="品牌型号" prop="equipmentBrandModelId" sortable/>

                <el-table-column label="序列号" prop="serialNumber" sortable/>

                <el-table-column label="维护等级" prop="maintenanceLevelName" sortable/>

                <el-table-column label="运维表格模板" prop="patrolExcelTemplates" v-if="false">
                    <template slot-scope="{ row }">
                        <el-tag :key="t.id"
                                v-for="t of row.patrolExcelTemplates"
                        >
                            {{ t.name }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150px;">
                    <template slot-scope="{ row }">
                        <el-button @click="TaskRecordDialog.handleOpen(row)" icon="el-icon-chat-dot-round" size="mini" type="primary">查看</el-button>
                    </template>
                </el-table-column>
            </lan-client-table>

            <div slot="buttons">
                <el-button @click="taskProcess" icon="el-icon-edit-outline" size="mini" type="primary">任务办理</el-button>
                <el-button @click="downLoadAllPatrolExcel" icon="el-icon-download" size="mini" type="primary">下载运维表格</el-button>
            </div>

        </lan-form-dialog>

        <TaskRecord :info="TaskRecordDialog.info"
                    :task-id="taskData.id"
                    @close="TaskRecordDialog.handleClose"
                    v-if="TaskRecordDialog.show"
        />

        <equipment-editor :equipment-name="EquipmentDetailDialog.name"
                          @close="EquipmentDetailDialog.handleClose"
                          :id="EquipmentDetailDialog.id"
                          v-if="EquipmentDetailDialog.show"
                          detail
        />
    </div>
</template>

<script>
    /**
     * 任务详情Dialog
     */
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { models } from '@/store/models';
    import TaskTypeSelector from '@/components/task/TaskTypeSelector';
    import ComputerRoomSelector from '@/components/computerRoom/ComputerRoomSelector';
    import TaskRecord from '@/components/task/TaskRecord';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { equipmentMixin } from '@/components/equipment/equipmentMixin';
    import { actionTypes } from '@/store/actionTypes';
    import EquipmentEditor from '@/components/equipment/EquipmentEditor';

    const storeModuleName = models.task;

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin(), equipmentMixin],
        components: {
            LanClientTable,
            TaskTypeSelector,
            ComputerRoomSelector,
            TaskRecord,
            EquipmentEditor,
        },
        data () {
            return {
                tableHeight: 0,
                title: null,
                TaskRecordDialog: {
                    show: false,
                    info: null,
                    handleClose: () => {
                        this.TaskRecordDialog.show = false;
                    },
                    handleOpen: (row) => {
                        this.TaskRecordDialog.info = row;

                        this.TaskRecordDialog.show = true;
                    },
                },
                EquipmentDetailDialog: {
                    show: false,
                    id: null,
                    name: null,
                    handleClose: () => {
                        this.EquipmentDetailDialog.show = false;
                    },
                    handleOpen: (row) => {
                        this.EquipmentDetailDialog.name = row.equipmentName;
                        this.EquipmentDetailDialog.id = row.equipmentId;
                        this.EquipmentDetailDialog.show = true;
                    },
                },
            };
        },
        async created () {
            if (this.id) {
                const computerRoomIds = [];
                this.form.details = await this.$store.dispatch(`${storeModuleName}/${actionTypes.task.findDetails}`, this.id);
                this.title = this.recorder.name;
                this.form.details.forEach(i => {
                    computerRoomIds.push([i.customerId, i.computerRoomId]);
                });
                // const customerAndComputer = this.union(computerRoomIds);
                this.form.computerRoomId = computerRoomIds;
            }
        },
        methods: {
            union (computerRoomIds) {
                let result = computerRoomIds.reduce((function () {
                    let map = {};
                    return function (result, next) {
                        let key = next[0]; if (!map[key]) {
                            map[key] = true;
                            result.push(next);
                        } return result;
                    };
                })(), []);
                return result;
            },
            async downLoadAllPatrolExcel () {
                this.$store.dispatch(actionTypes.common.openNewWindow, `/task/download/${this.id}`); // 通过参数任务id下载全部Excel表格压缩包
            },
            taskProcess () {
                this.$router.push({ name: 'task_process', params: { id: this.taskData.code } });
            },
            initForm () {
                return {
                    taskType: {},
                    name: {},
                    code: {},
                    computerRoomId: {},
                    createUserFullName: {
                        default: this.currentUser.fullName,
                    },
                    finishUserFullName: {},
                    createTime: {},
                    finishTime: {},
                    finish: {},
                    details: {
                        default: [],
                    },
                    remark: {},
                };
            },
        },
        props: {
            taskData: {
                type: Object,
            },
        },
    };
</script>
