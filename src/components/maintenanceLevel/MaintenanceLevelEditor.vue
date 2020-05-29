<template>
    <lan-form-dialog
        :is-loading="isLoadingFormData"
        :title="title"
        @close="handleClose"
        @submit="handleSubmit"
        ref="lanDialog">

        <el-form :model="form"
                 :rules="rules"
                 label-width="80px"
                 ref="form"
                 size="mini"
                 v-if="!isLoadingFormData"
        >

            <el-form-item label="设备类型" prop="equipmentTypeId">
                <dictionary-code-selector-simple :readonly="!isCreate"
                                                 placeholder="设备类型"
                                                 root-code="EquipmentType"
                                                 style="width: 100%"
                                                 v-model="form.equipmentTypeId"
                />
            </el-form-item>

            <el-form-item label="维护名称" prop="name">
                <el-input placeholder="请填写维护名称" v-model="form.name"/>
            </el-form-item>

            <el-form-item label="运维表格" prop="builtInTemplateIdAndName">
                <patrol-excel-selector :equipmentTypeId="form.equipmentTypeId"
                                       :values="form.builtInTemplateIdAndName"
                                       v-model="form.builtInTemplateIdAndName"/>
            </el-form-item>

            <el-form-item label="排序" prop="orderNumber">
                <el-input placeholder="请填写排序" v-model="form.orderNumber"/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import axios from 'axios';
    import * as validators from '@/roadhog/validators';
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import DictionaryCodeSelectorSimple from '@/components/dictionaryCode/DictionaryCodeSelectorSimple';
    import PatrolExcelSelector from '@/components/patrolExcel/PatrolExcelSelector';
    const storeModuleName = 'maintenanceLevel';
    let orderNumber = (rule, value, callback) => { // 排序验证
        let reg = /^\d+$/;
        if (value === '') {
            callback(new Error('必填项'));
        } else if (!reg.test(value)) {
            callback(new Error('请填写一个整数'));
        } else {
            callback();
        }
    };

    export default {
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        components: { DictionaryCodeSelectorSimple, PatrolExcelSelector },
        data () {
            return {
                partTitle: '维护等级',
            };
        },
        async created () {
            if (this.id) {
                const res = await axios.get(`maintenance_level/${this.id}`);
                res.data.builtInTemplateIdAndName.map(i => {
                    this.form.builtInTemplateIdAndName.push(i.id);
                });
            }
        },
        methods: {
            initForm () {
                return {
                    equipmentTypeId: {
                        rules: [validators.required()],
                    },
                    name: {
                        rules: [validators.required()],
                    },
                    orderNumber: {
                        rules: [{ required: true, validator: orderNumber, trigger: 'blur' }],
                    },
                    builtInTemplateIdAndName: {
                        rules: [validators.required({ type: 'array' })],
                        default: [],
                    },
                };
            },
        },
    };
</script>
