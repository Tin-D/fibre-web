<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="false"
        submit-text="确定"
        width="1160px"
    >

        <organization-selector :mode="mode"
                               v-model="data"
                               :max-items="maxItems"
        />

    </lan-form-dialog>
</template>

<script>
    import OrganizationSelector from './OrganizationSelector';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { confirmDialog } from '@/roadhog/alert';

    export default {
        components: { OrganizationSelector },
        mixins: [dialogMixin()],
        created () {
            this.data.push(...this.value);
        },
        data () {
            return {
                data: [],
            };
        },
        methods: {
            async handleSubmit () {
                if (this.data.length === 0) {
                    await confirmDialog({ message: '没有选择任何项目，确定要关闭选择器' });
                }
                this.closeDialog(this.data);
            },
        },
        props: {
            mode: { // 模式：支持 department(部门), user(人员), post(岗位)
                type: Array,
                required: true,
            },
            value: {
                type: Array,
                required: true,
            },
            title: {
                type: String,
                default: '人员选择器',
            },
            maxItems: {
                type: Number,
                default: 0,
            },
        },
    };
</script>
