<template>
    <el-dialog :visible.sync="show"
               fullscreen
               destroy-on-close
               modal
               append-to-body
               :close-on-click-modal="false"
               :before-close="handleBeforeClose"
               @close="handleClose"
               :title="title"
    >
        <component ref="editor"
                   :is="component"
                   v-bind="passProps"
                   @save="handleSave"
        />
    </el-dialog>
</template>

<script>
    import WpsEditor from '@/components/common/WpsEditor';
    import FoxitoEditor from '@/components/common/FoxitoEditor';
    import { actionTypes } from '@/store/actionTypes';
    import { alertError } from '@/roadhog/alert';

    export default {
        components: { WpsEditor, FoxitoEditor },
        async created () {
            switch (this.fileType) {
                case 'wps':
                    this.fileContent = await this.handleWps(this.fileId, this.token);
                    this.component = WpsEditor;
                    this.passProps = {
                        width: this.width,
                        height: this.height,
                        readonly: this.readonly,
                        openDocContent: this.fileContent,
                        userName: this.currentUser?.fullName,
                        enableRevision: this.enableRevision,
                        revisionType: 4,
                        disableExportMenus: true,
                        disablePrintMenus: true,
                        createDocImmediate: true,
                    };
                    break;
                case 'ofd':
                    this.fileUrl = this.handleOfd(this.fileId, this.token);
                    this.component = FoxitoEditor;
                    this.passProps = {
                        url: this.fileUrl,
                        readonly: true,
                    };
                    break;
                case 'pdf':
                    this.fileUrl = this.handleOfd(this.fileId, this.token);
                    this.component = FoxitoEditor;
                    this.passProps = {
                        url: this.fileUrl,
                        readonly: true,
                    };
                    break;
                case 'doc':
                    this.fileContent = await this.handleWps(this.fileId, this.token);
                    this.component = WpsEditor;
                    this.passProps = {
                        width: this.width,
                        height: this.height,
                        readonly: this.readonly,
                        openDocContent: this.fileContent,
                        userName: this.currentUser?.fullName,
                        enableRevision: this.enableRevision,
                        revisionType: 4,
                        disableExportMenus: true,
                        disablePrintMenus: true,
                        createDocImmediate: true,
                    };
                    break;
                case 'docx':
                    this.fileContent = await this.handleWps(this.fileId, this.token);
                    this.component = WpsEditor;
                    this.passProps = {
                        width: this.width,
                        height: this.height,
                        readonly: this.readonly,
                        openDocContent: this.fileContent,
                        userName: this.currentUser?.fullName,
                        enableRevision: this.enableRevision,
                        revisionType: 4,
                        disableExportMenus: true,
                        disablePrintMenus: true,
                        createDocImmediate: true,
                    };
                    break;
                default:
                    alertError('不支持文件类型: ' + this.fileType);
                    this.handleClose();
                    this.show = false;
                    break;
            }
        },
        computed: {
            fileType () {
                return this.fileName.split('.').pop();
            },
            title () {
                if (this.readonly) {
                    return `文件预览(只读模式): ${this.fileName}`;
                } else {
                    return `文件编辑${this.enableRevision ? '(修订模式)' : ''}：${this.fileName}`;
                }
            },
        },
        methods: {
            handleWps (fileId, fileToken) {
                if (fileId && fileToken) {
                    return this.$store.dispatch(actionTypes.common.getAttachmentBase64, {
                        id: fileId,
                        token: fileToken,
                    });
                }
                return null;
            },
            handleOfd (fileId, fileToken) {
                return `${window.location.origin}/api/attachment/${fileId}/${fileToken}`;
            },
            handleSave (content) {
                this.$emit('save', content);
            },
            async handleBeforeClose (done) {
                if (!this.readonly) {
                    const content = await this.$refs.editor.handleSave();
                    this.$emit('save', content);
                }
                done();
            },
            handleClose () {
                this.$emit('close');
            },
            async closeDialog () {
                await this.handleBeforeClose();
                this.handleClose();
                this.show = false;
            },
        },
        data () {
            return {
                show: true,
                passProps: {},
                fileContent: null,
                fileUrl: null,
                component: null,
            };
        },
        props: {
            fileName: {
                type: String,
                required: true,
            },
            fileId: {
                type: String,
            },
            token: {
                type: String,
            },
            readonly: {
                type: Boolean,
            },
            width: {
                type: String,
            },
            height: {
                type: String,
            },
            enableRevision: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
