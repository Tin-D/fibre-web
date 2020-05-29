<template>
    <div>
        <page-header/>

        <el-form size="mini" class="toolbar" inline>

            <el-form-item title="操作时间">
                <el-date-picker
                    v-model="pagination.query.createTimeRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="操作时间起"
                    end-placeholder="操作时间止"
                    :picker-options="{
                        disabledDate(time) {
                            return time.getTime() > Date.now();
                        },
                    }"
                />
            </el-form-item>

            <el-form-item title="操作用户">
                <organization-input v-model="pagination.query.userIds" :max-items="1" :mode="['user']" placeholder="操作用户（单选）"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">检索</el-button>
            </el-form-item>

        </el-form>

        <lan-server-table :pagination.sync="pagination"
                          :default-sort="pagination.defaultSort"
                          @load="load"
                          :max-height="tableHeight"
                          :show-operation-column="false"
        >

            <el-table-column label="功能模块" prop="moduleName" sortable="custom"/>

            <el-table-column label="操作" prop="operation" sortable="custom">
                <template slot-scope="{ row }">
                    {{ row.method }} {{ row.methodName }} <span v-if="row.operation">({{ row.operation }})</span>
                </template>
            </el-table-column>

            <el-table-column label="操作用户" prop="fullName" sortable="custom"/>

            <el-table-column label="时间" prop="created" :formatter="renderDateTimeRow" sortable="custom"/>

            <el-table-column label="IP" prop="ip" sortable="custom"/>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button type="text" @click="AuditLogViewerDialog.handleView(row)">查看</el-button>
                </template>
            </el-table-column>

        </lan-server-table>

        <audit-log-viewer v-if="AuditLogViewerDialog.show"
                          :id="AuditLogViewerDialog.id"
                          @close="AuditLogViewerDialog.handleClose"
        />
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import { Pagination } from '@/roadhog/Pagination';
    import { actionTypes } from '@/store/actionTypes';
    import OrganizationInput from '@/components/common/OrganizationInput';
    import LanServerTable from '@/roadhog/LanServerTable';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import AuditLogViewer from '@/components/audit/AuditLogViewer';

    export default {
        components: { AuditLogViewer, LanServerTable, OrganizationInput },
        mixins: [autoHeightTableMixin()],
        created () {
            this.load();
        },
        data () {
            return {
                tableHeight: 0,
                pagination: new Pagination({
                    sortField: 'created',
                    sortOrder: 'desc',
                    userIds: [],
                    fullName: null,
                    ip: null,
                    moduleName: null,
                    createTimeRange: [dayjs().subtract(1, 'month'), dayjs().endOf('day')],
                }),
                AuditLogViewerDialog: {
                    show: false,
                    id: null,
                    handleClose: () => {
                        this.AuditLogViewerDialog.show = false;
                        this.AuditLogViewerDialog.id = null;
                    },
                    handleView: (row) => {
                        this.AuditLogViewerDialog.id = row.id;
                        this.AuditLogViewerDialog.show = true;
                    },
                },
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.setPage(1);
                }

                if (this.pagination.query.createTimeRange?.length === 2) {
                    this.pagination.query.createTimeRange[1] = dayjs(this.pagination.query.createTimeRange[1]).endOf('day');
                }

                const conditions = {};
                Object.assign(conditions, this.pagination.query);
                if (conditions.userIds.length > 0) {
                    conditions.userId = conditions.userIds[0];
                }
                delete conditions.userIds;

                const result = await this.$store.dispatch(`auditLog/${actionTypes.common.list}`, conditions);
                this.pagination.setResult(result);
            },
        },
    };
</script>
