<template>
    <lan-base-table
        :data="displayData"
        :default-sort="defaultSort"
        :operation-column-width="operationColumnWidth"
        :show-operation-column="showOperationColumn"
        :operationButtons="operationButtons"
        :page-size="pageSize"
        :total="data.length"
        :handle-sort-change="handleSortChange"
        :handle-current-change="handleCurrentChange"
        :handle-size-change="handleSizeChange"
        :height="height"
        :max-height="maxHeight"
        :pagination="pagination"
        :page-number="currentPage"
        :can-edit="canEdit"
        :can-remove="canRemove"
        @row-dblclick="(row)=> $emit('row-dblclick', row)"
        @row-click="row => $emit('row-click', row)"
        @edit="(row)=> $emit('edit', row)"
        @remove="(row)=> $emit('remove', row)"
        @selection-change="(selectedRows)=> $emit('selection-change', selectedRows)"
        @cell-click="(row, column, cell, event)=> $emit('cell-click', row, column, cell, event)"
        :tree-props="treeProps"
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
        watch: {
            pageSize: {
                handler (newValue) {
                    this.realPageSize = newValue;
                },
                immediate: true,
            },
        },
        created () {
            if (this.defaultSort != null) {
                this.sortProp = this.defaultSort.prop;
                this.sortOrder = this.defaultSort.order;
            }
        },
        data () {
            return {
                sortProp: null,
                sortOrder: null,
                currentPage: 1,
                realPageSize: 15,
            };
        },
        computed: {
            displayData () {
                if (this.data == null) {
                    return [];
                }

                if (!this.pagination) {
                    return this.data;
                }

                let sortedData;
                if (this.sortProp != null) {
                    sortedData = _.orderBy(this.data, [this.sortProp], [this.sortOrder ? this.sortOrder.replace('ending', '') : 'asc']);
                } else {
                    sortedData = this.data;
                }

                let startNumber = (this.currentPage - 1) * this.realPageSize;
                if (sortedData.length < startNumber) {
                    startNumber = 0;
                }
                return _.chain(sortedData).drop(startNumber).take(this.realPageSize).value();
            },
        },
        methods: {
            handleSortChange ({ prop, order }) {
                this.sortProp = prop;
                this.sortOrder = order;
            },
            handleCurrentChange (page) {
                this.currentPage = page;
            },
            handleSizeChange (pageSize) {
                this.currentPage = 1;
                this.realPageSize = pageSize;
            },
        },
        props: {
            data: {
                type: Array,
                required: true,
            },
            defaultSort: {
                type: Object,
            },
            height: {
                type: Number,
                default: 0,
            },
            maxHeight: {
                type: Number,
            },
            pagination: {
                type: Boolean,
                default: false,
            },
            pageSize: {
                type: Number,
                default: 15,
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
            treeProps: {
                type: Object,
            },
            rowClassName: {},
            paginationLayout: {
                type: String,
            },
        },
    };
</script>
