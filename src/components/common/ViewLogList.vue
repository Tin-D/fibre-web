<template>
    <div>
        <page-header/>

        <el-form size="mini" inline>
            <el-form-item>
                <organization-input v-model="pagination.query.userIds"
                                    placeholder="查看用户（单选）"
                                    :max-items="1"
                                    :mode="['user']"
                />
            </el-form-item>

            <el-form-item>
                <el-input v-model="pagination.query.recorderName" placeholder="标题"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">检索</el-button>
            </el-form-item>
        </el-form>

        <lan-server-table :pagination="pagination"
                          :max-height="tableHeight"
                          :default-sort="pagination.defaultSort"
                          :show-operation-column="false"
                          @load="load"
        >
            <el-table-column prop="recorderName" label="标题" sortable="custom"/>

            <el-table-column prop="userFullName" label="查看用户" sortable="custom" width="200px"/>

            <el-table-column prop="createTime" label="查看时间" :formatter="renderDateTimeRow" sortable="custom" width="200px"/>
        </lan-server-table>
    </div>
</template>

<script>
    import { Pagination } from '@/roadhog/Pagination';
    import axios from 'axios';
    import OrganizationInput from '@/components/common/OrganizationInput';
    import LanServerTable from '@/roadhog/LanServerTable';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';

    export default {
        components: { LanServerTable, OrganizationInput },
        mixins: [autoHeightTableMixin()],
        created () {
            this.load(true);
        },
        data () {
            return {
                tableHeight: 0,
                pagination: new Pagination({
                    sortField: 'createTime',
                    sortOrder: 'desc',
                    recorderType: this.recorderType,
                    recorderName: null,
                    userIds: [],
                }),
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.setPage(1);
                }

                const values = _.cloneDeep(this.pagination.query);
                values.userId = values.userIds.length > 0 ? values.userIds[0] : null;
                delete values.userIds;

                const { data } = await axios.post(`/view_log/pagination`, values);
                this.pagination.setResult(data);
            },
        },
        props: {
            recorderType: { // 记录类型，目前支持：Dispatch，Receipt
                type: String,
                required: true,
            },
        },
    };
</script>
