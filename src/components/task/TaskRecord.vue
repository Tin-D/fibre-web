<template>
    <lan-dialog @close="handleClose"
                title="任务记录"
                width="50"
    >
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane :key="item.id"
                         :label="item.name"
                         :name="item.name"
                         v-for="item in info.patrolExcelTemplates">

                <AirConditionPatrol  :result="result" v-if="item.name.includes('精密空调检查表')"/>
                <ComputerRoomEnvironment  :result="result" v-if="item.name.includes('机房环境检查表')"/>

            </el-tab-pane>
        </el-tabs>
        <div slot="footer">
            <slot name="footer">
                <el-button @click="handleClose" type="primary">关闭</el-button>
            </slot>
        </div>
    </lan-dialog>
</template>

<script>
    import axios from 'axios';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import AirConditionPatrol from '@/components/taskRecoderDetail/AirConditionPatrol';
    import ComputerRoomEnvironment from '@/components/taskRecoderDetail/ComputerRoomEnvironment';

    export default {
        mixins: [dialogMixin()],
        components: {
            AirConditionPatrol,
            ComputerRoomEnvironment,
        },
        data () {
            return {
                result: null,
                activeName: this.info.patrolExcelTemplates[0].name,
            };
        },
        async created () {
            const { data } = await axios.get(`/task/find_patrol_excel_by_task_details_id/${this.taskId}/${this.info.id}/${this.info.computerRoomId}`);
            this.result = data;
        },
        props: {
            taskId: {
                type: String,
            },
            info: {
                type: Object,
            },
        },
    };
</script>
