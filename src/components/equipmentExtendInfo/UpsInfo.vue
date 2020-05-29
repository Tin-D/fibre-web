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
        <el-form-item label="额定功率(KW)" prop="ratedPower">
            <el-input :disabled="detailInfo" placeholder="请填写额定功率(KW)" v-model="form.ratedPower"/>
        </el-form-item>
        <el-form-item label="接口种类" prop="interfaceType">
            <el-input :disabled="detailInfo" placeholder="请填写接口种类" v-model="form.interfaceType"/>
        </el-form-item>
        <el-form-item label="接口数量" prop="numberOfInterfaces">
            <el-input :disabled="detailInfo" placeholder="请填写接口数量" v-model="form.numberOfInterfaces"/>
        </el-form-item>
        <el-form-item label="输入输出类型" prop="IAndOType">
            <el-select :disabled="detailInfo" placeholder="请选择输入输出类型" style="width: 100%;" v-model="form.IAndOType">
                <el-option
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                    v-for="item in IAndOType"/>
            </el-select>
        </el-form-item>
        <el-form-item label="操作记录" prop="operationRecord">
            <el-input :disabled="detailInfo" v-model="form.operationRecord"/>
        </el-form-item>
        <el-form-item label="输入电流(A)" prop="inputCurrentA">
            <el-input :disabled="detailInfo" v-model="form.inputCurrentA"/>
        </el-form-item>
        <el-form-item label="输出电流(A)" prop="outputCurrentA">
            <el-input :disabled="detailInfo" v-model="form.outputCurrentA"/>
        </el-form-item>
        <el-form-item label="输出电压(V)" prop="outputVoltage">
            <el-input :disabled="detailInfo" v-model="form.outputVoltage"/>
        </el-form-item>
        <el-form-item label="负载(W)" prop="load">
            <el-input :disabled="detailInfo" v-model="form.load"/>
        </el-form-item>
        <el-form-item label="负载率(%)" prop="loadRate">
            <el-input :disabled="detailInfo" v-model="form.loadRate"/>
        </el-form-item>
    </el-form>
</template>

<script>
    /**
     * 设备仓库新增编辑UPS扩展信息
     */
    import * as validators from '@/roadhog/validators';

    export default {
        data () {
            return {
                form: {
                    appearanceSize: null,
                    ratedPower: null,
                    interfaceType: null,
                    numberOfInterfaces: null,
                    IAndOType: null,
                    operationRecord: null,
                    inputCurrentA: null,
                    outputCurrentA: null,
                    outputVoltage: null,
                    load: null,
                    loadRate: null,
                },
                rules: {
                    appearanceSize: [validators.required()],
                    ratedPower: [validators.required()],
                    interfaceType: [validators.required()],
                    numberOfInterfaces: [validators.required()],
                    IAndOType: [validators.required({ type: 'number' })],
                    inputCurrentA: [this.floatTwo()],
                    outputCurrentA: [this.floatTwo()],
                    outputVoltage: [this.floatOne()],
                    load: [this.floatOne()],
                    loadRate: [this.floatOne()],
                },
                IAndOType: [
                    {
                        name: '单进单出(11)',
                        id: 11,
                    },
                    {
                        name: '三进单出(31)',
                        id: 31,
                    },
                    {
                        name: '三进三出(33)',
                        id: 33,
                    },
                ],
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
            floatTwo (message = '请填写数字，可保留两位小数点') {
                return {
                    message,
                    pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{2})?$/,
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
