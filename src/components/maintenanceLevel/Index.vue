<template>
    <div>
        <page-header/>
        <el-form class="toolbar" inline size="mini">
            <el-form-item title="设备类型">
                <dictionary-code-selector-simple placeholder="请选择设备类型"
                                                 root-code="EquipmentType"
                                                 v-model="typeId"
                />
            </el-form-item>

            <el-form-item title="搜索">
                <el-button @click="handleSearch" icon="el-icon-search" type="primary"> 搜索</el-button>
            </el-form-item>

            <el-form-item title="新增">
                <el-button @click="MaintenanceLevelEditorDialog.handleAdd" icon="el-icon-plus"> 新增</el-button>
            </el-form-item>
        </el-form>

        <lan-client-table :data="tableData"
                          :default-sort="{prop: 'name', order: 'ascending'}"
                          :max-height="tableHeight"
                          @edit="MaintenanceLevelEditorDialog.handleEdit"
                          @remove="MaintenanceLevelEditorDialog.handleRemove"
                          pagination>

            <el-table-column label="维护名称" prop="name" sortable/>

            <el-table-column :formatter="renderDictionaryCodeRow" label="设备类型" prop="equipmentTypeId" sortable/>

            <el-table-column label="等级" prop="orderNumber" sortable/>

        </lan-client-table>

        <maintenance-level-editor :id="MaintenanceLevelEditorDialog.id"
                             @close="MaintenanceLevelEditorDialog.handleClose"
                             v-if="MaintenanceLevelEditorDialog.show"/>
    </div>
</template>

<script>
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import { confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import LanClientTable from '@/roadhog/LanClientTable';
    import MaintenanceLevelEditor from '@/components/maintenanceLevel/MaintenanceLevelEditor';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';

    export default {
        mixins: [autoHeightTableMixin()],
        components: {
            LanClientTable,
            DictionaryCodeSelectorSimple,
            MaintenanceLevelEditor,
        },
        async created () {
            this.load();
        },
        data () {
            return {
                tableData: [],
                tableHeight: 0,
                typeId: null,
                MaintenanceLevelEditorDialog: {
                    equipmentTypeName: null,
                    equipmentTypeId: null,
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.MaintenanceLevelEditorDialog.show = false;
                        this.MaintenanceLevelEditorDialog.id = null;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.MaintenanceLevelEditorDialog.show = true;
                    },
                    handleEdit: (row) => {
                        this.MaintenanceLevelEditorDialog.show = true;
                        this.MaintenanceLevelEditorDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });

                        await this.$store.dispatch(`maintenanceLevel/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
            };
        },
        methods: {
            async load () {
                const result = await this.$store.dispatch(`maintenanceLevel/${actionTypes.common.list}`);
                this.tableData = result;
            },
            async handleSearch () {
                const res = await this.$store.dispatch(`maintenanceLevel/${actionTypes.common.list}`);
                if (this.typeId == null || this.typeId === '') {
                    this.tableData = res;
                    return;
                }
                this.tableData = _.filter(res, i => i.equipmentTypeId === this.typeId);
            },
        },
    };
</script>
