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

            <el-form-item label="父级">
                <el-cascader
                    :options="parentCodes"
                    :props="{value: 'id', label: 'name', disabled: 'disabled'}"
                    change-on-select
                    v-model="form.parentIdPath"
                    style="width: 100%"
                    :disabled="readonly"
                />
            </el-form-item>

            <el-form-item label="代码" prop="code">
                <el-input placeholder="代码" v-model="form.code" :readonly="readonly"/>
            </el-form-item>

            <el-form-item label="名称" prop="name">
                <el-input placeholder="名称" v-model="form.name" :readonly="readonly"/>
            </el-form-item>

            <el-form-item label="排序" prop="index">
                <el-input placeholder="排序" v-model="form.index" :readonly="readonly"/>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" :readonly="readonly"/>
            </el-form-item>

        </el-form>

        <div slot="buttons" v-if="readonly"></div>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { getterTypes } from '@/store/getterTypes';
    import { loopTree } from '@/roadhog/utils';

    const storeModuleName = 'dictionaryCode';

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                partTitle: '代码',
            };
        },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
            codes () {
                return this.$store.state.dictionaryCode.codes;
            },
            parentCodes () {
                const result = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getCodeTree}`];
                if (this.isCreate) {
                    return result;
                }

                const r = _.cloneDeep(result);
                loopTree(r, n => {
                    if (n.treePath.includes(this.recorder.parentId) && _.last(n.treePath) !== this.recorder.parentId) {
                        n.disabled = true;
                    }
                });
                return r;
            },
        },
        methods: {
            initForm () {
                return {
                    name: {
                        rules: [validators.required()],
                    },
                    code: {
                        rules: [
                            validators.required(),
                            validators.validateAsync(this.checkUnique({ property: 'code' })),
                        ],
                    },
                    index: {
                        rules: [validators.isInt()],
                    },
                    remark: {},
                    parentId: {},
                    parentIdPath: {
                        default: [],
                        set: (formData) => {
                            let result = [];
                            const parentId = formData?.parentId || this.parentId;
                            if (parentId) {
                                const parentCode = this.codes.find(n => n.id === parentId);
                                if (parentCode) {
                                    result = parentCode.treePath;
                                }
                            }
                            return result;
                        },
                    },
                };
            },
            processValues (values) {
                values.parentId = values.parentIdPath.length === 0 ? null : _.last(values.parentIdPath);
                return values;
            },
        },
        props: {
            parentId: {
                type: String,
                required: true,
            },
        },
    };
</script>
