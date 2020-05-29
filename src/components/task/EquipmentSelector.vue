<template>
    <lan-form-dialog
        ref="lanDialog"
        title="设备选择器(必选先选择设备类别才能查询到数据)"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="false"
    >

        <el-form class="toolbox" size="mini" inline>
            <el-form-item>
                <dictionary-code-selector-simple placeholder="请选择设备类别"
                                                 root-code="EquipmentType"
                                                 v-model="pagination.query.equipmentTypeId"
                />
            </el-form-item>

            <el-form-item>
                <task-computer-room-selector :computer-rooms="computerRooms"
                                             @computerRoomsId="returnComputerRoomsId"
                                             v-model="pagination.query.computerRoomIds"
                />
            </el-form-item>

            <el-form-item>
                <el-input v-model="pagination.query.name" placeholder="名称"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load">检索</el-button>
            </el-form-item>
        </el-form>

        <lan-client-table :data="tableData"
                          :default-sort="pagination.defaultSort"
                          :show-operation-column="false"
                          :max-height="tableHeight"
                          class="toolbar"
                          @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            />

            <el-table-column label="名称" prop="name" sortable/>

            <el-table-column label="客户" prop="customerName" sortable/>

            <el-table-column label="机房" prop="computerRoomName" sortable/>

            <el-table-column :formatter="renderBrandModelNameRow" label="设备类型" prop="brandModelId" sortable/>

            <el-table-column prop="brandModelId" label="品牌型号" :formatter="renderBrandNameRow" sortable/>
        </lan-client-table>

        <maintenance-level-selector-dialog @close="MaintenanceLevelSelectorDialog.handleClose"
                                           :equipment-type-id="pagination.query.equipmentTypeId"
                                           v-if="MaintenanceLevelSelectorDialog.show"
        />

    </lan-form-dialog>
</template>

<script>
    /**
     * 设备选择器
     */
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { Pagination } from '@/roadhog/Pagination';
    import { equipmentMixin } from '@/components/equipment/equipmentMixin';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';
    import { actionTypes } from '@/store/actionTypes';
    import { getterTypes } from '@/store/getterTypes';
    import { alertError, confirmDialog } from '@/roadhog/alert';
    import { dialogAutoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import MaintenanceLevelSelectorDialog from '@/components/task/MaintenanceLevelSelectorDialog';
    import TaskComputerRoomSelector from '@/components/task/TaskComputerRoomSelector';

    const storeModuleName = 'equipment';

    export default {
        components: {
            MaintenanceLevelSelectorDialog,
            DictionaryCodeSelectorSimple,
            LanClientTable,
            TaskComputerRoomSelector,
        },
        mixins: [dialogMixin(), dialogAutoHeightTableMixin(), equipmentMixin],
        created () {
            this.computerRoomsId();
        },
        data () {
            return {
                tableHeight: 0,
                tableData: [],
                selectedRows: [],
                pagination: new Pagination({
                    sortField: 'name',
                    sortOrder: 'asc',
                    equipmentTypeId: null,
                    computerRoomIds: [],
                    name: null,
                }),
                MaintenanceLevelSelectorDialog: {
                    show: false,
                    handleView: () => {
                        this.MaintenanceLevelSelectorDialog.show = true;
                    },
                    handleClose: (returnValue) => {
                        this.MaintenanceLevelSelectorDialog.show = false;
                        /**
                         * returnValue返回模板数据，并将选中的设备拷贝至patrolExcelTemplates，再将选中设备数据传回TaskEditor
                         */
                        if (returnValue) {
                            _.forEach(this.selectedRows, r => {
                                r.maintenanceLevel = _.cloneDeep(returnValue);
                            });
                            this.closeDialog(this.selectedRows);
                        }
                    },
                },
            };
        },
        methods: {
            async load () {
                if (!this.pagination.query.equipmentTypeId) {
                    alertError('请选择设备类型');
                    return;
                } else if (this.pagination.query.computerRoomIds.length === 0) {
                    this.pagination.query.computerRoomIds = this.computerRoomsId();
                }

                if (this.selectedRows.length > 0) {
                    await confirmDialog({ message: '您已经选择了一些设备，重新搜索会导致之前选择的设备被清除，继续吗' });
                }
                this.pagination.setPage(1);
                this.pagination.setPageSize(0);
                const result = await this.$store.dispatch(`${storeModuleName}/${actionTypes.common.list}`, this.pagination.query);// 后台查询数据
                this.tableData = result.items;
            },
            computerRoomsId () {
                const res = [];
                this.computerRooms.forEach(i => {
                    i.children.forEach(e => {
                        res.push(e.id);
                    });
                });
                return res;
            },
            handleSelectionChange (selectedRows) {
                this.selectedRows = selectedRows;
            },
            returnComputerRoomsId (value) {
                this.pagination.query.computerRoomIds = value;
            },
            handleSubmit () {
                if (this.selectedRows.length > 0) {
                    this.MaintenanceLevelSelectorDialog.handleView();
                } else {
                    alertError('您暂未选中设备，请选择设备在提交');
                }
            },
            renderBrandModelNameRow (row, column) {
                let value = row[column.property];
                if (value == null) {
                    return null;
                }

                if (!_.isArray(value)) {
                    value = [value];
                }

                const result = [];
                _.forEach(value, (i) => {
                    const code = this.$store.getters[`brandModel/${getterTypes.common.getById}`](i);
                    const type = this.getDictionaryCode(code.equipmentTypeId); // brandModelId解析设备类型名称
                    result.push(type ? type.name : 'unknown');
                });

                return result.join('; ');
            },
        },
        props: {
            computerRooms: {
                type: Array,
                required: true,
            },
        },
    };
</script>
