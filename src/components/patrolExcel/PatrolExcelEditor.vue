<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData">

        <el-form v-if="!isLoadingFormData"
                 ref="form"
                 :rules="rules"
                 :model="form"
                 label-width="80px"
                 size="mini"
        >

            <el-form-item label="设备类型" prop="typeId">
                <dictionary-code-selector-simple :readonly="!isCreate"
                                                 placeholder="设备类型"
                                                 root-code="EquipmentType"
                                                 style="width: 100%"
                                                 v-model="form.equipmentTypeId"
                />
            </el-form-item>

            <el-form-item label="备注">
                <el-input type="" v-model="form.remark"/>
            </el-form-item>

            <el-form-item label="附件">
                <file-list v-model="form.attachments" :recorder-id="form.attachmentListToken" :limit="1"/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import * as validators from '@/roadhog/validators';
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { models } from '@/store/models';
    import FileList from '@/components/common/FileList';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';

    const storeModuleName = models.patrolExcel;

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        components: { FileList, DictionaryCodeSelectorSimple },
        data () {
            return {
                partTitle: '运维表格',
            };
        },
        methods: {
            initForm () {
                return {
                    equipmentTypeId: {
                        rules: [validators.required()],
                    },
                    remark: {},
                    attachments: {
                        default: [],
                    },
                    attachmentListToken: {},
                };
            },
            processValues (values) {
                if (values.attachments) {
                    values.attachments = [values.attachments];
                }

                return values;
            },
        },
    };
</script>
