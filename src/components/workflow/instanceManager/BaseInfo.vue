<template>
    <el-form ref="form"
             label-width="80px"
             size="mini"
    >
        <el-form-item label="唯一编号">
            {{ recorder.id }}
        </el-form-item>

        <el-form-item label="流程名称">
            {{ recorder.workflowName }}
        </el-form-item>

        <el-form-item label="实例名称">
            {{ recorder.name }}
        </el-form-item>

        <el-form-item label="状态">
            {{ status }}
        </el-form-item>

        <el-form-item label="发起人">
            {{ recorder.startUserFullName }}
        </el-form-item>

        <el-form-item label="启动时间">
            {{ renderDateTime(recorder.startTime) }}
        </el-form-item>

        <el-form-item label="结束时间">
            {{ renderDateTime(recorder.finishTime) }}
        </el-form-item>

    </el-form>
</template>

<script>
    import { renderWorkflowInstanceStatus } from '@/store/enum';

    export default {
        computed: {
            status () {
                return renderWorkflowInstanceStatus(this.recorder.status);
            },
        },
        props: {
            recorder: {
                type: Object,
                required: true,
            },
        },
    };
</script>
