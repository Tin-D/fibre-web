<template>
    <lan-dialog :title="value.name"
                @close="handleClose"
                width="35%"
    >
        <el-form :model="form" label-width="80px" ref="form">
            <el-form-item label="任务名称:">
                <div>{{value.name}}</div>
            </el-form-item>
            <el-form-item label="任务编号:">
                <div>{{value.code}}</div>
            </el-form-item>
            <el-form-item :formatter="renderDateTimeRow" label="创建时间:">
                <div>{{value.createTime | dateTime}}</div>
            </el-form-item>
            <el-form-item label="创建人:">
                <label slot="label" style="white-space: pre">创  建  人:</label>
                <div>{{value.createUserFullName}}</div>
            </el-form-item>
            <el-form-item label="任务状态:">
                <div>{{value.finish ? "已完成" : "未完成"}}</div>
            </el-form-item>
            <el-form-item label="任务类别:">
                <div>{{value.taskType === "Maintenance" ? "运维任务" : "处障任务"}}</div>
            </el-form-item>
        </el-form>

        <div class="dialog-footer" slot="footer" v-if="show">
            <el-button @click="process(value)" type="primary">办 理</el-button>
        </div>
    </lan-dialog>
</template>

<script>
    import dayjs from 'dayjs';

    export default {
        name: 'detail.vue',
        filters: {
            dateTime (value) {
                if (!value) {
                    return value;
                }
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
            },
        },
        data () {
            return {
                show: true,
                form: {},
            };
        },
        created () {
            const now = new Date().getTime();
            this.table.map(item => {
                const time = new Date(item.finishTime).getTime();
                if (item.finish && now - time <= 604800000) {
                    this.show = false;
                }
            });
        },
        methods: {
            handleClose () {
                this.$emit('close');
            },
            process (value) {
                this.$router.push({ name: 'task_process', params: { id: value.code } });
            },
        },
        props: {
            value: {
                type: Object,
            },
            table: {
                type: Array,
            },
        },
    };
</script>
