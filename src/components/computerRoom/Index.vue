<template>
    <div v-loading="isLoading">
        <page-header/>

        <el-form size="mini" inline class="toolbar">

            <el-form-item title="名称">
                <el-input placeholder="名称" v-model="pagination.query.name" clearable/>
            </el-form-item>

            <el-form-item title="客户名称">
                <el-input placeholder="客户名称" v-model="pagination.query.customerName" clearable/>
            </el-form-item>

            <el-form-item title="地址">
                <el-input placeholder="地址" v-model="pagination.query.address" clearable/>
            </el-form-item>

            <el-form-item title="联系人名称">
                <el-input placeholder="联系人名称" v-model="pagination.query.contactsName" clearable/>
            </el-form-item>

            <el-form-item title="排序">
                <el-input placeholder="排序" v-model="pagination.query.orderNumber" clearable/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="computerRoomEditDialog.handleAdd">新增</el-button>
            </el-form-item>

        </el-form>

        <lan-server-table :pagination.sync="pagination"
                          :max-height="tableHeight"
                          :default-sort="pagination.defaultSort"
                          @edit="computerRoomEditDialog.handleEdit"
                          @remove="computerRoomEditDialog.handleRemove"
                          @load="load"
        >

            <el-table-column prop="name" label="名称" sortable="custom"/>

            <el-table-column prop="customerName" label="客户名称" sortable="custom"/>

            <el-table-column prop="address" label="地址" sortable="custom"/>

            <el-table-column prop="contactsName" label="联系人名称" sortable="custom"/>

            <el-table-column prop="contactsPhone" label="联系人电话" sortable="custom"/>

            <el-table-column prop="orderNumber" label="排序" sortable="custom"/>

        </lan-server-table>

        <computer-room-editor v-if="computerRoomEditDialog.show"
                              :id="computerRoomEditDialog.id"
                              @close="computerRoomEditDialog.handleClose"
                              @remove="computerRoomEditDialog.handleRemove"
        />
    </div>
</template>

<script>
    import LanServerTable from '@/roadhog/LanServerTable';
    import { Pagination } from '@/roadhog/Pagination';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import { confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import ComputerRoomEditor from '@/components/computerRoom/ComputerRoomEditor';
    import { models } from '@/store/models';

    const storeModuleName = models.computerRoom;

    export default {
        components: {
            ComputerRoomEditor,
            LanServerTable,
        },
        mixins: [autoHeightTableMixin()],
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
                    customerName: null,
                    address: null,
                    contactsName: null,
                    orderNumber: null,
                }),
                computerRoomEditDialog: {
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.computerRoomEditDialog.show = false;
                        this.computerRoomEditDialog.id = null;
                        if (returnValue?.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.computerRoomEditDialog.show = true;
                        this.computerRoomEditDialog.id = null;
                    },
                    handleEdit: (row) => {
                        this.computerRoomEditDialog.show = true;
                        this.computerRoomEditDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });

                        await this.$store.dispatch(`${storeModuleName}/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.setPage(1);
                }

                const result = await this.$store.dispatch(`${storeModuleName}/${actionTypes.common.list}`, this.pagination.query);
                this.pagination.setResult(result);
                this.isLoading = false;
            },
        },
    };
</script>
