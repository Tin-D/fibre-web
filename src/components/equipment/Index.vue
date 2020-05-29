<template>
    <div v-loading="isLoading">
        <page-header/>

        <el-form inline class="toolbar" size="mini">
            <el-form-item title="名称">
                <el-input placeholder="名称" clearable v-model.trim="pagination.query.name"/>
            </el-form-item>

            <el-form-item title="设备类型">
                <dictionary-code-selector-simple placeholder="请选择设备类型"
                                                 root-code="EquipmentType"
                                                 v-model="pagination.query.equipmentTypeId"
                />
            </el-form-item>

            <el-form-item title="机房">
                <computer-room-selector @change="load(true)"
                                        multiple
                                        show-all-levels
                                        v-model="pagination.query.computerRoomIds"/>
            </el-form-item>

            <el-form-item title="型号">
                <brand-model-selector @change="load(true)" show-all-levels v-model="pagination.query.brandModelId"/>
            </el-form-item>

            <el-form-item title="设备状态">
                <state-selector v-model="pagination.query.state" @change="load(true)"/>
            </el-form-item>

            <el-form-item title="请选择日期">
                <el-date-picker
                    v-model="pagination.query.searchTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <span> : </span>
                <el-select v-model="pagination.query.dateField"
                           style="width: 170px;"
                           placeholder="精准日期搜索"
                           title="精准日期搜索"
                           filterable
                           clearable>
                    <el-option
                        v-for="item in dateField"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="EquipmentEditorDialog.handleAdd">新增</el-button>
            </el-form-item>

        </el-form>

        <lan-server-table :pagination="pagination"
                          @load="load"
                          :max-height="tableHeight"
                          :default-sort="pagination.defaultSort"
                          @edit="EquipmentEditorDialog.handleEdit"
                          @remove="EquipmentEditorDialog.handleRemove"
        >

            <el-table-column label="名称" prop="name" sortable="custom"/>

            <el-table-column label="机房" prop="computerRoomName" sortable="custom"/>

            <el-table-column :formatter="renderBrandModelNameRow" label="型号" prop="brandModelId" sortable="custom"/>

            <el-table-column label="序列号" prop="serialNumber" sortable="custom"/>

            <el-table-column label="创建日期" prop="createTime" :formatter="renderDateRow" sortable="custom"/>

            <el-table-column label="生产日期" prop="manufactureDate" :formatter="renderDateRow" sortable="custom"/>

            <el-table-column label="安装日期" prop="installDate" :formatter="renderDateRow" sortable="custom"/>

            <el-table-column label="收货日期" prop="deliveryDate" :formatter="renderDateRow" sortable="custom"/>

            <el-table-column label="设备状态" prop="state" :formatter="renderStateRow" sortable="custom"/>

        </lan-server-table>

        <equipment-editor v-if="EquipmentEditorDialog.show"
                          :id="EquipmentEditorDialog.id"
                          @close="EquipmentEditorDialog.handleClose"
                          :typeId="EquipmentEditorDialog.typeId"
        />
    </div>
</template>

<script>
    import { Pagination } from '@/roadhog/Pagination';
    import { actionTypes } from '@/store/actionTypes';
    import { confirmDialog } from '@/roadhog/alert';
    import { getterTypes } from '@/store/getterTypes';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import LanServerTable from '@/roadhog/LanServerTable';
    import ComputerRoomSelector from '@/components/computerRoom/ComputerRoomSelector';
    import BrandModelSelector from '@/components/brandModel/BrandModelSelector';
    import EquipmentEditor from '@/components/equipment/EquipmentEditor';
    import StateSelector from '@/components/equipment/StateSelector';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';

    export default {
        mixins: [autoHeightTableMixin()],
        components: {
            LanServerTable,
            ComputerRoomSelector,
            BrandModelSelector,
            EquipmentEditor,
            StateSelector,
            DictionaryCodeSelectorSimple,
        },
        async created () {
            this.load();
        },
        data () {
            return {
                tableHeight: 0,
                isLoading: true,
                computerRoomName: null,
                pagination: new Pagination({
                    sortField: 'name',
                    sortOrder: 'asc',
                    name: null,
                    equipmentTypeId: null,
                    computerRoomIds: null,
                    brandModelId: null,
                    searchTime: null,
                    dateField: null,
                    state: null,
                }),
                EquipmentEditorDialog: {
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.EquipmentEditorDialog.show = false;
                        this.EquipmentEditorDialog.id = null;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.EquipmentEditorDialog.show = true;
                        this.EquipmentEditorDialog.id = null;
                    },
                    handleEdit: (row) => {
                        this.EquipmentEditorDialog.show = true;
                        this.EquipmentEditorDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });

                        await this.$store.dispatch(`equipment/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
                dateField: [
                    {
                        value: 'create_time',
                        label: '创建时间',
                    },
                    {
                        value: 'manufacture_date',
                        label: '生产日期',
                    },
                    {
                        value: 'install_date',
                        label: '安装日期',
                    },
                    {
                        value: 'delivery_date',
                        label: '收货日期',
                    },
                ],
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.query.page = 1;
                }

                const response = await this.$store.dispatch(`equipment/${actionTypes.common.list}`, this.pagination.query);
                this.pagination.setResult(response);
                this.isLoading = false;
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
                    result.push(code ? code.name : 'unknown');
                });

                return result.join('; ');
            },
            renderStateRow (row, column, cellValue) {
                let ret = '';
                switch (cellValue) {
                    case 'Fresh':
                        ret = '新品';
                        break;
                    case 'Available':
                        ret = '堪用';
                        break;
                    case 'WaitingForRepair':
                        ret = '待修';
                        break;
                    case 'UnderRepair':
                        ret = '在修';
                        break;
                    case 'ToBeScrapped':
                        ret = '待报废';
                        break;
                }
                return ret;
            },
        },
    };
</script>
