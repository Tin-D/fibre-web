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

            <el-form-item label="设备类型" prop="equipmentTypeId">
                <dictionary-code-selector-simple :readonly="!isCreate"
                                                 placeholder="设备类型"
                                                 root-code="EquipmentType"
                                                 style="width: 100%"
                                                 v-model="form.equipmentTypeId"
                />
            </el-form-item>

            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="名称"/>
            </el-form-item>

            <el-form-item label="排序" prop="orderNumber">
                <el-input v-model="form.orderNumber" placeholder="排序"/>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="备注"
                    v-model="form.remark"
                />
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { models } from '@/store/models';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';

    const storeModuleName = models.brand;

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        components: {
            DictionaryCodeSelectorSimple,
        },
        data () {
            return {
                partTitle: '品牌',
            };
        },
        methods: {
            initForm () {
                return {
                    equipmentTypeId: {
                        rules: [validators.required()],
                    },
                    name: {
                        rules: [validators.required(), validators.validateAsync(this.checkUnique())],
                    },
                    orderNumber: {
                        rules: [validators.isNumber()],
                    },
                    remark: {},
                };
            },
        },
    };
</script>
