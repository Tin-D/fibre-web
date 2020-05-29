<template>
    <div v-loading="loading">
        <el-form class="toolbar" size="mini">
            <el-form class="toolbar" inline size="mini">
                <el-form-item title="返回查询页面">
                    <el-button @click="goBack" icon="el-icon-back" type="primary">返回</el-button>
                </el-form-item>

                <el-form-item title="维护完成">
                    <el-button @click="finishTask" icon="el-icon-success" ref="finishButton" type="success">维护完成</el-button>
                </el-form-item>

            </el-form>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="编号:" prop="code">{{taskData.code}}</el-form-item>

                    <el-form-item label="名称:">
                        {{taskData.name}}
                        <el-tag type="warning" v-if="taskData.finish === false">
                            <i class="el-icon-edit-outline"></i> 待处理
                        </el-tag>
                        <el-tag type="success" v-if="taskData.finish === true">
                            <i class="el-icon-check"></i> 已完成
                        </el-tag>
                    </el-form-item>

                    <el-form-item label="创建人:" prop="createUserFullName"><i aria-hidden="true" class="fa fa-user"></i> {{taskData.createUserFullName}}</el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="任务类型:" prop="taskType">
                        <el-tag>{{taskData.taskType==='Maintenance' ? '运维任务' : '处障任务'}}</el-tag>
                    </el-form-item>

                    <el-form-item label="创建时间:" prop="createTime">{{renderDateTime(taskData.createTime)}}</el-form-item>

                    <el-form-item label="客户:">{{taskData.taskDetailsVOS[0].customerName}}</el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-upload
            :accept="accept"
            :action="action"
            :file-list="fileList"
            :limit="1"
            :on-error="handleError"
            :on-success="handleSuccess"
            :show-file-list="false"
            name="files"
            style="display: inline-block;margin-left: 5px;">
            <el-button @click="uploadFile()" icon="el-icon-upload" size="mini" type="primary">上传运维模板</el-button>
        </el-upload>

        <lan-client-table :data="tableData"
                          :default-sort="{prop: 'equipmentName', order: 'ascending'}"
                          :max-height="tableHeight"
                          :show-operation-column="false"
                          pagination
        >
            <el-table-column label="名称" prop="equipmentName" sortable/>

            <el-table-column label="客户" prop="customerName" sortable/>

            <el-table-column label="机房" prop="computerRoomName" sortable/>

            <el-table-column :formatter="renderDictionaryCodeRow" label="设备类型" prop="equipmentTypeId" sortable/>

            <el-table-column :formatter="renderBrandNameRow" label="品牌型号" prop="equipmentBrandModelId" sortable/>

            <el-table-column label="序列号" prop="serialNumber" sortable/>

            <el-table-column label="维护等级" prop="maintenanceLevelName" sortable/>

            <el-table-column label="运维表格模板" prop="patrolExcelTemplates" v-if="false" width="350px;">
                <template slot-scope="{ row }">
                    <el-tag :key="t.id"
                            v-for="t of row.patrolExcelTemplates"
                    >
                        {{ t.name }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button @click="processInput(row)" icon="el-icon-edit" size="mini" type="primary">录入</el-button>
                </template>
            </el-table-column>
        </lan-client-table>

        <patrol-excel-process-dialog :computer-room-id="patrolExcelProcessDialog.computerRoomId"
                                     :equipment-id="patrolExcelProcessDialog.equipmentId"
                                     :patrol-excel-templates="patrolExcelProcessDialog.patrolExcelTemplates"
                                     :task-details-id="patrolExcelProcessDialog.id"
                                     :task-id="taskData.id"
                                     @close="patrolExcelProcessDialog.handleClose"
                                     v-if="patrolExcelProcessDialog.show"/>
    </div>
</template>

<script>
    import axios from 'axios';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { equipmentMixin } from '@/components/equipment/equipmentMixin';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import PatrolExcelProcessDialog from '@/components/taskProcess/PatrolExcelProcessDialog';

    export default {
        mixins: [equipmentMixin, autoHeightTableMixin()],
        components: {
            LanClientTable,
            PatrolExcelProcessDialog,
        },
        data () {
            return {
                tableHeight: 0,
                accept: '.rar, .zip, .7z',
                action: '',
                fileList: [],
                limit: null,
                loading: false,
                patrolExcelProcessDialog: {
                    id: null,
                    show: false,
                    equipmentId: null,
                    computerRoomId: null,
                    patrolExcelTemplates: null,
                    handleOpen: (row) => {
                        this.patrolExcelProcessDialog.show = true;
                        row.patrolExcelTemplates.forEach(i => {
                            if (i.name.includes('电源系统')) {
                                i.ref = 'powerSystem';
                            } else if (i.name.includes('关键点温度')) {
                                i.ref = 'keyPointsTemperature';
                            } else if (i.name.includes('设备属性')) {
                                i.ref = 'deviceProperties';
                            } else if (i.name.includes('消防系统')) {
                                i.ref = 'fireFightingSystem';
                            } else if (i.name.includes('巡检报告')) {
                                i.ref = 'inspectionReport';
                            } else if (i.name.includes('制冷系统')) {
                                i.ref = 'refrigerationSystem';
                            } else if (i.name.includes('机房环境检查表')) {
                                i.ref = 'computerRoomEnvironment';
                            } else if (i.name.includes('精密空调检查表')) {
                                i.ref = 'airConditionPatrol';
                            }
                        });
                        this.patrolExcelProcessDialog.id = row.id;
                        this.patrolExcelProcessDialog.equipmentId = row.equipmentId;
                        this.patrolExcelProcessDialog.computerRoomId = row.computerRoomId;
                        this.patrolExcelProcessDialog.patrolExcelTemplates = row.patrolExcelTemplates;
                    },
                    handleClose: () => {
                        this.patrolExcelProcessDialog.show = false;
                    },
                },
            };
        },
        computed: {
            tableData () {
                return this.taskData.taskDetailsVOS;
            },
        },
        methods: {
            goBack () {
                this.$emit('show', true);
            },
            async finishTask () {
                if (this.taskData.finish === true) {
                    this.$message.warning('该任务已维护完成，请勿重新维护');
                } else {
                    this.$confirm('确认维护完成?', '提示', {
                        closeOnClickModal: false,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(async () => {
                        await axios.put(`/task/finish_task/${this.taskData.id}`);
                        this.$message.success('维护成功!');
                    }).catch(() => {
                    });
                }
            },
            processInput (row) {
                this.patrolExcelProcessDialog.handleOpen(row);
            },
            async uploadFile () {
                this.action = `/api/task/upload_patrol_excel/${this.taskData.id}`;
            },
            handleSuccess (response) {
                this.loading = true;
                if (response.success) {
                    this.loading = false;
                    this.fileList = [];
                    this.$alert(response.message.replace(/n/g, '\n'), '已读数据', {
                        cancelButtonText: '确定',
                        type: 'success',
                    });
                } else {
                    this.loading = false;
                    this.fileList = [];
                    this.$alert(response.message, '提示', {
                        cancelButtonText: '确定',
                        type: 'error',
                    });
                }
            },
            handleError (err) {
                this.loading = true;
                if (err) {
                    this.loading = false;
                    this.fileList = [];
                    this.$message(err.message);
                }
            },
        },
        props: {
            taskData: {
                type: Object,
            },
        },
    };
</script>

<style>
    .el-message-box__message {
        white-space: pre-wrap;
    }
</style>
