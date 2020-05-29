<template>
    <div>
        <el-table
            ref="lanBaseTable"
            :data="data"
            :default-sort="defaultSort"
            row-key="id"
            border
            :max-height="tableHeight"
            size="mini"
            highlight-current-row
            stripe
            @sort-change="handleSortChange"
            @row-dblclick="(row)=> $emit('row-dblclick', row)"
            @row-click="row => $emit('row-click', row)"
            @selection-change="(selectedRows)=> $emit('selection-change', selectedRows)"
            :row-class-name="rowClassName"
            @cell-click="(row, column, cell, event)=> $emit('cell-click', row, column, cell, event)"
            :tree-props="treeProps"
            show-overflow-tooltip
        >
            <slot/>

            <el-table-column label="操作" :width="operationColumnWidth" v-if="showOperationColumn">
                <template slot-scope="scope">

                    <el-button
                        v-for="(b, index) of operationButtons"
                        :key="index"
                        :type="b.type"
                        size="mini"
                        :icon="b.icon"
                        @click="b.handler(scope.row)"
                        :disabled="b.disabled == null ? false : b.disabled()"
                    >
                        {{ b.text }}
                    </el-button>

                    <el-button
                        size="mini"
                        @click="$emit('edit', scope.row)"
                        icon="fa fa-edit"
                        :disabled="!canEdit(scope.row)"
                    >
                        编辑
                    </el-button>

                    <el-button
                        size="mini"
                        @click="$emit('remove', scope.row)"
                        icon="fa fa-trash"
                        type="danger"
                        :disabled="!canRemove(scope.row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="text-align: right;">
            <el-pagination
                v-if="pagination"
                :current-page.sync="currentPage"
                :layout="paginationLayout"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 15, 20, 30, 40, 80, 100]"
            />
        </div>
    </div>
</template>

<script>
    /**
     * 这是一个基于element table的增强，主要包含如下功能
     * 1. 支持自动计算表格高度
     */
    export default {
        watch: {
            maxHeight: {
                handler (newValue) {
                    console.log('newValue: ' + newValue);
                    this.resizeTable(this);
                },
                immediate: true,
            },
            pageNumber (newValue) {
                this.currentPage = newValue;
            },
        },
        data () {
            return {
                currentPage: 1,
                tableHeight: 720,
            };
        },
        methods: {
            resizeTable () {
                this.$nextTick(() => {
                    const pagination = this.$el.getElementsByClassName('el-pagination');
                    if (this.height == null || this.height === '' || this.height === 0) {
                        this.tableHeight = this.maxHeight - (pagination.length > 0 ? this.getAbsoluteHeight(pagination[0]) : 0);
                    } else {
                        this.tableHeight = this.height;
                    }
                    console.log('final table height: ' + this.tableHeight);
                });
            },
        },
        props: {
            height: { // 直接制定表格的高度
                type: [Number, String],
                default: 0,
            },
            defaultSort: {
                type: Object,
            },
            maxHeight: { // 表格的最大高度，如果没有指定 height ，就会采用这个高度，这个高度是会计算的
                type: Number,
            },
            pagination: {
                type: Boolean,
                default: false,
            },
            handleSortChange: {
                type: Function,
                required: true,
            },
            handleCurrentChange: {
                type: Function,
            },
            handleSizeChange: {
                type: Function,
            },
            pageSize: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
            pageNumber: {
                type: Number,
            },
            data: {
                type: Array,
                required: true,
            },
            canEdit: {
                type: Function,
                default: () => () => true,
            },
            canRemove: {
                type: Function,
                default: () => () => true,
            },
            operationColumnWidth: {
                type: Number,
                default: 200,
            },
            showOperationColumn: {
                type: Boolean,
                default: true,
            },
            operationButtons: {
                type: Array,
                default: () => [],
            },
            rowClassName: {},
            treeProps: {
                type: Object,
            },
            paginationLayout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper',
            },
        },
    };
</script>
