<template>
    <div v-loading="isReadFiles">

        <el-form inline class="toolbar" size="mini" style="border-bottom: 1px #ddd solid;">
            <el-form-item class="modTitle fjlist" style="width: 100%;">
                <span>
                    附件列表
                </span>
                <input ref="btnFile"
                       type="file"
                       @change="handleFileChange"
                       :multiple="limit > 1 ? 'multiple' : null"
                       :accept="accept"
                       style="display: none"
                />
                <el-button size="mini" type="primary" @click="$refs.btnFile.click()" style="float: right" v-if="!readonly">选取本地文件</el-button>
                <span style="margin-left: 10px;" v-if="!readonly">上传文件要求: {{helpTextPrefix}}{{ helpText }}</span>
            </el-form-item>
        </el-form>

        <el-table :data="files"
                  width="100%"
                  highlight-current-row
                  stripe
                  border
                  size="mini"
                  empty-text="没有附件"
                  :class="tableClassName"
                  class="intable tablebordereee"
        >
            <el-table-column label="名称" prop="name" :sortable="sortable">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="text" @click.stop.prevent="handleFileClick(row)" :title="row.name">{{ row.name }}</el-button>
                </template>
            </el-table-column>

            <el-table-column label="大小(kb)" prop="size" :sortable="sortable">
                <template slot-scope="{ row }">
                    {{ row.size ? (row.size / 1024).toFixed(2) : null }}
                </template>
            </el-table-column>

            <el-table-column label="已上传" prop="token" :sortable="sortable" v-if="!readonly">
                <template slot-scope="{ row }">
                    {{ row.token ? '是' : '否' }}
                </template>
            </el-table-column>

            <el-table-column label="上传时间" prop="createTime" :sortable="sortable" :formatter="renderDateTimeRow"/>

            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-download"
                               v-if="allowDownloadButton && row.token"
                               @click="handleDownloadClick(row)"
                    >
                        下载
                    </el-button>
                    <el-button size="mini"
                               type="text"
                               icon="fa fa-print"
                               v-if="row.token && allowPrint"
                               @click="handlePrint(row)"
                    >
                        {{ printText }}
                    </el-button>
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-delete"
                               v-if="!readonly"
                               @click="handleRemoveFile(row)"
                               style="color: red"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import { actionTypes } from '@/store/actionTypes';
    import { alertError, confirmDialog } from '@/roadhog/alert';
    import { generateFileJson } from '@/roadhog/utils';

    export default {
        async created () {
            if (this.recorderId) {
                const attachments = await this.$store.dispatch(actionTypes.common.getAttachments, { recorderId: this.token || this.recorderId });
                for (let a of attachments) {
                    this.files.push({
                        id: a.id,
                        size: a.size,
                        name: a.name,
                        token: a.token,
                        createTime: a.createTime,
                    });
                }
            }

            if (this.initFiles?.length > 0) {
                this.files.push(...this.initFiles);
            }

            if (this.onFilesLoad) {
                this.onFilesLoad(this.files);
            }

            this.$emit('input', this.limit === 1 ? this.files[0] : this.files);
        },
        data () {
            return {
                isReadFiles: false,
                files: [],
            };
        },
        computed: {
            parsedMaxSize () {
                if (this.maxSize === '0') {
                    return Number.MAX_VALUE;
                }

                const maxSize = this.maxSize.toLowerCase();
                let sizeNumber = parseInt(maxSize.substr(0, maxSize.length - 1));
                if (_.endsWith(maxSize, 'g')) {
                    sizeNumber = sizeNumber * 1024 * 1024 * 1024;
                } else if (_.endsWith(maxSize, 'm')) {
                    sizeNumber = sizeNumber * 1024 * 1024;
                } else if (_.endsWith(maxSize, 'k')) {
                    sizeNumber = sizeNumber * 1024;
                }

                return sizeNumber;
            },
            helpText () {
                let result = '';
                if (this.allowExtensions && this.allowExtensions.length > 0) {
                    result = result + '允许的文件类型' + this.allowExtensions.join(',') + '; ';
                }

                if (this.parsedMaxSize < Number.MAX_VALUE) {
                    result = result + '文件大小不超过 ' + this.maxSize + ';';
                }

                return result;
            },
        },
        methods: {
            async handleFileChange (e) {
                const files = e.target.files;

                if (!files || files.length === 0) {
                    return;
                }

                if (this.limit > 1) {
                    // 判断文件数量
                    const fileListSize = this.files.length + e.target.files;
                    if (fileListSize > this.limit) {
                        alertError(`最多只允许上传${this.limit}个附件`);
                        return;
                    }
                } else {
                    this.files = [];
                }

                this.isReadFiles = true;
                for (let f of files) {
                    try {
                        const fj = await generateFileJson(f);
                        const fileExtension = fj.name.toLowerCase().split('.').pop();
                        if (fj.size > this.parsedMaxSize) {
                            await alertError(`文件: ${fj.name} 的大小: ${fj.size}, 超过允许的大小: ${this.maxSize}`);
                            break;
                        } else if (this.allowExtensions.length > 0 && this.allowExtensions.find(n => n.toLowerCase() === fileExtension) == null) {
                            await alertError(`不允许上传 ${fileExtension} 类型文件`);
                            break;
                        } else if (this.files.find(i => i.name === fj.name)) {
                            try {
                                await confirmDialog({ message: `存在同名文件：${f.name}，是否替换` });
                                const index = _.findIndex(this.files, f => f.name === fj.name);
                                this.files.splice(index, 1, fj);
                            } catch {
                            }
                        } else {
                            this.files.push(fj);
                        }
                    } finally {
                    }
                }
                this.isReadFiles = false;

                e.target.value = '';
                this.$emit('input', this.limit === 1 ? this.files[0] : this.files);
            },
            handleDownloadClick (file) {
                this.$store.dispatch(actionTypes.common.downloadAttachment, { attachmentId: file.id, token: file.token });
            },
            handleFileClick (file) {
                if (!file.token) {
                    return;
                }

                if (this.clickToDownload) {
                    this.handleDownloadClick(file);
                } else {
                    this.$emit('preview', file);
                }
            },
            async handleRemoveFile (file) {
                await confirmDialog({ itemName: file.name });
                const index = this.files.indexOf(file);
                if (index > -1) {
                    this.files.splice(index, 1);
                }
            },
            handlePrint (file) {
                this.$emit('print', file);
            },
        },
        props: {
            initFiles: {
                type: Array, // 初始化的时候的文件
            },
            limit: {
                type: Number,
                default: 3,
            },
            maxSize: {
                type: String,
                default: '50m', // 支持的单位：k, m, g
            },
            accept: {
                type: String,
                default: '*/*',
            },
            allowExtensions: { //  允许的扩展名：在Linux系统浏览器里，不支持accept属性，比如： [wps, ofd, gif]
                type: Array,
                default: () => [],
            },
            recorderId: {
                type: String,
            },
            token: {
                type: String,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            allowPrint: {
                type: Boolean,
                default: false,
            },
            printText: {
                type: String,
                default: '打印',
            },
            clickToDownload: {
                type: Boolean, // 默认点击文件名就下载，如果不是下载，就设置成false，并在父组件上监听 'preview' 事件
                default: true,
            },
            helpTextPrefix: {
                type: String,
            },
            sortable: {
                type: Boolean,
                default: false,
            },
            onFilesLoad: { // 文件加载完成后的回调函数，可以在这里强制给文件列表排序
                type: Function,
            },
            tableClassName: {
                type: String,
            },
            allowDownloadButton: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
