<template>
    <el-row :gutter="20" :style="{height: `${treeHeight}px`}">
        <el-col :span="4" style="overflow-y: auto; height: 100%;">
            <el-tree ref="tree"
                     :data="treeData"
                     :props="{label: 'name', children: 'children'}"
                     node-key="id"
                     highlight-current
                     :expand-on-click-node="expandOnClickNode"
                     @node-click="handleTreeNodeClick"
                     :default-expanded-keys="expandKeys"
                     @node-expand="handleNodeExpand"
                     @node-collapse="handleNodeCollapse"
                     :current-node-key="currentNodeKey"
            />
        </el-col>

        <el-col :span="20">
            <slot>
                <el-form size="mini" inline class="toolbar">
                    <slot name="toolbar">
                        <el-form-item>
                            <el-button icon="fa fa-plus" type="primary" @click="handleAdd"> 新增</el-button>
                        </el-form-item>
                    </slot>
                </el-form>

                <lan-client-table :data="tableData"
                                  :max-height="tableHeight"
                                  :default-sort="tableDefaultSort"
                                  @edit="handleEdit"
                                  @remove="handleRemove"
                                  :pagination="paginationTable"
                                  :tree-props="{children: 'cc'}"
                >
                    <el-table-column prop="name" label="名称" sortable/>

                    <el-table-column prop="orderNumber" label="排序" sortable/>
                </lan-client-table>
            </slot>
        </el-col>
    </el-row>
</template>

<script>
    import { generateTree } from '@/roadhog/utils';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { alertError, confirmDialog } from '@/roadhog/alert';

    export default {
        components: { LanClientTable },
        watch: {
            data: {
                handler (newValue) {
                    if (newValue.length === 0) {
                        this.treeData = [];
                        if (this.rootNode) {
                            this.treeData.push(this.rootNode);
                            this.currentNodeKey = this.rootNode.id;
                        }
                        return;
                    }

                    if (!this.isTreeData) {
                        const result = [];
                        generateTree(null, newValue, result);
                        this.treeData = result;
                    } else {
                        this.treeData = this.data;
                    }

                    if (this.rootNode && !this.removeRootNodeWhenNotEmpty) {
                        this.rootNode.children = this.treeData;
                        this.treeData = [this.rootNode];
                    }

                    this.$nextTick(() => {
                        const node = this.currentNodeKey == null ? null : this.$refs.tree.getNode(this.currentNodeKey);
                        if (node != null) {
                            this.$refs.tree.setCurrentKey(this.currentNodeKey);
                        } else {
                            this.currentNodeKey = this.treeData[0].id;
                            this.$refs.tree.setCurrentKey(this.currentNodeKey);
                            if (!this.expandKeys.includes(this.currentNodeKey)) {
                                this.expandKeys.push(this.treeData[0].id);
                            }
                        }
                    });
                },
                immediate: true,
            },
            currentNodeKey () {
                this.loadTableData();
            },
            treeHeight: {
                handler (newValue) {
                    this.$nextTick(() => {
                        const toolbarHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('toolbar')[0]);
                        this.tableHeight = newValue - toolbarHeight;
                    });
                },
                immediate: true,
            },
        },
        created () {
            this.treeData.name = this.rootNodeName;
        },
        data () {
            return {
                tableHeight: 0,
                currentNodeKey: null,
                expandKeys: [],
                treeData: [],
                tableData: [],
            };
        },
        methods: {
            handleTreeNodeClick (data) {
                this.currentNodeKey = data.id;
                this.$emit('current-change', data);
            },
            handleNodeExpand (data) {
                if (this.expandKeys.indexOf(data.id) < 0) {
                    this.expandKeys.push(data.id);
                }
            },
            handleNodeCollapse (data) {
                const index = this.expandKeys.indexOf(data.id);
                if (index > -1) {
                    this.expandKeys.splice(index, 1);
                }
            },
            handleAdd () {
                this.$emit('add', this.getCurrentNode());
            },
            handleEdit (row) {
                this.$emit('edit', row);
            },
            async handleRemove (row) {
                const node = this.$refs.tree.getNode(row.id);
                if (node.children && node.children.length > 0) {
                    alertError('不能删除有子节点的节点');
                    return;
                }
                await confirmDialog({ itemName: row.name });
                this.$emit('remove', node);
            },
            getCurrentKey () {
                return this.$refs.tree.getCurrentKey();
            },
            getCurrentNode () {
                return this.$refs.tree.getCurrentNode();
            },
            setCurrentNodeKey (key) {
                this.currentNodeKey = key;
            },
            async loadTableData () {
                if (this.tableDataLoader == null) {
                    this.tableData = this.getCurrentNode().children || [];
                } else {
                    this.tableData = await this.tableDataLoader(this.getCurrentNode());
                }
            },
        },
        props: {
            rootNode: {
                type: Object,
            },
            data: {
                type: Array,
                required: true,
            },
            isTreeData: {
                type: Boolean,
                default: false,
            },
            treeHeight: {
                type: Number,
            },
            removeRootNodeWhenNotEmpty: {
                type: Boolean,
                default: false,
            },
            tableDataLoader: { // 如何计算右侧表格显示的数据，默认展示当前选中节点的子节点，每次当前选中节点改变的时候会触发一次
                type: Function,
            },
            tableDefaultSort: {
                type: Object,
                default: () => {
                    return { prop: 'orderNumber' };
                },
            },
            paginationTable: {
                type: Boolean,
                default: false,
            },
            expandOnClickNode: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
