<template>
    <div style="display: inline-block;">
        <el-button size="mini"
                   :type="type"
                   @click="show = true"
        >
            {{ text }}
        </el-button>

        <el-dialog title="流程跟踪"
                   :visible.sync="show"
                   append-to-body
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
        >
            <log-list :data="data" :max-height="500"/>
        </el-dialog>
    </div>
</template>

<script>
    import LogList from '@/components/workflow/workflowDesign/LogList';

    export default {
        components: { LogList },
        data () {
            return {
                show: false,
            };
        },
        props: {
            type: {
                type: String,
                default: 'default',
            },
            text: {
                type: String,
                default: '流程跟踪',
            },
            data: {
                type: Object,
                required: true,
            },
        },
    };
</script>
