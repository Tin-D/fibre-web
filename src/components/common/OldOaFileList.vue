<template>
    <div>
        <el-form inline class="toolbar" size="mini" style="border-bottom: 1px #ddd solid;">
            <el-form-item class="modTitle fjlist" style="width: 100%;">
                <span>
                    附件列表
                </span>
            </el-form-item>
        </el-form>

        <el-table :data="files"
                  width="100%"
                  highlight-current-row
                  stripe
                  border
                  size="mini"
                  empty-text="没有附件"
                  class="intable tablebordereee"
        >
            <el-table-column label="名称" prop="name" sortable/>

            <el-table-column label="大小(kb)" prop="contentLength" sortable>
                <template slot-scope="{ row }">
                    {{ row.contentLength ? (row.contentLength / 1024).toFixed(2) : null }}
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-download"
                               @click="handleDownloadClick(row)"
                    >
                        下载
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import { actionTypes } from '@/store/actionTypes';

    export default {
        async created () {
            if (this.recorderId) {
                const { data } = await axios.get(`/old_oa/attachment/find_by_recorder_id/${this.recorderId}`);
                for (let a of data) {
                    this.files.push({
                        id: a.id,
                        contentLength: a.contentLength,
                        name: a.filename,
                    });
                }
            }
        },
        data () {
            return {
                files: [],
            };
        },
        methods: {
            handleDownloadClick (row) {
                this.$store.dispatch(actionTypes.common.openNewWindow, `/old_oa/attachment/${row.id}}`);
            },
        },
        props: {
            recorderId: {
                type: String,
            },
        },
    };
</script>
