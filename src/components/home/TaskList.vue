<template>
    <div>
        <lan-client-table :data="tableData" :default-sort="{prop: 'name'}" :max-height="tableHeight" :show-operation-column="false" pagination>

            <el-table-column label="名称" prop="name" sortable/>

            <el-table-column label="创建人" prop="createUserFullName" sortable/>

            <el-table-column :formatter="renderDateRow" label="创建时间" prop="createTime" sortable/>

            <el-table-column label="任务状态" prop="finish" sortable>
                <template slot-scope="{ row }">
                    {{ row.finish ? "已完成" : "未完成" }}
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button
                        @click="detail(row)"
                        size="mini"
                        style="width: 68px;"
                        type="primary">
                        详情 <i class="el-icon-edit"></i>
                    </el-button>
                </template>
            </el-table-column>

        </lan-client-table>

        <detail :table="table"
                :value="detailDialog.value"
                @close="detailDialog.handleClose"
                v-if="detailDialog.show"/>
    </div>
</template>

<script>
    import Detail from '@/components/home/Detail';
    import LanClientTable from '@/roadhog/LanClientTable';

    export default {
        components: { LanClientTable, Detail },
        props: {
            name: {
                type: String,
            },
            computerRoom: {
                type: String,
            },
            equipment: {
                type: String,
            },
            createUserName: {
                type: String,
            },
            taskStatus: { // 要展示的任务的状态
                type: String,
            },
            createTime: {},
            table: {
                type: Array,
            },
        },
        data () {
            return {
                tableHeight: 400,
                tableData: [],
                detailDialog: {
                    show: false,
                    value: null,
                    handleClose: () => {
                        this.detailDialog.show = false;
                    },
                },
            };
        },
        created () {
            if (this.table) {
                this.tableData = this.table;
            }
        },
        methods: {
            detail (value) {
                this.detailDialog.show = true;
                this.detailDialog.value = value;
            },
        },
    };
</script>
