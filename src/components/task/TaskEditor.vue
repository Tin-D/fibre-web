<template>
    <lan-form-dialog ref="lanDialog"
                     :title="title"
                     @submit="handleSubmit"
                     @close="handleClose"
                     :is-loading="isLoadingFormData"
                     fullscreen
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
                        <task-type-selector style="width: 100%;" v-model="form.taskType"/>
                    </el-form-item>

                    <el-form-item label="名称" prop="name">
                        <el-input label="名称" v-model="form.name"/>
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
                        <computer-room-selector :id="id"
                                                @returnVal="returnVal"
                                                multiple
                                                emitPath
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

        <el-button @click="EquipmentSelectorDialog.handleView" size="mini" type="primary">添加设备</el-button>

        <lan-client-table :data="form.taskDetailsVOS"
                          v-if="!isLoadingFormData"
                          :max-height="500"
                          :default-sort="{prop: 'equipmentName', order: 'ascending'}"
                          :show-operation-column="false"
        >
            <el-table-column prop="equipmentName" label="名称" sortable/>

            <el-table-column label="客户" prop="customerName" sortable/>

            <el-table-column label="机房" prop="computerRoomName" sortable/>

            <el-table-column prop="equipmentTypeId" label="设备类型" :formatter="renderDictionaryCodeRow" sortable/>

            <el-table-column prop="equipmentBrandModelId" label="品牌型号" :formatter="renderBrandNameRow" sortable/>

            <el-table-column label="序列号" prop="serialNumber" sortable/>

            <el-table-column label="维护等级" prop="maintenanceLevelName" sortable/>

            <el-table-column label="操作" width="80">
                <template slot-scope="{ row }">
                    <el-button type="text" @click="EquipmentSelectorDialog.handleRemove(row)">删除</el-button>
                </template>
            </el-table-column>
        </lan-client-table>

        <equipment-selector v-if="EquipmentSelectorDialog.show"
                            :computer-rooms="EquipmentSelectorDialog.computerRooms"
                            @close="EquipmentSelectorDialog.handleClose"
        />

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { models } from '@/store/models';
    import TaskTypeSelector from '@/components/task/TaskTypeSelector';
    import ComputerRoomSelector from '@/components/computerRoom/ComputerRoomSelector';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { equipmentMixin } from '@/components/equipment/equipmentMixin';
    import EquipmentSelector from '@/components/task/EquipmentSelector';
    import { alertError, confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import { getterTypes } from '@/store/getterTypes';

    const storeModuleName = models.task;

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin(), equipmentMixin],
        components: {
            EquipmentSelector,
            LanClientTable,
            TaskTypeSelector,
            ComputerRoomSelector,
        },
        data () {
            return {
                tableHeight: 0,
                partTitle: '任务',
                EquipmentSelectorDialog: {
                    show: false,
                    id: null,
                    computerRooms: null,
                    handleClose: (returnValue) => {
                        if (returnValue?.length > 0) {
                            const selectedDetails = returnValue.map(i => ({
                                equipmentId: i.id,
                                equipmentName: i.name,
                                equipmentTypeId: this.equipmentTypeId(i.brandModelId),
                                equipmentBrandModelId: i.brandModelId,
                                maintenanceLevelId: i.maintenanceLevel.id,
                                maintenanceLevelName: i.maintenanceLevel.name,
                                customerName: i.customerName,
                                computerRoomName: i.computerRoomName,
                                serialNumber: i.serialNumber,
                                taskId: this.id,
                            }));
                            this.form.taskDetailsVOS = _.unionBy(selectedDetails, this.form.taskDetailsVOS, 'equipmentId'); // 将返回的数据相同的equipmentId重
                        }
                        this.EquipmentSelectorDialog.show = false;
                    },
                    handleView: () => {
                        if (this.form.computerRoomId) {
                            this.EquipmentSelectorDialog.show = true;
                        } else {
                            alertError('请先选择客户及机房');
                        }
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.equipmentName });
                        this.form.taskDetailsVOS = _.filter(this.form.taskDetailsVOS, i => i.equipmentId !== row.equipmentId);
                    },
                },
                lastComputerRoomId: null,
            };
        },
        async created () {
            if (this.id) { // 编辑时机房回显
                const computerRoomIds = [];
                this.form.taskDetailsVOS = await this.$store.dispatch(`${storeModuleName}/${actionTypes.task.findDetails}`, this.id);
                this.form.taskDetailsVOS.forEach(i => {
                    computerRoomIds.push([i.customerId, i.computerRoomId]);
                });
                const customerAndComputer = this.union(computerRoomIds);
                this.form.computerRoomId = customerAndComputer;
            }
        },
        methods: {
            returnVal (newVal) {
                this.EquipmentSelectorDialog.computerRooms = newVal;
            },
            union (computerRoomIds) {
                let hash = {};
                let result = [];
                for (let i = 0, len = computerRoomIds.length; i < len; i++) {
                    if (!hash[computerRoomIds[i]]) {
                        result.push(computerRoomIds[i]);
                        hash[computerRoomIds[i]] = true;
                    }
                }
                return result;
            },
            equipmentTypeId (brandModelId) {
                const result = this.$store.getters[`brandModel/${getterTypes.common.getById}`](brandModelId);
                return result.equipmentTypeId;
            },
            initForm () {
                return {
                    taskType: {
                        rules: [validators.required()],
                    },
                    name: {
                        rules: [validators.required()],
                    },
                    computerRoomId: {},
                    createUserFullName: {
                        default: this.currentUser.fullName,
                    },
                    code: {},
                    finishUserFullName: {},
                    createTime: {},
                    finishTime: {},
                    finish: {},
                    taskDetailsVOS: {
                        default: [],
                    },
                    remark: {},
                };
            },
            processValues (values) {
                values.id = this.id;
                if (values.taskDetailsVOS.length === 0) {
                    alertError('请添加设备再提交');
                    return false;
                }

                delete values.code;
                delete values.computerRoomId;
                delete values.createUserFullName;
                delete values.createTime;

                return values;
            },
        },
        watch: {
            // async 'form.computerRoomId' (newValue, oldValue) {
            //     if (!this.lastComputerRoomId) {
            //         this.lastComputerRoomId = newValue;
            //     }
            //
            //     if (this.form.taskDetailsVOS.length > 0 && newValue !== this.lastComputerRoomId) {
            //         try {
            //             await confirmDialog({ message: '改变机房将导致已选择的设备被清空，继续吗' });
            //             this.form.taskDetailsVOS = [];
            //             this.lastComputerRoomId = newValue;
            //         } catch (e) {
            //             this.form.computerRoomId = oldValue;
            //         }
            //     }
            // },
        },
    };
</script>
