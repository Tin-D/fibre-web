<template>
    <div>
        <page-header/>
        <el-form class="toolbar" inline size="mini">
            <el-form-item title="设备类型">
                <dictionary-code-selector-simple placeholder="请选择设备类型"
                                                 root-code="EquipmentType"
                                                 v-model="equipmentTypeId"
                />
            </el-form-item>

            <el-form-item title="搜索">
                <el-button @click="handleSearch" icon="el-icon-search" type="primary"> 搜索</el-button>
            </el-form-item>

            <el-form-item title="新增">
                <el-button @click="PatrolExcelEditorDialog.handleAdd" icon="el-icon-plus"> 新增</el-button>
            </el-form-item>
        </el-form>

        <lan-client-table :data="tableData"
                          :default-sort="{prop: 'fileName', order: 'ascending'}"
                          :max-height="tableHeight"
                          @edit="PatrolExcelEditorDialog.handleEdit"
                          @remove="PatrolExcelEditorDialog.handleRemove"
                          pagination>

            <el-table-column label="文件名称" prop="fileName" sortable/>

            <el-table-column :formatter="renderDictionaryCodeRow" label="设备类型" prop="equipmentTypeId" sortable/>

            <el-table-column label="备注" prop="remark" sortable/>

        </lan-client-table>

        <patrol-excel-editor :id="PatrolExcelEditorDialog.id"
                             @close="PatrolExcelEditorDialog.handleClose"
                             v-if="PatrolExcelEditorDialog.show"/>
    </div>
</template>

<script>
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import { confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import LanClientTable from '@/roadhog/LanClientTable';
    import PatrolExcelEditor from '@/components/patrolExcel/PatrolExcelEditor';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';

    export default {
        mixins: [autoHeightTableMixin()],
        components: {
            LanClientTable,
            DictionaryCodeSelectorSimple,
            PatrolExcelEditor,
        },
        async created () {
            this.load();
        },
        data () {
            return {
                PatrolExcelEditor,
                tableData: [],
                tableHeight: 0,
                equipmentTypeId: null,
                PatrolExcelEditorDialog: {
                    equipmentTypeName: null,
                    equipmentTypeId: null,
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.PatrolExcelEditorDialog.show = false;
                        this.PatrolExcelEditorDialog.id = null;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.PatrolExcelEditorDialog.show = true;
                    },
                    handleEdit: (row) => {
                        this.PatrolExcelEditorDialog.show = true;
                        this.PatrolExcelEditorDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });

                        await this.$store.dispatch(`patrolExcel/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
            };
        },
        methods: {
            async load () {
                const result = await this.$store.dispatch(`patrolExcel/${actionTypes.common.list}`);
                this.tableData = result;
            },
            async handleSearch () {
                const res = await this.$store.dispatch(`patrolExcel/${actionTypes.common.list}`);
                if (this.equipmentTypeId == null || this.equipmentTypeId === '') {
                    this.tableData = res;
                    return;
                }
                this.tableData = _.filter(res, i => i.equipmentTypeId === this.equipmentTypeId);
            },
        },
    };
</script>
