<template>
    <div v-loading="isLoading">
        <slot name="page-header" v-if="showPageHeader">
            <page-header/>
        </slot>

        <el-form
            inline
            class="toolbar"
            size="mini"
            @submit.prevent.native="handleSearch"
        >
            <el-form-item>
                <el-input
                    prefix-icon="el-icon-search"
                    placeholder="请输入关键字"
                    v-model="keywords"
                    clearable
                    @clear="handleSearch"
                />
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="handleSearch"> 检索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-refresh" type="primary" @click="handleRefresh(true)"> 刷新</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="EditorDialog.handleAdd" v-if="displayAddButton"> 新增</el-button>
            </el-form-item>

            <slot name="toolbar"/>
        </el-form>

        <lan-client-table
            :data="displayItems"
            :default-sort="defaultSort"
            @edit="EditorDialog.handleEdit"
            @remove="EditorDialog.handleRemove"
            :max-height="tableMaxHeight"
            :pagination="pagination"
            :operation-column-width="operationColumnWidth"
            :show-operation-column="showOperationColumn"
            :operationButtons="operationButtons"
            :can-edit="canEdit"
            :can-remove="canRemove"
        >
            <slot/>

        </lan-client-table>

        <template v-if="editor">
            <component
                v-if="EditorDialog.show"
                :is="editor"
                @close="EditorDialog.handleClose"
                :id="EditorDialog.id"
                v-bind="editorProps"
            />
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import LanClientTable from '@/roadhog/LanClientTable';

    export default {
        components: { LanClientTable },
        watch: {
            contentHeight: {
                handler () {
                    this.resize();
                },
                immediate: true,
            },
            items: {
                handler () {
                    this.handleSearch();
                },
                immediate: true,
            },
        },
        data () {
            return {
                keywords: null,
                displayItems: [],
                tableMaxHeight: 0,
                isLoading: true,
                EditorDialog: {
                    show: false,
                    id: null,
                    handleClose: (returnValue) => {
                        this.EditorDialog.show = false;
                        this.EditorDialog.id = null;
                        if (returnValue?.refresh) {
                            this.handleSearch();
                        }
                    },
                    handleAdd: () => {
                        this.EditorDialog.show = true;
                        this.EditorDialog.id = null;
                    },
                    handleEdit: async (row) => {
                        this.EditorDialog.show = true;
                        this.EditorDialog.id = row.id;
                    },
                    handleRemove: async (row) => {
                        await this.$confirm(`确定删除项目：${row[this.itemNameProperty]} ?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        });
                        await this.$store.dispatch(`${this.storeModuleName}/remove`, row.id);
                    },
                },
            };
        },
        created () {
            this.handleRefresh();
        },
        methods: {
            handleSearch () {
                if (this.keywords == null || this.keywords === '') {
                    this.displayItems = this.items;
                    return;
                }

                let filterMethod = this.filterMethod;
                if (_.isArray(this.filterMethod)) {
                    filterMethod = (n, keywords) => {
                        for (let p of this.filterMethod) {
                            const value = n[p];
                            if (value != null) {
                                if (_.includes(value.toLowerCase(), keywords)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };
                }
                this.displayItems = _.filter(this.items, (n) => filterMethod(n, this.keywords.toLowerCase()));
            },
            async handleRefresh (showMessage) {
                this.isLoading = true;
                try {
                    await this.$store.dispatch(`${this.storeModuleName}/${this.listAction}`);
                    if (showMessage) {
                        this.$message({
                            showClose: true,
                            message: '刷新成功',
                            type: 'success',
                        });
                    }
                    this.$emit('refresh');
                } finally {
                    this.isLoading = false;
                }
            },
            resize () {
                this.$nextTick(() => {
                    const pageHeaderHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('page-header')[0]);
                    const toolbarHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('toolbar')[0]);
                    this.tableMaxHeight = this.contentHeight - pageHeaderHeight - toolbarHeight;
                });
            },
            openEditor (row) {
                if (row) {
                    this.EditorDialog.handleEdit(row);
                } else {
                    this.EditorDialog.handleAdd();
                }
            },
        },
        computed: {
            ...mapState({
                contentHeight: (state) => state.global.contentHeight,
            }),
            items () {
                const result = this.$store.state[this.storeModuleName][this.stateListProperty];
                return this.filterItems ? this.filterItems(result) : result;
            },
        },
        props: {
            showPageHeader: {
                type: Boolean,
                default: true,
            },
            editor: {
                type: Object,
            },
            editorProps: {
                type: Object,
            },
            defaultSort: {
                type: Object,
            },
            storeModuleName: {
                type: String,
                required: true,
            },
            stateListProperty: {
                type: String,
                required: true,
            },
            listAction: {
                type: String,
                default: 'list',
            },
            pagination: {
                type: Boolean,
                default: false,
            },
            itemNameProperty: {
                type: String,
                default: 'name',
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
            filterMethod: { // 如果是Function(item, keywords)，就会把这个方法传到_.filter中去，如果是Array，表示自动对每一行的这些属性做匹配
                type: [Function, Array],
            },
            filterItems: { // 对所有结果做过滤，有些时候并不希望这个所有结果都作为候选展示结果
                type: Function,
            },
            canEdit: {
                type: Function,
            },
            canRemove: {
                type: Function,
            },
            displayAddButton: {
                type: Boolean,
                default: true,
            },
        },
    };
</script>
