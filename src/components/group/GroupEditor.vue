<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData"
    >

        <el-form v-if="!isLoadingFormData"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px"
                 size="mini">

            <el-form-item prop="name" label="名称">
                <el-input placeholder="名称" v-model="form.name" :readonly="readonly || !form.editable"/>
            </el-form-item>

            <el-form-item prop="code" label="代码">
                <el-input placeholder="代码" v-model="form.code" :readonly="readonly || !form.editable"/>
            </el-form-item>

            <el-form-item prop="remark" label="说明">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="form.remark"
                    :readonly="readonly || !form.editable"
                />
            </el-form-item>

        </el-form>

        <el-button size="mini"
                   style="margin-bottom: 10px;"
                   @click="OrganizationSelectorDialog.handleAdd"
                   v-if="!isCreate"
        >
            增加人员到角色中
        </el-button>

        <lan-client-table v-if="!isCreate"
                          :data="users"
                          :max-height="500"
                          pagination
                          :show-operation-column="false"
        >
            <el-table-column type="index" width="55"/>

            <el-table-column label="帐号" prop="username" sortable="custom"/>

            <el-table-column label="姓名" prop="fullName" sortable="custom"/>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="text" @click="OrganizationSelectorDialog.handleRemoveUser(row)">删除</el-button>
                </template>
            </el-table-column>

        </lan-client-table>

        <organization-selector-dialog v-if="OrganizationSelectorDialog.show"
                                      :mode="['user']"
                                      @close="OrganizationSelectorDialog.handleClose"
                                      :value="[]"
        />

        <div slot="buttons" v-if="readonly"></div>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { confirmDialog } from '@/roadhog/alert';
    import OrganizationSelectorDialog from '@/components/common/OrganizationSelectorDialog';
    import { actionTypes } from '@/store/actionTypes';

    const storeModuleName = 'group';

    export default {
        components: { OrganizationSelectorDialog, LanClientTable },
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        created () {
            if (!this.isCreate) {
                this.findGroupUsers();
            }
        },
        data () {
            return {
                partTitle: '角色',
                users: [],
                OrganizationSelectorDialog: {
                    show: false,
                    handleClose: async (selectedUsers) => {
                        this.OrganizationSelectorDialog.show = false;
                        if (selectedUsers) {
                            await this.$store.dispatch(`group/${actionTypes.group.addUsersToGroup}`, {
                                groupId: this.id,
                                userIds: _.map(selectedUsers, 'id'),
                            });
                            this.findGroupUsers();
                        }
                    },
                    handleAdd: () => {
                        this.OrganizationSelectorDialog.show = true;
                    },
                    handleRemoveUser: async (row) => {
                        await confirmDialog({ message: `确定要将用户"${row.fullName}"从该角色中删除吗` });
                        await this.$store.dispatch(`group/${actionTypes.group.removeUsersFromGroup}`, {
                            groupId: this.id,
                            userIds: [row.id],
                        });
                        this.findGroupUsers();
                    },
                },
            };
        },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
        },
        methods: {
            initForm () {
                return {
                    name: {
                        rules: [validators.required(), validators.validateAsync(this.checkUnique({ property: 'name' }))],
                    },
                    code: {
                        rules: [validators.required(), validators.validateAsync(this.checkUnique({ property: 'code' }))],
                    },
                    users: {
                        default: [],
                        set: (formData) => (formData && formData.users) ? _.map(formData.users, 'id') : [],
                    },
                    editable: {
                        default: true,
                    },
                    remark: {},
                };
            },
            processValues (values) {
                return values;
            },
            async findGroupUsers () {
                this.users = await this.$store.dispatch(`group/${actionTypes.group.findGroupUsers}`, this.id);
            },
        },
    };
</script>
