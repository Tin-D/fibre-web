<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        fullscreen
        :is-loading="false">

        <el-tabs type="border-card" v-model="currentTab">
            <el-tab-pane label="基本信息" name="baseInfo">
                <base-info :detail-info="detail"
                           @type-change="handleTypeChange"
                           ref="baseInfo"
                           :id="id"
                />
            </el-tab-pane>

            <el-tab-pane label="扩展信息" name="extendInfo" v-if="extendEditor">
                <component :is="extendEditor"
                           :recorder="recorder"
                           ref="extendInfo"
                           :detail-info="detail"
                />
            </el-tab-pane>
        </el-tabs>

        <div slot="buttons" v-if="detail"/>

    </lan-form-dialog>
</template>

<script>
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { actionTypes } from '@/store/actionTypes';
    import { models } from '@/store/models';
    import BaseInfo from '@/components/equipment/BaseInfo';
    import UPS from '@/components/equipmentExtendInfo/UpsInfo';
    import Battery from '@/components/equipmentExtendInfo/BatteryInfo';
    import AirCondition from '@/components/equipmentExtendInfo/AirConditionInfo';
    import PowerDistributionCabinet from '@/components/equipmentExtendInfo/PowerDistributionCabinetInfo';
    import BatteryCupboard from '@/components/equipmentExtendInfo/BatteryCupboardInfo';

    const storeModuleName = models.equipment;
    const equipmentTypes = {
        UPS: 'UPS',
        Battery: 'Battery',
        AirCondition: 'AirCondition',
        PowerDistributionCabinet: 'PowerDistributionCabinet',
        BatteryCupboard: 'BatteryCupboard',
    };
    const tabs = ['baseInfo', 'extendInfo'];

    export default {
        mixins: [dialogMixin()],
        components: {
            BaseInfo,
        },
        computed: {
            title () {
                return this.detail ? `设备详情 : ${this.equipmentName}` : `${this.id ? '修改' : '新增'} : 设备`;
            },
        },
        data () {
            return {
                currentTab: 'baseInfo',
                partTitle: '设备',
                extendEditor: null,
                recorder: null,
            };
        },
        methods: {
            handleTypeChange (equipmentType, recorder) {
                this.recorder = recorder;
                this.extendEditor = null;
                switch (equipmentType) {
                    case equipmentTypes.UPS:
                        this.extendEditor = UPS;
                        break;
                    case equipmentTypes.Battery:
                        this.extendEditor = Battery;
                        break;
                    case equipmentTypes.AirCondition:
                        this.extendEditor = AirCondition;
                        break;
                    case equipmentTypes.PowerDistributionCabinet:
                        this.extendEditor = PowerDistributionCabinet;
                        break;
                    case equipmentTypes.BatteryCupboard:
                        this.extendEditor = BatteryCupboard;
                        break;
                }
            },
            async handleSubmit () {
                let flag = true;
                const values = {};

                for (let t of tabs) {
                    const tab = this.$refs[t];
                    try {
                        const tabValues = await tab.collectValues();
                        if (t === 'extendInfo') {
                            values.configs = JSON.stringify(tabValues);
                        } else {
                            const startDate = JSON.stringify(tabValues.startDate);
                            const stopUsingTime = JSON.stringify(tabValues.stopUsingTime);

                            Object.assign(values, tabValues);
                            values.startDate = startDate;
                            values.stopUsingTime = stopUsingTime;
                        }
                    } catch {
                        this.currentTab = t;
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    if (this.id) {
                        await this.$store.dispatch(`${storeModuleName}/${actionTypes.common.edit}`, { id: this.id, data: values });
                    } else {
                        await this.$store.dispatch(`${storeModuleName}/${actionTypes.common.add}`, values);
                    }
                    this.closeDialog({ refresh: true });
                }
            },
        },
        props: {
            id: {
                type: String,
            },
            detail: {
                type: Boolean,
                default: false,
            },
            equipmentName: {
                type: String,
            },
        },
    };
</script>
