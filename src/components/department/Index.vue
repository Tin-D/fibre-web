<template>
    <div>
        <page-header/>

        <tree-list-index :data="departments"
                         is-tree-data
                         :tree-height="treeHeight"
                         ref="tl"
                         :root-node="rootNode"
                         remove-root-node-when-not-empty
                         @current-change="handleCurrentChange"

        >
            <el-form size="mini" class="toolbar" inline @submit.prevent.native="">
                <el-form-item>
                    <el-input placeholder="请输入关键字" prefix-icon="el-icon-search" clearable v-model="keywords"/>
                </el-form-item>

                <el-form-item>
                    <el-button @click="DepartmentEditorDialog.handleAdd" v-if="!readonly">新增子部门</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button @click="DepartmentEditorDialog.handleEdit" v-if="!readonly">编辑选中部门</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="DepartmentEditorDialog.handleRemove" v-if="!readonly">删除选中部门</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button @click="UserEditorDialog.handleAdd" v-if="!readonly">新增人员</el-button>
                </el-form-item>
            </el-form>

            <lan-client-table :data="displayUsers"
                              :max-height="tableHeight"
                              :default-sort="{prop: 'index', order: 'ascending'}"
                              @edit="UserEditorDialog.handleEdit"
                              @remove="UserEditorDialog.handleRemove"
                              :show-operation-column="!readonly"
                              pagination

            >
                <el-table-column type="index"/>

                <el-table-column prop="username" label="用户名" sortable/>

                <el-table-column prop="fullName" label="姓名" sortable/>

                <el-table-column prop="phone" label="电话" sortable/>

                <el-table-column prop="email" label="邮箱" sortable/>

                <el-table-column prop="enable" label="启用" sortable :formatter="renderBooleanRow"/>

                <el-table-column prop="locked" label="锁定" sortable :formatter="renderBooleanRow"/>

                <el-table-column prop="index" label="排序" sortable :sort-method="sortIndex"/>

            </lan-client-table>

        </tree-list-index>

        <department-editor v-if="DepartmentEditorDialog.show"
                           :id="DepartmentEditorDialog.id"
                           :parent-id="DepartmentEditorDialog.parentId"
                           @close="DepartmentEditorDialog.handleClose"
        />

        <user-editor v-if="UserEditorDialog.show"
                     :id="UserEditorDialog.id"
                     :user="UserEditorDialog.row"
                     :department-id="UserEditorDialog.departmentId"
                     @close="UserEditorDialog.handleClose"
        />
    </div>
</template>

<script>

    import TreeListIndex from '@/components/common/TreeListIndex';
    import DepartmentEditor from '@/components/department/DepartmentEditor';
    import { actionTypes } from '@/store/actionTypes';
    import { getterTypes } from '@/store/getterTypes';
    import { alertError, confirmDialog } from '@/roadhog/alert';
    import UserEditor from '@/components/user/UserEditor';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';

    export default {
        components: { LanClientTable, UserEditor, DepartmentEditor, TreeListIndex },
        mixins: [autoHeightTableMixin()],
        async created () {
            await this.$store.dispatch(`department/${actionTypes.common.list}`);
            if (this.departments.length > 0) {
                this.handleCurrentChange({ id: this.departments[0].id });
            }
            this.$nextTick(() => {
                this.calcTreeHeight();
            });
        },
        data () {
            return {
                tableHeight: 0,
                treeHeight: 0,
                keywords: null,
                rootNode: {
                    id: 'root_dep',
                    name: '本单位',
                },
                users: [],
                DepartmentEditorDialog: {
                    show: false,
                    id: null,
                    parentId: null,
                    handleClose: () => {
                        this.DepartmentEditorDialog.show = false;
                        this.DepartmentEditorDialog.id = null;
                    },
                    handleAdd: () => {
                        this.DepartmentEditorDialog.show = true;
                        this.DepartmentEditorDialog.id = null;
                        this.DepartmentEditorDialog.parentId = this.$refs.tl.getCurrentKey() === this.rootNode.id ? null : this.$refs.tl.getCurrentKey();
                    },
                    handleEdit: async () => {
                        const currentKey = this.$refs.tl.getCurrentKey();
                        if (!currentKey) {
                            alertError('没有选中部门');
                            return;
                        }

                        if (currentKey === this.rootNode.id) {
                            this.DepartmentEditorDialog.handleAdd();
                            return;
                        }

                        this.DepartmentEditorDialog.show = true;
                        this.DepartmentEditorDialog.id = currentKey;
                        this.DepartmentEditorDialog.parentId = null;
                    },
                    handleRemove: async () => {
                        const node = this.$refs.tl.getCurrentNode();
                        if (!node) {
                            alertError('没有选中部门');
                            return;
                        }

                        await this.$confirm(`确定删除部门：${node.name} ?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        });
                        if (node.children && node.children.length > 0) {
                            alertError('该部门有子部门，不允许删除');
                            return;
                        }

                        await this.$store.dispatch(`department/${actionTypes.common.remove}`, node.id);
                        this.$refs.tl.setCurrentNodeKey(node.parentId);
                    },
                },
                UserEditorDialog: {
                    show: false,
                    id: null,
                    row: null,
                    departmentId: null,
                    handleClose: (returnValue) => {
                        this.UserEditorDialog.show = false;
                        this.UserEditorDialog.id = null;
                        this.UserEditorDialog.row = null;
                        this.UserEditorDialog.departmentId = null;
                        if (returnValue && returnValue.refresh) {
                            this.handleCurrentChange(this.$refs.tl.getCurrentNode());
                        }
                    },
                    handleAdd: () => {
                        this.UserEditorDialog.show = true;
                        this.UserEditorDialog.id = null;
                        this.UserEditorDialog.row = null;
                        this.UserEditorDialog.departmentId = this.$refs.tl.getCurrentKey();
                    },
                    handleEdit: async (row) => {
                        this.UserEditorDialog.show = true;
                        this.UserEditorDialog.id = row.id;
                        this.UserEditorDialog.row = row;
                        this.UserEditorDialog.departmentId = null;
                    },
                    handleRemove: async (row) => {
                        await confirmDialog({ itemName: row.name });
                        await this.$store.dispatch(`user/${actionTypes.common.remove}`, row.id);
                        this.handleCurrentChange(this.$refs.tl.getCurrentNode());
                    },
                },
            };
        },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
            departments () {
                return this.$store.getters[`department/${getterTypes.department.getTreeData}`];
            },
            displayUsers () {
                if (this.users.length === 0) {
                    return [];
                }

                if (!this.keywords) {
                    return this.users;
                }

                return _.filter(this.users, n => _.includes(n.username, this.keywords) ||
                    _.includes(n.fullName, this.keywords) ||
                    _.includes(n.phone, this.keywords) ||
                    _.includes(n.email, this.keywords)
                );
            },
        },
        methods: {
            calcTreeHeight () {
                const pageHeaderHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('page-header')[0]);
                this.treeHeight = this.$store.state.global.contentHeight - pageHeaderHeight;
            },
            async findDepartmentUsers (node) {
                return this.$store.dispatch(`department/${actionTypes.department.findDepartmentUsers}`, node.id);
            },
            async handleCurrentChange (node) {
                this.users = await this.$store.dispatch(`department/${actionTypes.department.findDepartmentUsers}`, node.id);
            },
            sortIndex (a, b) { // 保证null在最后
                a = a.index;
                b = b.index;
                if (a === b) {
                    return 0;
                } else if (a === null || a === '') {
                    return 1;
                } else if (b === null || b === '') {
                    return -1;
                }
            },
        },
    };
</script>
