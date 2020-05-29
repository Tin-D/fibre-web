<template>
    <el-form :model="form"
             :rules="rules"
             label-width="200px"
             ref="form"
             size="mini">

        <el-divider content-position="right">机房环境</el-divider>

        <el-form-item label="告警声：" prop="alarmSound">
            <el-radio-group v-model="form.alarmSound">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写告警声故障现象" style="width: 50%;margin-left: 60px;" v-if="form.alarmSound" v-model="form.descriptionOfAlarmSound"></el-input>
        </el-form-item>

        <el-form-item label="异味：" prop="peculiarSmell">
            <el-radio-group v-model="form.peculiarSmell">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写异味异常现象" style="width: 50%;margin-left: 60px;" v-if="form.peculiarSmell" v-model="form.descriptionOfPeculiarSmell"></el-input>
        </el-form-item>

        <el-form-item label="异响：" prop="abnormalSound">
            <el-radio-group v-model="form.abnormalSound">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写异响故障现象" style="width: 50%;margin-left: 60px;" v-if="form.abnormalSound" v-model="form.descriptionOfAbnormalSound"></el-input>
        </el-form-item>

        <el-form-item label="漏水：" prop="makeWater">
            <el-radio-group v-model="form.makeWater">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写漏水故障现象" style="width: 50%;margin-left: 60px;" v-if="form.makeWater" v-model="form.descriptionOfMakeWater"></el-input>
        </el-form-item>

        <el-form-item label="老鼠：" prop="mouse">
            <el-radio-group v-model="form.mouse">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写老鼠异常现象" style="width: 50%;margin-left: 60px;" v-if="form.mouse" v-model="form.descriptionOfMouse"></el-input>
        </el-form-item>

        <el-form-item label="照明：" prop="illumination">
            <el-radio-group v-model="form.illumination">
                <el-radio :label="true">正常</el-radio>
                <el-radio :label="false">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写照明异常现象" style="width: 50%;margin-left: 60px;" v-if="form.illumination != null && !form.illumination" v-model="form.descriptionOfIllumination"></el-input>
        </el-form-item>

        <el-form-item label="杂物及易燃易爆物：" prop="sundryAndInflammableExplosive">
            <el-radio-group v-model="form.sundryAndInflammableExplosive">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">异常</el-radio>
            </el-radio-group>
            <el-input placeholder="请填写杂物及易燃易爆物故障现象" style="width: 50%;margin-left: 60px;" v-if="form.sundryAndInflammableExplosive" v-model="form.descriptionOfSundryAndInflammableExplosive"></el-input>
        </el-form-item>

        <el-divider content-position="right">运行数据</el-divider>

        <el-form-item label="标识标签（是否损坏）：" prop="abnormalSound">
            <el-radio-group v-model="form.logoLabel">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="温度：" prop="temperature">
            <el-input v-model="form.temperature"></el-input>
        </el-form-item>

        <el-form-item label="湿度：" prop="humidity">
            <el-input v-model="form.humidity"></el-input>
        </el-form-item>

        <el-form-item label="温度设定值：" prop="temperatureSetting">
            <el-input v-model="form.temperatureSetting"></el-input>
        </el-form-item>

        <el-form-item label="温度读取值：" prop="temperatureReadingValue">
            <el-input v-model="form.temperatureReadingValue"></el-input>
        </el-form-item>

        <el-form-item label="温度实测值(回风口):" prop="temperatureMeasurementOfAirReturnPort">
            <el-input v-model="form.temperatureMeasurementOfAirReturnPort"></el-input>
        </el-form-item>

        <el-form-item label="温度实测值(出风口):" prop="temperatureMeasurementOfAirOutlet">
            <el-input v-model="form.temperatureMeasurementOfAirOutlet"></el-input>
        </el-form-item>

        <el-form-item label="湿度设定值：" prop="humiditySetting">
            <el-input v-model="form.humiditySetting"></el-input>
        </el-form-item>

        <el-form-item label="湿度读取值：" prop="humidityReadingValue">
            <el-input v-model="form.humidityReadingValue"></el-input>
        </el-form-item>

        <el-form-item label="A相主机输入电流：" prop="mainEngineInputCurrentOfA">
            <el-input v-model="form.mainEngineInputCurrentOfA"></el-input>
        </el-form-item>

        <el-form-item label="A相运行状态：" prop="runningStatusOfA">
            <el-input v-model="form.runningStatusOfA"></el-input>
        </el-form-item>

        <el-form-item label="B相主机输入电流：" prop="mainEngineInputCurrentOfB">
            <el-input v-model="form.mainEngineInputCurrentOfB"></el-input>
        </el-form-item>

        <el-form-item label="B相运行状态：" prop="runningStatusOfB">
            <el-input v-model="form.runningStatusOfB"></el-input>
        </el-form-item>

        <el-form-item label="C相主机输入电流：" prop="mainEngineInputCurrentOfC">
            <el-input v-model="form.mainEngineInputCurrentOfC"></el-input>
        </el-form-item>

        <el-form-item label="C相运行状态：" prop="runningStatusOfC">
            <el-input v-model="form.runningStatusOfC"></el-input>
        </el-form-item>

    </el-form>
</template>

<script>
    /**
     * 制冷系统巡检登记表
     */
    import * as validators from '@/roadhog/validators';

    export default {
        data () {
            return {
                recorder: null,
                form: {
                    id: null,
                    equipmentId: null,
                    taskDetailsId: null,
                    alarmSound: null,
                    descriptionOfAlarmSound: null,
                    peculiarSmell: null,
                    descriptionOfPeculiarSmell: null,
                    abnormalSound: null,
                    descriptionOfAbnormalSound: null,
                    makeWater: null,
                    descriptionOfMakeWater: null,
                    mouse: null,
                    descriptionOfMouse: null,
                    sundryAndInflammableExplosive: null,
                    descriptionOfSundryAndInflammableExplosive: null,
                    illumination: null,
                    descriptionOfIllumination: null,
                    temperature: null,
                    humidity: null,
                    temperatureSetting: null,
                    temperatureReadingValue: null,
                    temperatureMeasurementOfAirReturnPort: null,
                    temperatureMeasurementOfAirOutlet: null,
                    humiditySetting: null,
                    humidityReadingValue: null,
                    mainEngineInputCurrentOfA: null,
                    runningStatusOfA: null,
                    mainEngineInputCurrentOfB: null,
                    runningStatusOfB: null,
                    mainEngineInputCurrentOfC: null,
                    runningStatusOfC: null,
                    logoLabel: null,
                },
                rules: {
                    temperature: [validators.required(), this.temperatureRules()],
                    humidity: [validators.required(), this.humidityRiles()],
                    alarmSound: [this.radioRules()],
                    peculiarSmell: [this.radioRules()],
                    abnormalSound: [this.radioRules()],
                    makeWater: [this.radioRules()],
                    mouse: [this.radioRules()],
                    sundryAndInflammableExplosive: [this.radioRules()],
                    illumination: [this.radioRules()],
                    logoLabel: [this.radioRules()],
                },
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.refrigerationSystemLog);
                },
            },
        },
        methods: {
            async collectValues () {
                await this.$refs.form.validate();
                return this.form;
            },
            radioRules () {
                return { required: true, message: '必选项', trigger: 'change' };
            },
            temperatureRules (message = '请填写±50.0之内的数字，可保留一位小数点') {
                return {
                    message,
                    pattern: /^[+-]?(((\d|[1-4]\d)(\.\d{1})?)|50|50.0)$/,
                };
            },
            humidityRiles (message = '请填写100以内的数字，可保留一位小数点') {
                return {
                    message,
                    pattern: /^(((\d|[1-9]\d)(\.\d{1})?)|100|100.0)$/,
                };
            },
        },
        props: {
            result: {
                type: Object,
            },
        },
    };
</script>
