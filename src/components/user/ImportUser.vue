<template>
    <lan-form-dialog
        ref="lanDialog"
        title="批量导入用户"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData"
    >
        <file-list v-model="form.attachments"
                   :recorder-id="recorder ? recorder.attachmentListToken : null"
                   :limit="1"
        />

        <div slot="buttons">
            <el-button size="mini" type="success" @click="handleSubmit">提交</el-button>
            <el-button size="mini" type="default" @click="closeDialog">关闭</el-button>
        </div>
    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import FileList from '@/components/common/FileList';
    import { actionTypes } from '@/store/actionTypes';

    const storeModuleName = 'user';

    export default {
        components: { FileList },
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                message: null,
            };
        },
        methods: {
            initForm () {
                return {};
            },
            async handleSubmit () {
                const response = await this.$store.dispatch(`${storeModuleName}/${actionTypes.user.importUsers}`, this.form.attachments);
                this.$message({
                    message: '已成功导入' + response.message + '组数据。',
                    type: 'success',
                });
                this.closeDialog({ refresh: true });
            },
        },
        props: {

        },
    };
</script>
