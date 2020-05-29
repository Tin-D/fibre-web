<template>
    <el-upload ref="upload"
               action="/api/attachment/upload_to_cache"
               with-credentials
               multiple
               :auto-upload="true"
               :http-request="handleUpload"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :file-list="fileList"
               :accept="accept"
               :limit="limit"
               :before-upload="beforeUpload"
               :disabled="disabled || readonly"
    >
        <el-button slot="trigger" size="mini" type="primary" v-if="!disabled && !readonly">选取本地文件</el-button>
        <div slot="tip" v-if="tip">{{ tip }}</div>
        <slot name="buttons" v-if="!disabled && !readonly"></slot>
        <span v-if="disabled || readonly">附件列表</span>

        <el-dialog :visible.sync="imagePreviewDialog.show" fullscreen :title="`预览图片: ${imagePreviewDialog.title}`" append-to-body>
            <div style="text-align: center;">
                <img :src="imagePreviewDialog.url" :alt="imagePreviewDialog.title"/>
            </div>
            <div slot="footer"></div>
        </el-dialog>
    </el-upload>
</template>

<script>
    import { actionTypes } from '@/store/actionTypes';

    function getBase64 (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function generateFileJson (file) {
        const fileString = await getBase64(file);
        const index = fileString.indexOf('base64,');
        const contentType = fileString.substr(5, index - 'base64,'.length + 1);
        return {
            name: file.name,
            contentType,
            content: fileString.substr(index + 'base64,'.length),
        };
    }

    export default {
        async created () {
            if (this.recorderId) {
                const attachments = await this.$store.dispatch(actionTypes.common.getAttachments, { recorderId: this.token || this.recorderId });
                for (let a of attachments) {
                    this.fileList.push({
                        id: a.id,
                        url: `/api/attachment/download/${a.token || a.id}`,
                        name: a.name,
                        token: a.token,
                    });
                }
            }
        },
        data () {
            return {
                fileList: [],
                imagePreviewDialog: {
                    show: false,
                    title: null,
                    url: null,
                },
            };
        },
        methods: {
            async handleUpload ({ file }) {
                const f = await generateFileJson(file);
                this.fileList.push(f);
            },
            getFiles () {
                return _.map(this.fileList, n => ({
                    id: n.id,
                    name: n.name,
                    contentType: n.contentType,
                    content: n.content,
                }));
            },
            putFiles (files) {
                _.forEach(files, f => {
                    if (_.find(this.fileList, n => n.id === f.id) == null) {
                        this.fileList.push({
                            id: f.id,
                            name: f.name,
                        });
                    }
                });
            },
            handlePreview (file) {
                if (this.previewHandler !== 'download') {
                    this.$emit('preview', file);
                } else {
                    this.$store.dispatch(actionTypes.common.downloadAttachment, { attachmentId: file.id, token: file.token });
                }
            },
            handleRemove (file) {
                const index = this.fileList.indexOf(file);
                if (index > -1) {
                    this.fileList.splice(index, 1);
                }
            },
        },
        props: {
            limit: {
                type: Number,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            recorderId: {
                type: String,
            },
            token: {
                type: String,
            },
            accept: {
                type: String,
            },
            beforeUpload: {
                type: Function,
            },
            previewHandler: {
                type: String,
                default: 'download',
            },
            tip: {
                type: String,
            },
        },
    };
</script>
