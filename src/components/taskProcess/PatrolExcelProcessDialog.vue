<template>
    <lan-form-dialog
        :is-loading="false"
        @close="handleClose"
        @submit="handleSubmit"
        fullscreen
        ref="lanDialog"
        title="巡检表格录入"
    >
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane :key="item.id"
                         :name="item.ref"
                         v-for="item in patrolExcelTemplates">

                <span slot="label">
                    {{ item.name.replace(/[^\u4e00-\u9fa5]/gi,"") }}
                </span>

                <power-system-form :result="result" ref="powerSystem" v-if="item.name.includes('电源系统')"/>
                <key-points-temperature-form :result="result" ref="keyPointsTemperature" v-if="item.name.includes('关键点温度')"/>
                <device-properties-form :result="result" ref="deviceProperties" v-if="item.name.includes('设备属性')"/>
                <fire-fighting-system-form :result="result" ref="fireFightingSystem" v-if="item.name.includes('消防系统')"/>
                <inspection-report-form :result="result" ref="inspectionReport" v-if="item.name.includes('巡检报告')"/>
                <refrigeration-system-form :result="result" ref="refrigerationSystem" v-if="item.name.includes('制冷系统')"/>

                <computer-room-environment-form :result="result" ref="computerRoomEnvironment" v-if="item.name.includes('机房环境检查表')"/>
                <air-condition-patrol-form :result="result" ref="airConditionPatrol" v-if="item.name.includes('精密空调检查表')"/>

            </el-tab-pane>
        </el-tabs>
    </lan-form-dialog>
</template>

<script>
    import axios from 'axios';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import RefrigerationSystemForm from '@/components/patrolExcelFrom/RefrigerationSystemForm';
    import KeyPointsTemperatureForm from '@/components/patrolExcelFrom/KeyPointsTemperatureForm';
    import PowerSystemForm from '@/components/patrolExcelFrom/PowerSystemForm';
    import InspectionReportForm from '@/components/patrolExcelFrom/InspectionReportForm';
    import DevicePropertiesForm from '@/components/patrolExcelFrom/DevicePropertiesForm';
    import FireFightingSystemForm from '@/components/patrolExcelFrom/FireFightingSystemForm';
    import ComputerRoomEnvironmentForm from '@/components/patrolExcelFrom/ComputerRoomEnvironmentForm';
    import AirConditionPatrolForm from '@/components/patrolExcelFrom/AirConditionPatrolForm';

    const tabs = [
        'powerSystem',
        'keyPointsTemperature',
        'deviceProperties',
        'fireFightingSystem',
        'inspectionReport',
        'refrigerationSystem',
        'computerRoomEnvironment',
        'airConditionPatrol',
    ];

    export default {
        mixins: [dialogMixin()],
        components: {
            RefrigerationSystemForm,
            KeyPointsTemperatureForm,
            PowerSystemForm,
            InspectionReportForm,
            DevicePropertiesForm,
            FireFightingSystemForm,
            ComputerRoomEnvironmentForm,
            AirConditionPatrolForm,
        },
        data () {
            return {
                activeName: this.patrolExcelTemplates[0].ref,
                result: null,
            };
        },
        async created () {
            const { data } = await axios.get(`/task/find_patrol_excel_by_task_details_id/${this.taskId}/${this.taskDetailsId}/${this.computerRoomId}`);
            this.result = data;
        },
        methods: {
            async returnValue (tab, result, values, name) {
                if (_.isEqual(await tab.collectValues(), result)) { // 判断是新增还是修改
                    values[name] = {}; // 数据相同则无需修改，传{ }

                    return values;
                } else {
                    const data = await tab.collectValues();

                    if (!data.id) {
                        values[name] = await tab.collectValues();
                        const a = [];
                        for (let key in values[name]) {
                            if (values[name][key]) {
                                a.push(values[name][key]);
                            }
                        }
                        if (a.length === 0) { // 判断是否所有属性都为空 若都为空则将传{ }
                            values[name] = {};

                            return values;
                        } else {
                            values[name] = await tab.collectValues(); // 新增

                            values[name].equipmentId = this.equipmentId;
                            values[name].taskDetailsId = this.taskDetailsId;

                            return values;
                        }
                    } else {
                        values[name] = await tab.collectValues(); // 修改

                        return values;
                    }
                }
            },
            async handleSubmit () {
                let flag = true;
                const values = {};

                for (let t of tabs) {
                    const tab = this.$refs[t];

                    if (tab !== undefined) {
                        try {
                            switch (t) {
                                case 'powerSystem':
                                    await this.returnValue(tab[0], this.result.powerSystemLog, values, 'powerSystemLog');
                                    break;
                                case 'keyPointsTemperature':
                                    await this.returnValue(tab[0], this.result.keyPointsTemperatureLog, values, 'keyPointsTemperatureLog');
                                    break;
                                case 'deviceProperties':
                                    await this.returnValue(tab[0], this.result.devicePropertiesLog, values, 'devicePropertiesLog');
                                    break;
                                case 'fireFightingSystem':
                                    await this.returnValue(tab[0], this.result.fireFightingSystemLog, values, 'fireFightingSystemLog');
                                    break;
                                case 'inspectionReport':
                                    await this.returnValue(tab[0], this.result.inspectionReportLog, values, 'inspectionReportLog');
                                    break;
                                case 'refrigerationSystem':
                                    await this.returnValue(tab[0], this.result.refrigerationSystemLog, values, 'refrigerationSystemLog');
                                    break;
                                case 'computerRoomEnvironment':
                                    await this.returnValue(tab[0], this.result.computerRoomEnvironment, values, 'computerRoomEnvironment');
                                    values.computerRoomEnvironment.taskId = this.taskId;
                                    values.computerRoomEnvironment.computerRoomId = this.computerRoomId;
                                    break;
                                case 'airConditionPatrol':
                                    await this.returnValue(tab[0], this.result.airConditionPatrol, values, 'airConditionPatrol');
                                    break;
                            }
                        } catch {
                            this.activeName = t;
                            flag = false;
                            break;
                        }
                    }
                }

                if (flag) {
                    const res = await axios.post('/task/insertPatrolExcel', values);
                    if (res.status === 200) {
                        this.closeDialog(true);
                        this.$message.success('提交成功');
                    } else {
                        this.$message.error('提交失败，请重新提交');
                    }
                }
            },
        },
        props: {
            patrolExcelTemplates: {
                type: Array,
                default () {
                    return [];
                },
            },
            taskId: {
                type: String,
            },
            taskDetailsId: {
                type: String,
            },
            computerRoomId: {
                type: String,
            },
            equipmentId: {
                type: String,
            },
        },
    };
</script>
