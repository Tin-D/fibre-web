<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="false"
    >

        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="80px"
                 size="mini"
        >

            <el-form-item label="名称" prop="name">
                <el-input v-model.trim="form.name" placeholder="名称"/>
            </el-form-item>

            <el-form-item label="表达式" prop="expression">
                <el-input v-model="form.expression" placeholder="表达式，不填写代表这个分支默认成立"/>
            </el-form-item>

            <el-form-item label="执行步骤" prop="stepCode">
                <el-select v-model="form.stepCode" style="width: 100%;" placeholder="分支成立的下一个步骤，不选就代表流程结束">
                    <el-option v-for="s of this.steps"
                               :label="s.name"
                               :value="s.code"
                               :key="s.code"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="启用" prop="enable">
                <el-checkbox v-model="form.enable"/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';

    class Branch {
        constructor () {
            this.name = null;
            this.expression = null;
            this.stepCode = null;
            this.enable = true;
        }
    }

    export default {
        mixins: [dialogMixin()],
        data () {
            const title = this.branch ? `修改分支: ${this.branch.name}` : '新增分支';
            const form = new Branch();
            if (this.branch) {
                Object.assign(form, this.branch);
            }

            return {
                title,
                form,
                rules: {
                    name: [validators.required()],
                },
            };
        },
        methods: {
            async handleSubmit () {
                await this.$refs.form.validate();
                const branch = this.processValues(this.form);
                this.closeDialog({ refresh: true, branch });
            },
            processValues (values) {
                return values;
            },
        },
        props: {
            branch: {
                type: Object,
            },
            steps: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
