<template>
    <div style="width: 100%;">
        <page-header/>

        <el-form class="toolbar" size="mini" inline @keyup.enter.native.stop="load(true)">
            <el-form-item title="用户名">
                <el-input placeholder="用户名" clearable v-model.trim="pagination.query.username"/>
            </el-form-item>

            <el-form-item title="姓名">
                <el-input placeholder="姓名" clearable v-model.trim="pagination.query.fullName"/>
            </el-form-item>

            <el-form-item title="邮箱">
                <el-input placeholder="邮箱" clearable v-model.trim="pagination.query.email"/>
            </el-form-item>

            <el-form-item title="电话">
                <el-input placeholder="电话" clearable v-model.trim="pagination.query.phone"/>
            </el-form-item>

            <el-form-item title="启用状态">
                <el-select placeholder="是否启用" v-model="pagination.query.enable">
                    <el-option :value="null" label="启用状态（所有）"/>
                    <el-option :value="true" label="已启用"/>
                    <el-option :value="false" label="未启用"/>
                </el-select>
            </el-form-item>

            <el-form-item title="锁定状态">
                <el-select placeholder="是否启用" v-model="pagination.query.locked">
                    <el-option :value="null" label="锁定状态（所有）"/>
                    <el-option :value="true" label="已锁定"/>
                    <el-option :value="false" label="未锁定"/>
                </el-select>
            </el-form-item>

            <el-form-item title="角色">
                <group-selector v-model="pagination.query.groupIds" all-groups multiple/>
            </el-form-item>

            <el-form-item>
                <organization-input :mode="['department', 'user', 'post', 'group']" v-model="pagination.query.aa"/>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="load(true)">检索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="el-icon-plus" @click="UserEditorDialog.handleAdd" v-if="checkRole(roles.gly)">新增用户</el-button>
            </el-form-item>

            <el-form-item>
                <el-button @click="downloadTemplate" v-if="checkRole(roles.gly)">下载导入模板</el-button>
            </el-form-item>

            <el-form-item>
                <el-button @click="ImportUserDialog.handleImport" v-if="checkRole(roles.gly)">批量导入</el-button>
            </el-form-item>

            <el-form-item>
                <el-button icon="fa fa-refresh" @click="handleRefresh" v-if="checkRole(roles.gly)"> 强制更新所有系统数据</el-button>
            </el-form-item>
        </el-form>

        <lan-server-table :pagination="pagination"
                          :max-height="tableHeight"
                          @load="load"
                          :default-sort="pagination.defaultSort"
                          :operation-buttons="[resetPasswordButton]"
                          :operation-column-width="300"
                          @edit="UserEditorDialog.handleEdit"
                          @remove="UserEditorDialog.handleRemove"
                          :show-operation-column="checkRole(roles.gly)"
        >

            <el-table-column prop="username" label="用户名" sortable>
                <template slot-scope="{ row }">
                    <span v-if="checkRole(roles.gly)">{{ row.username }}</span>
                    <el-button type="text" v-else @click="UserEditorDialog.handleEdit(row)">{{ row.username }}</el-button>
                </template>
            </el-table-column>

            <el-table-column prop="fullName" label="姓名" sortable/>

            <el-table-column prop="phone" label="电话" sortable/>

            <el-table-column prop="email" label="邮箱" sortable/>

            <el-table-column prop="enable" label="启用" sortable :formatter="renderBooleanRow"/>

            <el-table-column prop="locked" label="锁定" sortable :formatter="renderBooleanRow"/>

        </lan-server-table>

        <user-editor v-if="UserEditorDialog.show"
                     :id="UserEditorDialog.id"
                     :user="UserEditorDialog.row"
                     @close="UserEditorDialog.handleClose"
        />

        <import-user v-if="ImportUserDialog.show"
                     @close="ImportUserDialog.handleClose"
        />
    </div>

</template>

<script>
    import axios from 'axios';
    import UserEditor from '@/components/user/UserEditor';
    import LanTableOperationButton from '@/roadhog/LanTableOperationButton';
    import { alertMessage, confirmDialog } from '@/roadhog/alert';
    import { actionTypes } from '@/store/actionTypes';
    import LanServerTable from '@/roadhog/LanServerTable';
    import { Pagination } from '@/roadhog/Pagination';
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import GroupSelector from '@/components/common/GroupSelector';
    import OrganizationInput from '@/components/common/OrganizationInput';
    import ImportUser from '@/components/user/ImportUser';

    export default {
        components: { ImportUser, OrganizationInput, GroupSelector, LanServerTable, UserEditor },
        mixins: [autoHeightTableMixin()],
        created () {
            this.load();
        },
        data () {
            return {
                tableHeight: 0,
                pagination: new Pagination({
                    sortField: 'username',
                    sortOrder: 'asc',
                    username: null,
                    fullName: null,
                    email: null,
                    phone: null,
                    locked: null,
                    enable: null,
                    groupIds: [],
                    departmentIds: [],
                    aa: [],
                }),
                UserEditorDialog: {
                    show: false,
                    row: null,
                    id: null,
                    handleClose: (returnValue) => {
                        this.UserEditorDialog.show = false;
                        this.UserEditorDialog.id = null;
                        this.UserEditorDialog.row = null;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleAdd: () => {
                        this.UserEditorDialog.show = true;
                        this.UserEditorDialog.id = null;
                        this.UserEditorDialog.row = null;
                    },
                    handleEdit: async (row) => {
                        this.UserEditorDialog.show = true;
                        this.UserEditorDialog.id = row.id;
                        this.UserEditorDialog.row = row;
                    },
                    handleRemove: async (row) => {
                        await this.$confirm(`确定删除项目：${row.fullName}(${row.username}) ?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        });

                        await this.$store.dispatch(`user/${actionTypes.common.remove}`, row.id);
                        this.load();
                    },
                },
                resetPasswordButton: new LanTableOperationButton({
                    text: '重置密码',
                    icon: 'fa fa-recycle',
                    handler: async (row) => {
                        await confirmDialog({ message: `确定要重置用户 ${row.fullName} 的密码吗` });
                        const newPassword = await this.$store.dispatch(`user/${actionTypes.user.resetPassword}`, row.id);
                        alertMessage(`密码重置成功，新密码 <strong style="color: red;">${newPassword}</strong>，该用户下次登录的时候系统会强制要求修改密码`, true);
                    },
                }),
                ImportUserDialog: {
                    show: false,
                    handleClose: (returnValue) => {
                        this.ImportUserDialog.show = false;
                        if (returnValue && returnValue.refresh) {
                            this.load();
                        }
                    },
                    handleImport: () => {
                        this.ImportUserDialog.show = true;
                    },
                },
            };
        },
        methods: {
            async load (gotoFirstPage) {
                if (gotoFirstPage) {
                    this.pagination.setPage(1);
                }
                const result = await this.$store.dispatch(`user/${actionTypes.common.list}`, this.pagination.query);
                this.pagination.setResult(result);
            },
            downloadTemplate () {
                this.$store.dispatch(actionTypes.common.openNewWindow, '/user_import_template');
            },
            async handleRefresh () {
                await axios.get('/refresh_caches', {
                    loading: {
                        text: '正在刷新，请稍后...',
                        target: this.$el,
                    },
                });
                await alertMessage('刷新成功');
                this.load(true);
            },
        },
    };
</script>
