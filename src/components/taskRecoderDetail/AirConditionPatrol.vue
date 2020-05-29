<template>
    <el-form :model="form"
             label-width="200px"
             ref="form"
             size="mini">
        <el-form-item label="温度(℃):" prop="temperatureSetting">
            <el-input disabled v-model="form.temperature"></el-input>
        </el-form-item>

        <el-form-item label="温度设定值(℃):" prop="temperatureSetting">
            <el-input disabled v-model="form.temperatureSetting"></el-input>
        </el-form-item>

        <el-form-item label="温度读取值℃:" prop="temperatureReadingValue">
            <el-input disabled v-model="form.temperatureReadingValue"></el-input>
        </el-form-item>

        <el-form-item label="温度实测值℃(回风口):" prop="temperatureMeasurementOfAirReturnPort">
            <el-input disabled v-model="form.temperatureMeasurementOfAirReturnPort"></el-input>
        </el-form-item>

        <el-form-item label="温度实测值℃(出风口):" prop="temperatureMeasurementOfAirOutlet">
            <el-input disabled v-model="form.temperatureMeasurementOfAirOutlet"></el-input>
        </el-form-item>

        <el-form-item label="湿度设定值(%):" prop="humiditySetting">
            <el-input disabled v-model="form.humiditySetting"></el-input>
        </el-form-item>

        <el-form-item label="湿度读取值(%):" prop="humidityReadingValue">
            <el-input disabled v-model="form.humidityReadingValue"></el-input>
        </el-form-item>

        <el-form-item label="A相主机输入电流(A):" prop="mainEngineInputCurrentOfA">
            <el-input disabled v-model="form.mainEngineInputCurrentOfA"></el-input>
        </el-form-item>

        <!--        <el-form-item label="A相运行状态:" prop="runningStatusOfA">-->
        <!--            <el-input v-model="form.runningStatusOfA"></el-input>-->
        <!--        </el-form-item>-->

        <el-form-item label="B相主机输入电流(A):" prop="mainEngineInputCurrentOfB">
            <el-input disabled v-model="form.mainEngineInputCurrentOfB"></el-input>
        </el-form-item>

        <!--        <el-form-item label="B相运行状态:" prop="runningStatusOfB">-->
        <!--            <el-input v-model="form.runningStatusOfB"></el-input>-->
        <!--        </el-form-item>-->

        <el-form-item label="C相主机输入电流(A):" prop="mainEngineInputCurrentOfC">
            <el-input disabled v-model="form.mainEngineInputCurrentOfC"></el-input>
        </el-form-item>

        <!--        <el-form-item label="C相运行状态:" prop="runningStatusOfC">-->
        <!--            <el-input v-model="form.runningStatusOfC"></el-input>-->
        <!--        </el-form-item>-->

        <el-form-item label="标识标签(是否损坏):" prop="logoLabel">
            <el-input disabled v-model="form.logoLabel"></el-input>
            <!--            <el-radio-group v-model="form.logoLabel">-->
            <!--                <el-radio label="true">是</el-radio>-->
            <!--                <el-radio label="false">否</el-radio>-->
            <!--            </el-radio-group>-->
        </el-form-item>

    </el-form>
</template>

<script>
    /**
     * 精密空调检查表
     */
    export default {
        data () {
            return {
                recorder: null,
                form: {
                    equipmentId: null,
                    temperature: null,
                    temperatureSetting: null,
                    temperatureReadingValue: null,
                    temperatureMeasurementOfAirReturnPort: null,
                    temperatureMeasurementOfAirOutlet: null,
                    humiditySetting: null,
                    humidityReadingValue: null,
                    mainEngineInputCurrentOfA: null,
                    // runningStatusOfA: null,
                    mainEngineInputCurrentOfB: null,
                    // runningStatusOfB: null,
                    mainEngineInputCurrentOfC: null,
                    // runningStatusOfC: null,
                    logoLabel: null,
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
        props: {
            result: {
                type: Object,
            },
        },
    };
</script>
