<template>
    <div v-loading="isLoading">
        <page-header/>
        <el-form class="toolbar" inline size="mini">

            <el-form-item title="名称">
                <el-input placeholder="名称" v-model="pagination.query.name" clearable/>
            </el-form-item>

            <el-form-item title="联络人">
                <el-input placeholder="联络人" v-model="pagination.query.chargeUserFullName" clearable/>
            </el-form-item>

            <el-form-item title="联系电话">
                <el-input placeholder="联系电话" v-model="pagination.query.chargeUserPhone" clearable/>
            </el-form-item>

            <el-form-item title="邮箱">
                <el-input placeholder="邮箱" v-model="pagination.query.chargeUserEmail" clearable/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="CustomerEditorDialog.handleAdd">新增</el-button>
            </el-form-item>

        </el-form>

        <lan-server-table :pagination.sync="pagination"
                          :max-height="tableHeight"
                          :default-sort="pagination.defaultSort"
                          @edit="CustomerEditorDialog.handleEdit"
                          @remove="CustomerEditorDialog.handleRemove"
                          @load="load"
        >

            <el-table-column label="名称" prop="name" sortable="custom"/>

            <el-table-column label="联络人" prop="chargeUserFullName" sortable="custom"/>

            <el-table-column label="联系电话" prop="chargeUserPhone" sortable="custom"/>

            <el-table-column label="邮箱" prop="chargeUserEmail" sortable="custom"/>

        </lan-server-table>

        <customer-editor v-if="CustomerEditorDialog.show"
                         :id="CustomerEditorDialog.id"
                         @close="CustomerEditorDialog.handleClose"
                         @remove="CustomerEditorDialog.handleRemove"
        />
    </div>
</template>

<script>
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import LanServerTable from '@/roadhog/LanServerTable';
    import { actionTypes } from '@/store/actionTypes';
    import { Pagination } from '@/roadhog/Pagination';
    import { confirmDialog } from '@/roadhog/alert';
    import CustomerEditor from '@/components/customer/CustomerEditor';

    export default {
        mixins: [autoHeightTableMixin()],
        components: {
            CustomerEditor,
            LanServerTable,
        },
        created () {
            this.load(true);
        },
        data () {
            return {
                tableHeight: 0,
                isLoading: true,
                pagination: new Pagination({
                    sortField: 'name',
                    sortOrder: 'asc',
                    name: null,
                    chargeUserFullName: null,
                    chargeUserPhone: null,
                    chargeUserEmail: null,
                }),
                CustomerEditorDialog: {
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.CustomerEditorDialog.show = false;
                        this.CustomerEditorDialog.id = null;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.CustomerEditorDialog.show = true;
                        this.CustomerEditorDialog.id = null;
                    },
                    handleEdit: (row) => {
                        this.CustomerEditorDialog.show = true;
                        this.CustomerEditorDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });

                        await this.$store.dispatch(`customer/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.query.page = 1;
                }

                const response = await this.$store.dispatch(`customer/${actionTypes.common.list}`, this.pagination.query);
                this.pagination.setResult(response);
                this.isLoading = false;
            },
        },
    };
</script>
