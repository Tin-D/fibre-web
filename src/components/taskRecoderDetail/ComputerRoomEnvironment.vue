<template>
    <el-form :model="form"
             label-width="150px"
             ref="form"
             size="mini"
    >
        <el-form-item label="告警声:" prop="alarmSound">
            <el-input  disabled v-model="form.alarmSound"></el-input>
        </el-form-item>

        <el-form-item label="异味:" prop="peculiarSmell">
            <el-input  disabled v-model="form.peculiarSmell"></el-input>
        </el-form-item>

        <el-form-item label="异响:" prop="abnormalSound">
            <el-input  disabled v-model="form.abnormalSound"></el-input>
        </el-form-item>

        <el-form-item label="漏水:" prop="makeWater">
            <el-input  disabled v-model="form.makeWater"></el-input>
        </el-form-item>

        <el-form-item label="老鼠:" prop="mouse">
            <el-input  disabled v-model="form.mouse"></el-input>
        </el-form-item>

        <el-form-item label="照明:" prop="illumination">
            <el-input  disabled v-model="form.illumination"></el-input>
        </el-form-item>

        <el-form-item label="温度(℃):" prop="temperature">
            <el-input disabled v-model="form.temperature"></el-input>
        </el-form-item>

        <el-form-item label="湿度(%):" prop="humidity">
            <el-input disabled v-model="form.humidity"></el-input>
        </el-form-item>

        <el-form-item label="杂物及易燃易爆物:" prop="sundryAndInflammableExplosive">
            <el-input  disabled v-model="form.sundryAndInflammableExplosive"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 机房环境检查表
     */
    export default {
        data () {
            return {
                recorder: null,
                form: {
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
            };
        },
        watch: {
            result: {
                handler (newVal) {
                    Object.assign(this.form, newVal.computerRoomEnvironment);
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
