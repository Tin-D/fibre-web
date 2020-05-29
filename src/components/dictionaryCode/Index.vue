<template>
    <div>
        <page-header/>
        <tree-list-index ref="tl"
                         :data="codeTree"
                         is-tree-data
                         :tree-height="tableHeight"
                         :root-node="{id: '__root_id', name: '所有代码'}"
                         @current-change="handleCurrentChange"
        >
            <el-form size="mini" inline class="toolbar">
                <el-form-item>
                    <el-button icon="fa fa-refresh" @click="handleRefresh"> 强制刷新</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button icon="fa fa-plus" type="primary" @click="DictionaryCodeEditorDialog.handleAdd" v-if="!readonly"> 新增</el-button>
                </el-form-item>
            </el-form>

            <lan-client-table :data="tableData"
                              :max-height="tableHeight"
                              :default-sort="{prop: 'index'}"
                              @edit="DictionaryCodeEditorDialog.handleEdit"
                              @remove="DictionaryCodeEditorDialog.handleRemove"
                              :can-edit="(row) => row.editable"
                              :can-remove="(row) => row.editable"
                              :show-operation-column="!readonly"
            >

                <el-table-column prop="name" label="名称" sortable/>

                <el-table-column prop="code" label="代码" sortable/>

                <el-table-column prop="index" label="排序" sortable/>

                <el-table-column prop="remark" label="备注"/>

            </lan-client-table>

        </tree-list-index>

        <dictionary-code-editor v-if="DictionaryCodeEditorDialog.show"
                                :id="DictionaryCodeEditorDialog.id"
                                :parent-id="DictionaryCodeEditorDialog.parentId"
                                @close="DictionaryCodeEditorDialog.handleClose"
        />
    </div>
</template>

<script>
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import TreeListIndex from '@/components/common/TreeListIndex';
    import { getterTypes } from '@/store/getterTypes';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { alertError, confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import DictionaryCodeEditor from '@/components/dictionaryCode/DictionaryCodeEditor';

    export default {
        mixins: [autoHeightTableMixin()],
        components: { DictionaryCodeEditor, LanClientTable, TreeListIndex },
        data () {
            return {
                tableHeight: 0,
                currentNode: null,
                DictionaryCodeEditorDialog: {
                    show: false,
                    id: null,
                    parentId: null,
                    handleClose: (returnValue) => {
                        if (returnValue && returnValue.refresh) {
                            this.handleCurrentChange(this.$refs.tl.getCurrentNode());
                        }
                        this.DictionaryCodeEditorDialog.show = false;
                        this.DictionaryCodeEditorDialog.id = null;
                        this.DictionaryCodeEditorDialog.parentId = null;
                    },
                    handleAdd: () => {
                        this.DictionaryCodeEditorDialog.show = true;
                        this.DictionaryCodeEditorDialog.id = null;
                        this.DictionaryCodeEditorDialog.parentId = this.$refs.tl.getCurrentKey();
                    },
                    handleEdit: async (row) => {
                        this.DictionaryCodeEditorDialog.show = true;
                        this.DictionaryCodeEditorDialog.id = row.id;
                        this.DictionaryCodeEditorDialog.parentId = this.$refs.tl.getCurrentKey();
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });
                        if (_.filter(this.codes, n => n.parentId === row.id).length > 0) {
                            alertError('该项目有子项，不能删除');
                            return;
                        }
                        await this.$store.dispatch(`dictionaryCode/${actionTypes.common.remove}`, row.id);
                    },
                },
            };
        },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
            codeTree () {
                return this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getCodeTree}`];
            },
            codes () {
                return this.$store.state.dictionaryCode.codes;
            },
            tableData () {
                const parentId = (!this.currentNode || this.currentNode.id === '__root_id') ? null : this.currentNode.id;
                const result = this.$store.state.dictionaryCode.codes.filter(n => n.parentId === parentId);
                return _.map(result, n => {
                    const { children, ...i } = n;
                    return i;
                });
            },
        },
        methods: {
            handleCurrentChange (data) {
                this.currentNode = data;
            },
            async handleRefresh () {
                await this.$store.dispatch(`dictionaryCode/${actionTypes.dictionaryCode.forceRefresh}`);
                await this.$store.dispatch(`dictionaryCode/${actionTypes.common.list}`);
            },
        },
    };
</script>
