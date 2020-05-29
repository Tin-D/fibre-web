<template>
    <lan-base-table
        :data="pagination.result.items"
        :default-sort="defaultSort"
        :operation-column-width="operationColumnWidth"
        :show-operation-column="showOperationColumn"
        :operationButtons="operationButtons"
        :page-size="pagination.result.pageSize"
        :total="pagination.result.total"
        :page-number="pagination.result.page"
        :handle-sort-change="handleSortChange"
        :handle-current-change="handleCurrentChange"
        :handle-size-change="handleSizeChange"
        :height="height"
        :max-height="maxHeight"
        :pagination="true"
        :can-edit="canEdit"
        :can-remove="canRemove"
        @row-dblclick="(row)=> $emit('row-dblclick', row)"
        @edit="(row)=> $emit('edit', row)"
        @remove="(row)=> $emit('remove', row)"
        @selection-change="(selectedRows)=> $emit('selection-change', selectedRows)"
        :row-class-name="rowClassName"
        :pagination-layout="paginationLayout"
    >
        <slot/>

    </lan-base-table>
</template>

<script>
    import LanBaseTable from '@/roadhog/LanBaseTable';

    export default {
        components: { LanBaseTable },
        methods: {
            handleSortChange ({ prop, order }) {
                this.pagination.setSort(prop, order);
                this.$emit('load');
            },
            handleCurrentChange (page) {
                this.pagination.setPage(page);
                this.$emit('load');
            },
            handleSizeChange (pageSize) {
                this.pagination.setPage(1);
                this.pagination.setPageSize(pageSize);
                this.$emit('load');
            },
        },
        props: {
            height: {
                type: [Number, String],
                default: 0,
            },
            maxHeight: {
                type: Number,
            },
            pagination: {
                type: Object,
                required: true,
            },
            defaultSort: {
                type: Object,
            },
            canEdit: {
                type: Function,
            },
            canRemove: {
                type: Function,
            },
            operationColumnWidth: {
                type: Number,
            },
            showOperationColumn: {
                type: Boolean,
                default: true,
            },
            operationButtons: {
                type: Array,
            },
            rowClassName: {},
            paginationLayout: {
                type: String,
            },
        },
    };
</script>
