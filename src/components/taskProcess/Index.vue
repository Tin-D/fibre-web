<template>
    <div>
        <el-input @keyup.enter.native="search"
                  class="myClass"
                  clearable
                  placeholder="请输入任务编号"
                  v-if="searchInput"
                  v-model.trim="code">
            <el-button @click="search"
                       @keyup.enter.native="search"
                       icon="el-icon-search"
                       slot="append"
                       type="primary">查询
            </el-button>
        </el-input>

        <task-process-detail :task-data="taskData"
                             @hide="reHide"
                             @show="reShow"
                             v-if="taskDetail"/>
    </div>
</template>

<script>
    import axios from 'axios';
    import TaskProcessDetail from '@/components/taskProcess/TaskProcessDetail';

    export default {
        components: {
            TaskProcessDetail,
        },
        data () {
            return {
                code: '',
                searchInput: true,
                taskDetail: false,
                taskData: null,
            };
        },
        created () {
            if (this.$route.params.id) {
                this.code = this.$route.params.id;
                this.search();
            }
        },
        mounted () {

        },
        methods: {
            async search () {
                if (this.code) {
                    const res = await axios.get(`task/findTaskDetailsByCode/${this.code}`);
                    this.taskData = res.data;
                    this.searchInput = false;
                    this.taskDetail = true;
                } else {
                    let doms = document.getElementsByClassName('el-message')[0];
                    if (doms === undefined) {
                        this.$message.warning({
                            showClose: true,
                            message: '请先输入任务编号进行查询',
                        });
                    }
                }
            },
            reShow (value) {
                this.searchInput = value;
                if (value) {
                    this.taskDetail = false;
                }
            },
            reHide (value) {
                this.taskDetail = value;
            },
        },
    };
</script>

<style>
    .myClass{
        position: absolute;
        top: 40%;
        right: 20%;
        width: 50%;
        font-size: 18px;
    }
    .myClass .el-input__inner{
        height: 50px;
        margin-right: 0;
        border: 2px solid #DCDFE6;
    }
    .myClass .el-input-group__append{
        width: 80px;
        background: #409EFF;
        color: #fff;
        text-align: center;
    }
</style>
