<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">
        <el-form-item label="温度(℃):" prop="temperature">
            <el-input v-model="form.temperature"></el-input>
        </el-form-item>

        <el-form-item label="温度设定值(℃):" prop="temperatureSetting">
            <el-input v-model="form.temperatureSetting"></el-input>
        </el-form-item>

        <el-form-item label="温度读取值(℃):" prop="temperatureReadingValue">
            <el-input v-model="form.temperatureReadingValue"></el-input>
        </el-form-item>

        <el-form-item label="温度实测值℃(回风口):" prop="temperatureMeasurementOfAirReturnPort">
            <el-input v-model="form.temperatureMeasurementOfAirReturnPort"></el-input>
        </el-form-item>

        <el-form-item label="温度实测值℃(出风口):" prop="temperatureMeasurementOfAirOutlet">
            <el-input v-model="form.temperatureMeasurementOfAirOutlet"></el-input>
        </el-form-item>

        <el-form-item label="湿度设定值(%):" prop="humiditySetting">
            <el-input v-model="form.humiditySetting"></el-input>
        </el-form-item>

        <el-form-item label="湿度读取值(%):" prop="humidityReadingValue">
            <el-input v-model="form.humidityReadingValue"></el-input>
        </el-form-item>

        <el-form-item label="A相主机输入电流(A):" prop="mainEngineInputCurrentOfA">
            <el-input v-model="form.mainEngineInputCurrentOfA"></el-input>
        </el-form-item>

        <el-form-item label="B相主机输入电流(A):" prop="mainEngineInputCurrentOfB">
            <el-input v-model="form.mainEngineInputCurrentOfB"></el-input>
        </el-form-item>

        <el-form-item label="C相主机输入电流(A):" prop="mainEngineInputCurrentOfC">
            <el-input v-model="form.mainEngineInputCurrentOfC"></el-input>
        </el-form-item>

        <el-form-item label="标识标签(是否损坏):" prop="logoLabel">
            <el-input v-model="form.logoLabel"></el-input>
        </el-form-item>

    </el-form>
</template>

<script>
    /**
     * 精密空调检查表
     */
    import * as validators from '@/roadhog/validators';
    let validatorNumber1 = (rule, value, callback) => { // 温度验证
        let reg = /^[+-]?(((\d|[1-4]\d)(\.\d{1})?)|50|50.0)$/;
        if (!value) {
            callback(new Error('必填项'));
        } else if (!reg.test(value)) {
            callback(new Error('请填写±50.0之内的数字，可保留一位小数点'));
        } else {
            callback();
        }
    };

    let validatorNumber2 = (rule, value, callback) => { // 温度设定验证
        let reg = /^(?![0.]+$)\d+(\.\d{1,5})?$/;
        if (!value) {
            callback(new Error('必填项'));
        } else if (!reg.test(value)) {
            callback(new Error('请填写一个数字'));
        } else {
            callback();
        }
    };

    export default {
        data () {
            return {
                recorder: null,
                form: {
                    id: null,
                    equipmentId: null,
                    temperature: null,
                    temperatureSetting: null,
                    temperatureReadingValue: null,
                    temperatureMeasurementOfAirReturnPort: null,
                    temperatureMeasurementOfAirOutlet: null,
                    humiditySetting: null,
                    humidityReadingValue: null,
                    mainEngineInputCurrentOfA: null,
                    mainEngineInputCurrentOfB: null,
                    mainEngineInputCurrentOfC: null,
                    logoLabel: null,
                },
                rules: {
                    temperature: [{ required: true, validator: validatorNumber1, trigger: 'change' }],
                    temperatureSetting: [{ required: true, validator: validatorNumber2, trigger: 'change' }],
                    temperatureReadingValue: [validators.isNumber()],
                    temperatureMeasurementOfAirOutlet: [validators.isNumber()],
                    temperatureMeasurementOfAirReturnPort: [validators.isNumber()],
                    humiditySetting: [validators.isNumber()],
                    humidityReadingValue: [validators.isNumber()],
                    mainEngineInputCurrentOfA: [validators.isNumber()],
                    mainEngineInputCurrentOfB: [validators.isNumber()],
                    mainEngineInputCurrentOfC: [validators.isNumber()],
                    logoLabel: [validators.required()],
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.airConditionPatrol);
                },
            },
        },
        methods: {
            async collectValues () {
                await this.$refs.form.validate();
                return this.form;
            },
        },
        props: {
            result: {
                type: Object,
            },
        },
    };
</script>
