<template>
    <el-form :model="form"
             :rules="rules"
             label-width="120px"
             ref="form"
             size="mini">

        <el-form-item label="型号" prop="brandModelId">
            <brand-model-selector :disabled="recorder && recorder.id !== null" show-all-levels v-model="form.brandModelId"/>
        </el-form-item>

        <el-form-item label="机房" prop="computerRoomId">
            <computer-room-selector :readonly="detailInfo" show-all-levels v-model="form.computerRoomId"/>
        </el-form-item>

        <el-form-item label="名称" prop="name">
            <el-input :disabled="detailInfo" label="名称" placeholder="请填写名称" v-model="form.name">
                <el-button @click="autoGenerate" slot="append" style="background: #409EFF;color: #FFF;" v-if="!recorder">自动生成</el-button>
            </el-input>
        </el-form-item>

        <el-form-item label="序列号" prop="serialNumber">
            <el-input :disabled="detailInfo" label="序列号" placeholder="序列号" v-model="form.serialNumber"/>
        </el-form-item>

        <el-form-item label="取得价值(元)" prop="value">
            <el-input :disabled="detailInfo" label="取得价值(元)" placeholder="请填写取得价值(元)" v-model="form.value"/>
        </el-form-item>

        <el-form-item label="设备状态" prop="state">
            <state-selector :readonly="detailInfo" style="width: 100%;" v-model="form.state"/>
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime" v-if="recorder && recorder.id !== null">
            <el-date-picker :disabled="recorder && recorder.id !== null"
                            placeholder="选择日期"
                            style="width: 100%;"
                            type="date"
                            v-model="form.createTime"
            />
        </el-form-item>

        <el-form-item label="生产日期" prop="manufactureDate">
            <el-date-picker placeholder="生产日期"
                            style="width: 100%;"
                            type="date"
                            v-model="form.manufactureDate"
                            :disabled="detailInfo"
            />
        </el-form-item>

        <el-form-item label="安装日期" prop="installDate">
            <el-date-picker placeholder="安装日期"
                            style="width: 100%;"
                            type="date"
                            v-model="form.installDate"
                            :disabled="detailInfo"
            />
        </el-form-item>

        <el-form-item label="收货日期" prop="deliveryDate">
            <el-date-picker placeholder="收货日期"
                            style="width: 100%;"
                            type="date"
                            v-model="form.deliveryDate"
                            :disabled="detailInfo"
            />
        </el-form-item>

        <el-form-item label="启用日期" prop="startDate">
            <el-date-picker placeholder="启用日期"
                            style="width: 100%;"
                            type="dates"
                            v-model="form.startDate"
                            :disabled="detailInfo"
            />
        </el-form-item>

        <el-form-item label="停用日期" prop="stopUsingTime">
            <el-date-picker placeholder="停用日期"
                            style="width: 100%;"
                            type="dates"
                            v-model="form.stopUsingTime"
                            :disabled="detailInfo"
            />
        </el-form-item>

        <el-form-item label="报废日期" prop="scrapTime">
            <el-date-picker placeholder="报废日期"
                            style="width: 100%;"
                            type="date"
                            v-model="form.scrapTime"
                            :disabled="detailInfo"
            />
        </el-form-item>

    </el-form>
</template>

<script>
    /**
     * 设备仓库新增编辑基本信息
     */
    import axios from 'axios';
    import { models } from '@/store/models';
    import * as validators from '@/roadhog/validators';
    import ComputerRoomSelector from '@/components/computerRoom/ComputerRoomSelector';
    import BrandModelSelector from '@/components/brandModel/BrandModelSelector';
    import StateSelector from '@/components/equipment/StateSelector';
    import { getterTypes } from '@/store/getterTypes';
    import { alertError } from '@/roadhog/alert';
    const tabs = ['baseInfo', 'extendInfo'];
    const storeModuleName = models.equipment;

    export default {
        components: {
            ComputerRoomSelector,
            BrandModelSelector,
            StateSelector,
        },
        data () {
            return {
                currentTab: tabs[0],
                equipmentTypeCode: null,
                recorder: null,
                form: {
                    name: null,
                    brandModelId: null,
                    computerRoomId: null,
                    serialNumber: null,
                    value: null,
                    createTime: null,
                    manufactureDate: null,
                    installDate: null,
                    startDate: null,
                    deliveryDate: null,
                    stopUsingTime: null,
                    scrapTime: null,
                    state: null,
                    typeId: null,
                },
                rules: {
                    name: [validators.required()],
                    brandModelId: [validators.required()],
                    computerRoomId: [validators.required()],
                    value: [validators.required(), validators.isNumber()],
                    serialNumber: [validators.required()],
                },
            };
        },
        watch: {
            'form.brandModelId': {
                handler (newValue) {
                    if (newValue) {
                        const result = this.$store.getters[`brandModel/${getterTypes.common.getById}`](newValue);
                        this.form.typeId = result.equipmentTypeId;
                    }
                },
                immediate: true,
            },
            'form.typeId': {
                handler (newValue) {
                    this.equipmentTypeCode = this.getDictionaryCode(newValue).code;
                    this.$emit('type-change', newValue ? this.equipmentTypeCode : newValue, this.recorder);
                },
            },
            immediate: true,
        },
        async created () {
            if (this.detailInfo) {
                const { data } = await axios.get(`equipment/${this.id}`);
                this.recorder = data;

                Object.assign(this.form, this.recorder);
                this.form.startDate = JSON.parse(this.recorder.startDate);
                this.form.stopUsingTime = JSON.parse(this.recorder.stopUsingTime);
            } else {
                if (this.id) {
                    this.recorder = this.$store.state[storeModuleName].equipments.find(n => n.id === this.id);

                    Object.assign(this.form, this.recorder);
                    this.form.startDate = JSON.parse(this.recorder.startDate);
                    this.form.stopUsingTime = JSON.parse(this.recorder.stopUsingTime);
                }
            }
        },
        methods: {
            async collectValues () {
                await this.$refs.form.validate();
                return this.form;
            },
            async autoGenerate () {
                if (!this.form.brandModelId) {
                    alertError('请选择型号');
                } else if (!this.form.computerRoomId) {
                    alertError('请选择机房');
                } else {
                    const { data } = await axios.get(`equipment/the_number_of_find_by_computer_room_id_and_type_id/${this.form.computerRoomId}/${this.form.typeId}`);
                    this.form.name = data;
                }
            },
        },
        props: {
            id: {
                type: String,
            },
            detailInfo: {
                type: Boolean,
            },
        },
    };
</script>
