<template>
    <el-form :model="form"
             :rules="rules"
             label-width="150px"
             ref="form"
             size="mini"
    >
        <el-form-item label="告警声:" prop="alarmSound">
            <el-input  v-model="form.alarmSound"></el-input>
        </el-form-item>

        <el-form-item label="异味:" prop="peculiarSmell">
            <el-input  v-model="form.peculiarSmell"></el-input>
        </el-form-item>

        <el-form-item label="异响:" prop="abnormalSound">
            <el-input  v-model="form.abnormalSound"></el-input>
        </el-form-item>

        <el-form-item label="漏水:" prop="makeWater">
            <el-input  v-model="form.makeWater"></el-input>
        </el-form-item>

        <el-form-item label="老鼠:" prop="mouse">
            <el-input  v-model="form.mouse"></el-input>
        </el-form-item>

        <el-form-item label="照明:" prop="illumination">
            <el-input  v-model="form.illumination"></el-input>
        </el-form-item>

        <el-form-item label="温度(℃):" prop="temperature">
            <el-input v-model="form.temperature"></el-input>
        </el-form-item>

        <el-form-item label="湿度(%):" prop="humidity">
            <el-input v-model="form.humidity"></el-input>
        </el-form-item>

        <el-form-item label="杂物及易燃易爆物:" prop="sundryAndInflammableExplosive">
            <el-input  v-model="form.sundryAndInflammableExplosive"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 机房环境检查表
     */
    let temperatureRules = (rule, value, callback) => { // 温度验证
        let reg = /^[+-]?(((\d|[1-4]\d)(\.\d{1})?)|50|50.0)$/;
        if (!value) {
            callback(new Error('必填项'));
        } else if (!reg.test(value)) {
            callback(new Error('请填写±50.0之内的数字，可保留一位小数点'));
        } else {
            callback();
        }
    };

    let humidityRiles = (rule, value, callback) => { // 湿度验证
        let reg = /^(((\d|[1-9]\d)(\.\d{1})?)|100|100.0)$/;
        if (!value) {
            callback(new Error('必填项'));
        } else if (!reg.test(value)) {
            callback(new Error('请填写100以内的数字，可保留一位小数点'));
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
                    humidity: null,
                    alarmSound: null,
                    peculiarSmell: null,
                    abnormalSound: null,
                    makeWater: null,
                    mouse: null,
                    sundryAndInflammableExplosive: null,
                    illumination: null,
                },
                rules: {
                    temperature: [{ required: true, validator: temperatureRules, trigger: 'change' }],
                    humidity: [{ required: true, validator: humidityRiles, trigger: 'change' }],
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.computerRoomEnvironment);
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
