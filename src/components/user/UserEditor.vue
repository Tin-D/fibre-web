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
                 size="mini"
        >
            <el-form-item prop="id" label="唯一标识" v-if="!isCreate">
                <span>{{ user.id }}</span>
            </el-form-item>

            <el-form-item prop="username" label="用户名">
                <el-input placeholder="用户名" v-model="form.username" :readonly="!isCreate"/>
            </el-form-item>

            <el-form-item prop="password" label="密码" v-if="isCreate">
                <el-input placeholder="密码" v-model="form.password" type="password"/>
            </el-form-item>

            <el-form-item prop="fullName" label="姓名">
                <el-input placeholder="姓名" v-model="form.fullName" :readonly="readonly"/>
            </el-form-item>

            <el-form-item prop="entryDate" label="入职时间">
                <el-date-picker
                    v-model="form.entryDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                />
            </el-form-item>

            <el-form-item prop="phone" label="电话">
                <el-input placeholder="电话" v-model="form.phone" :readonly="readonly"/>
            </el-form-item>

            <el-form-item prop="email" label="邮箱">
                <el-input placeholder="邮箱" v-model="form.email" :readonly="readonly"/>
            </el-form-item>

            <el-form-item prop="enable" label="启用">
                <el-checkbox v-model="form.enable" :disabled="readonly"/>
            </el-form-item>

            <el-form-item prop="locked" label="锁定">
                <el-checkbox v-model="form.locked" :disabled="readonly"/>
            </el-form-item>

            <el-form-item prop="onlyGroup" label="三员角色">
                <group-selector v-model="form.onlyGroup" only-group placeholder="请选择三员角色" :readonly="readonly"/>
            </el-form-item>

            <el-form-item prop="commonGroups" label="角色" v-if="!form.onlyGroup">
                <group-selector v-model="form.commonGroups" multiple :readonly="readonly"/>
            </el-form-item>

            <el-form-item prop="departmentIds" label="部门">
                <department-selector v-model="form.departmentIds" multiple check-strictly :disabled="readonly" style="width: 100%"/>
            </el-form-item>

            <el-form-item prop="postIds" label="岗位">
                <dictionary-code-selector-simple v-model="form.postIds"
                                                 root-code="Post"
                                                 placeholder="请选择职级"
                                                 multiple
                                                 :readonly="readonly"
                                                 style="width: 100%"
                />
            </el-form-item>

            <el-form-item prop="rankId" label="职级">
                <dictionary-code-selector-simple v-model="form.rankId"
                                                 root-code="Rank"
                                                 placeholder="请选择岗位"
                                                 :readonly="readonly"
                                                 style="width: 100%"
                />
            </el-form-item>

            <el-form-item prop="index" label="排序">
                <el-input v-model="form.index" placeholder="排序"/>
            </el-form-item>

            <el-form-item label="最后修改密码时间" v-if="!isCreate">
                {{ renderDateTime(user.lastTimeChangePassword) || '无' }}
            </el-form-item>
        </el-form>

        <div slot="buttons" v-if="readonly"></div>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import GroupSelector from '@/components/common/GroupSelector';
    import DepartmentSelector from '@/components/common/DepartmentSelector';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';

    const storeModuleName = 'user';

    export default {
        components: { DictionaryCodeSelectorSimple, DepartmentSelector, GroupSelector },
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                partTitle: '用户',
            };
        },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
        },
        methods: {
            fillRecorder () {
                return this.user;
            },
            initForm () {
                const result = {
                    username: {
                        rules: [validators.required(), validators.validateAsync(this.checkUnique({ property: 'username' }))],
                    },
                    password: {
                        rules: [
                            validators.required(),
                            validators.passwordValidator(),
                        ],
                    },
                    fullName: {
                        rules: [validators.required()],
                    },
                    phone: {
                        rules: [validators.required()],
                    },
                    email: {
                        rules: [validators.email()],
                    },
                    enable: {
                        default: true,
                    },
                    locked: {
                        default: false,
                    },
                    onlyGroup: {
                        set: (formData) => {
                            if (formData && formData.groups) {
                                const groups = this.$store.state.group.groups;
                                return _.find(formData.groups, n => _.find(groups, i => n.id === i.id && i.only))?.id;
                            }
                            return null;
                        },
                    },
                    commonGroups: {
                        set: (formData) => {
                            if (formData && formData.groups) {
                                const groups = this.$store.state.group.groups;
                                return _.filter(formData.groups, n => _.find(groups, i => n.id === i.id && !i.only)).map(i => i.id);
                            }
                            return [];
                        },
                    },
                    departmentIds: {
                        default: [],
                        rules: [validators.required({ type: 'array' })],
                    },
                    postIds: {
                        default: [],
                    },
                    rankId: {},
                    entryDate: {},
                    index: {},
                };

                if (this.isCreate && this.departmentId) {
                    result.departmentIds.default.push(this.departmentId);
                }
                return result;
            },
            processValues (values) {
                if (!this.isCreate) {
                    delete values.password;
                }
                if (values.onlyGroup) {
                    values.groupIds = [values.onlyGroup];
                } else {
                    values.groupIds = values.commonGroups;
                }
                delete values.onlyGroup;
                delete values.commonGroups;
                return values;
            },
        },
        props: {
            user: {
                type: Object,
            },
            departmentId: {
                type: String,
            },
        },
    };
</script>
