<template>
    <el-form :model="form"
             :rules="rules"
             label-width="150px"
             ref="form"
             size="mini"
    >
        <el-form-item label="额定功率(KW)" prop="ratedPower">
            <el-input :disabled="detailInfo" placeholder="请填写额定功率(KW)" v-model="form.ratedPower"/>
        </el-form-item>
        <el-form-item label="送风方式" prop="airSupplyMode">
            <el-input :disabled="detailInfo" placeholder="请填写送风方式" v-model="form.airSupplyMode"/>
        </el-form-item>
        <el-form-item label="气流组织" prop="airDistribution">
            <el-input :disabled="detailInfo" placeholder="请填写气流组织" v-model="form.airDistribution"/>
        </el-form-item>
        <el-form-item label="操作记录">
            <el-input :disabled="detailInfo" v-model="form.operationRecord"/>
        </el-form-item>
        <el-form-item label="设定温度(℃)" prop="settingTemperature">
            <el-input :disabled="detailInfo" v-model="form.settingTemperature"/>
        </el-form-item>
        <el-form-item label="设定湿度(%)" prop="settingHumidity">
            <el-input :disabled="detailInfo" v-model="form.settingHumidity"/>
        </el-form-item>
        <el-form-item label="实际回风温度(℃)" prop="actualReturnAirTemperature">
            <el-input :disabled="detailInfo" v-model="form.actualReturnAirTemperature"/>
        </el-form-item>
        <el-form-item label="实际回风湿度(%)" prop="actualReturnAirHumidity">
            <el-input :disabled="detailInfo" v-model="form.actualReturnAirHumidity"/>
        </el-form-item>
        <el-form-item label="市电输入电流(A)" prop="mainsInputCurrentA">
            <el-input :disabled="detailInfo" v-model="form.mainsInputCurrentA"/>
        </el-form-item>
        <el-form-item label="压缩机运行电流(A)" prop="compressorRunningCurrentA">
            <el-input :disabled="detailInfo" v-model="form.compressorRunningCurrentA"/>
        </el-form-item>
        <el-form-item label="室内风机运行电流(A)" prop="operatingCurrentOfIndoorFanA">
            <el-input :disabled="detailInfo" v-model="form.operatingCurrentOfIndoorFanA"/>
        </el-form-item>
        <el-form-item label="室外风机运行电流(A)" prop="operatingCurrentOfOutdoorFanA">
            <el-input :disabled="detailInfo" v-model="form.operatingCurrentOfOutdoorFanA"/>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 设备仓库新增编辑空调扩展信息
     */
    import * as validators from '@/roadhog/validators';

    export default {
        data () {
            return {
                form: {
                    ratedPower: null,
                    airSupplyMode: null,
                    airDistribution: null,
                    operationRecord: null,
                    settingTemperature: null,
                    settingHumidity: null,
                    actualReturnAirTemperature: null,
                    actualReturnAirHumidity: null,
                    mainsInputCurrentA: null,
                    compressorRunningCurrentA: null,
                    operatingCurrentOfIndoorFanA: null,
                    operatingCurrentOfOutdoorFanA: null,
                },
                rules: {
                    ratedPower: [validators.required(), validators.isNumber()],
                    airSupplyMode: [validators.required()],
                    airDistribution: [validators.required()],
                    settingTemperature: [validators.isInt()],
                    settingHumidity: [this.floatOne()],
                    actualReturnAirTemperature: [validators.isInt()],
                    actualReturnAirHumidity: [this.floatOne()],
                    mainsInputCurrentA: [this.floatOne()],
                    compressorRunningCurrentA: [this.floatOne()],
                    operatingCurrentOfIndoorFanA: [this.floatOne()],
                    operatingCurrentOfOutdoorFanA: [this.floatOne()],
                },
            };
        },
        created () {
            if (this.recorder && this.recorder.configs) {
                this.form = JSON.parse(this.recorder.configs);
            }
        },
        methods: {
            floatOne (message = '请填写数字，可保留一位小数点') {
                return {
                    message,
                    pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1})?$/,
                };
            },
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
