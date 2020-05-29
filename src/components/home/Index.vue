<template>
    <div style="height: 100%;" v-loading="loading">
        <el-row :gutter="10" id="top">
            <el-col :span="12" id="left">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        待处理任务列表
                    </div>
                    <div class="panel-body">
                        <!-- 下面这个组件要完成-->
                        <task-list :table="pendingDisposal"/>
                    </div>
                </div>
                <div @mousedown="moveLtr" id="aboutLine"></div>
            </el-col>

            <el-col :span="12" id="right">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        新告警列表
                    </div>
                    <div class="panel-body">
                        具体列表
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-divider id="centerDivider"></el-divider>

        <el-row>
            <el-col :span="24">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        最近完成任务列表
                    </div>
                    <div class="panel-body">
                        <!-- 下面这个组件要完成-->
                        <task-list :table="recentlyCompleted"/>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import TaskList from '@/components/home/TaskList';
    import { actionTypes } from '@/store/actionTypes';
    import { Pagination } from '@/roadhog/Pagination';

    export default {
        components: { TaskList },
        data () {
            return {
                loading: true,
                pagination: new Pagination({
                    sortField: 'createTime',
                    sortOrder: 'desc',
                    name: null,
                    code: null,
                }),
                pendingDisposal: [],
                recentlyCompleted: [],
            };
        },
        created () {
            this.load();
        },
        methods: {
            async load () {
                const result = await this.$store.dispatch(`task/${actionTypes.common.list}`, this.pagination.query);
                this.pagination.setResult(result);
                this.loading = false;
                const now = new Date().getTime();
                result.items.map(item => {
                    const time = new Date(item.finishTime).getTime();
                    if (!item.finish) {
                        this.pendingDisposal.push(item);
                    }
                    if (item.finish && now - time <= 604800000) {
                        this.recentlyCompleted.push(item);
                    }
                });
            },
            moveLtr (e) {
                document.onselectstart = function () { return false; };
                let odiv = e.target;

                let disX = e.clientX - odiv.offsetLeft;
                document.onmousemove = (e) => {
                    let left = e.clientX - disX;
                    if (left <= 500) {
                        left = 500;
                    } else if (left >= document.documentElement.clientWidth - 220) {
                        left = document.documentElement.clientWidth - 220;
                    }

                    odiv.style.left = left + 'px';
                    document.getElementById('left').style.width = left + 'px';
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    document.onselectstart = function () { return true; };
                };
            },
        },
    };
</script>

<style scoped>
    #left{
        position: relative;
    }
    #aboutLine{
        position: absolute;
        top: 0;
        bottom: 20px;
        right: 0;
        width: 1px;
        border-left: 5px dashed transparent;
        cursor: col-resize;
    }

</style>
