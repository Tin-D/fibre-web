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

            <el-form-item label="品牌" prop="brandId">
                <brand-selector @typeId="typeId" style="width: 100%;" v-model="form.brandId"/>
            </el-form-item>

            <el-form-item label="名称" prop="name">
                <el-input placeholder="名称" v-model="form.name"/>
            </el-form-item>

            <el-form-item label="优先级" prop="orderNumber">
                <el-input v-model.number="form.orderNumber" placeholder="优先级"/>
            </el-form-item>

            <el-form-item label="说明书及其他资料">
                <file-list v-model="form.attachments" :recorder-id="form.attachmentListToken"/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import * as validators from '@/roadhog/validators';
    import BrandSelector from '@/components/brand/BrandSelector';
    import FileList from '@/components/common/FileList';
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { models } from '@/store/models';

    const storeModuleName = models.brandModel;

    export default {
        components: {
            BrandSelector,
            FileList,
        },
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                partTitle: '型号',
            };
        },
        methods: {
            initForm () {
                return {
                    brandId: {
                        rules: [validators.required()],
                    },
                    name: {
                        rules: [validators.required()],
                    },
                    equipmentTypeId: {
                        rules: [validators.required()],
                    },
                    orderNumber: {
                        rules: [validators.isNumber()],
                    },
                    attachments: {
                        default: [],
                    },
                    attachmentListToken: {},
                };
            },
            typeId (value) {
                this.form.equipmentTypeId = value;
            },
        },
    };
</script>
