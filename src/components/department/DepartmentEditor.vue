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
                 label-width="100px"
                 size="mini"
        >

            <el-form-item label="上级部门" prop="parentId">
                <department-selector v-model="form.parentId" check-strictly :disabled="readonly" style="width: 100%;"/>
            </el-form-item>

            <el-form-item label="名称" prop="name">
                <el-input placeholder="名称" v-model="form.name" :readonly="readonly"/>
            </el-form-item>

            <el-form-item label="部门负责人" prop="chargeUserId">
                <organization-input v-model="form.chargeUserId" :mode="['user']" :max-items="1" placeholder="部门负责人（单选）"/>
            </el-form-item>

            <el-form-item label="排序" prop="orderNumber">
                <el-input-number :min="0" v-model="form.orderNumber" :readonly="readonly"/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import DepartmentSelector from '@/components/common/DepartmentSelector';
    import OrganizationInput from '@/components/common/OrganizationInput';

    const storeModuleName = 'department';

    export default {
        components: {
            OrganizationInput,
            DepartmentSelector,
        },
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                partTitle: '部门',
            };
        },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
        },
        methods: {
            initForm () {
                const result = {
                    name: {
                        rules: [validators.required()],
                    },
                    parentId: {},
                    chargeUserId: {
                        set: (formData) => formData.chargeUserId ? [formData.chargeUserId] : [],
                        default: [],
                    },
                    orderNumber: {
                        default: 1,
                    },
                };

                if (this.isCreate) {
                    result.parentId.default = this.parentId;
                }
                return result;
            },
            processValues (values) {
                values.chargeUserId = values.chargeUserId ? values.chargeUserId[0] : null;
                return values;
            },
        },
        props: {
            parentId: {
                type: String,
            },
        },
    };
</script>
