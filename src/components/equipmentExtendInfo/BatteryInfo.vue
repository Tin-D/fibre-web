<template>
    <el-form :model="form"
             :rules="rules"
             label-width="120px"
             ref="form"
             size="mini"
    >
        <el-form-item label="外观尺寸" prop="appearanceSize">
            <el-input :disabled="detailInfo" placeholder="请填写外观尺寸" v-model="form.appearanceSize"/>
        </el-form-item>
        <el-form-item label="标称电压(V)" prop="nominalVoltage">
            <el-input :disabled="detailInfo" placeholder="请填写标称电压(V)" v-model="form.nominalVoltage"/>
        </el-form-item>
        <el-form-item label="标称容量(AH)" prop="nominalCapacity">
            <el-input :disabled="detailInfo" placeholder="请填写标称容量(AH)" v-model="form.nominalCapacity"/>
        </el-form-item>
        <el-form-item label="满电内阻(MΩ)" prop="fullElectricInternalResistance">
            <el-input :disabled="detailInfo" placeholder="请填写满电内阻(MΩ)" v-model="form.fullElectricInternalResistance"/>
        </el-form-item>
        <el-form-item label="质量(KG)" prop="quality">
            <el-input :disabled="detailInfo" placeholder="请填写质量(KG)" v-model="form.quality"/>
        </el-form-item>
        <el-form-item label="端子规格(厘)" prop="terminalSpecifications">
            <el-input :disabled="detailInfo" placeholder="请填写端子规格(厘)" v-model="form.terminalSpecifications"/>
        </el-form-item>
        <el-form-item label="操作记录" prop="operationRecord">
            <el-input :disabled="detailInfo" v-model="form.operationRecord"/>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 设备仓库新增编辑电池扩展信息
     */
    import * as validators from '@/roadhog/validators';

    export default {
        data () {
            return {
                form: {
                    appearanceSize: null,
                    nominalVoltage: null,
                    nominalCapacity: null,
                    fullElectricInternalResistance: null,
                    quality: null,
                    terminalSpecifications: null,
                    operationRecord: null,
                },
                rules: {
                    appearanceSize: [validators.required()],
                    nominalVoltage: [validators.required()],
                    nominalCapacity: [validators.required()],
                    fullElectricInternalResistance: [validators.required()],
                    quality: [validators.required()],
                    terminalSpecifications: [validators.required()],
                },
            };
        },
        created () {
            if (this.recorder && this.recorder.configs) {
                this.form = JSON.parse(this.recorder.configs);
            }
        },
        methods: {
            async collectValues () {
                await this.$refs.form.validate();
                return this.form;
            },
        },
        props: {
            recorder: {
                type: Object,
            },
            detailInfo: {
                type: Boolean,
            },
        },
    };
</script>
