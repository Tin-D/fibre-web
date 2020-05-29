<template>
    <div>
        <el-form size="mini" inline class="toolbar" v-if="debug">
            <el-form-item>
                <el-button @click="handleOpenTemplateFile">打开模板文件</el-button>
                <el-button @click="handleBookMarks">获取正文</el-button>
                <el-button @click="handleDownload">下载文件</el-button>
                {{ this.contentDocFileOneOffToken }}
            </el-form-item>
        </el-form>

        <object name='webwps' :id='id' type='application/x-wps' data='/opt/kingsoft/wps-office//office6/mui/default/templates/Normal.dotm'
                width='100%' :height='tableHeight - 20 + "px"'>
            <param name='Enabled' value='1'/>
        </object>
    </div>
</template>

<script>
    import { autoHeightTableMixin } from '@/components/common/autoHeightTableMixin';
    import { actionTypes } from '@/store/actionTypes';

    export default {
        mixins: [autoHeightTableMixin()],
        data () {
            return {
                tableHeight: 0,
                id: _.uniqueId('webwps_'),
                app: null,
                isRunning: false,
            };
        },
        mounted () {
            const obj = document.getElementById(this.id);
            this.app = obj.Application;
            if (this.app) {
                this.afterInit();
            } else {
                let app;
                this.intervalId = setInterval(() => {
                    app = obj.Application;
                    if (app && app.IsLoad()) {
                        clearInterval(this.intervalId);
                        this.intervalId = null;
                        this.app = app;
                        this.afterInit();
                    }
                }, 200);
            }
        },
        methods: {
            afterInit () {
                console.log('fit ready to run ...');
                try {
                    this.handleOpenTemplateFile();
                    console.log('fit success load template');

                    this.handleBookMarks();
                    console.log('fit success replace bookmarks');

                    this.handleDownload();
                    console.log('fit success start download');

                    this.$emit('done');
                } catch (e) {
                    this.$emit('done', e);
                }
            },
            handleOpenTemplateFile () {
                // 获取模板
                const url = `${window.location.origin}/api/file_template/get_content/${this.templateId}`;
                this.app.openDocumentRemote(url, false);
            },
            handleBookMarks () {
                const a = this.app.ActiveDocument.Bookmarks.Item('正文');
                if (a) {
                    const insertFile = a.Range.InsertFile(`${window.location.origin}/api/attachment/content/${this.contentDocFileOneOffToken}`);
                    if (!insertFile) {
                        throw new Error('插入正文失败');
                    }
                } else {
                    console.log('找不到正文书签: ' + this.contentBookMarkName);
                }

                // 替换其他书签
                _.forOwn(this.data, (value, key) => {
                    const bookmark = this.app.ActiveDocument.Bookmarks.Item(key);
                    if (bookmark) {
                        bookmark.ReplaceText(value);
                        console.log('成功替换书签: ' + bookmark);
                    } else {
                        console.log('找不到书签: ' + bookmark);
                    }
                });
            },
            async handleDownload () {
                const content = this.app.saveAsBase64Str('wps');
                const data = await this.$store.dispatch(actionTypes.common.saveAttachmentTemp, {
                    name: this.downloadFileName,
                    content,
                    recorderType: 'fitTemplate',
                });
                this.$store.dispatch(actionTypes.common.downloadAttachment, { attachmentId: data.id, token: data.token });
            },
        },
        props: {
            templateId: {
                type: String,
                required: true,
            },
            contentBookMarkName: { // 正文对应的书签名
                type: String,
                default: '正文',
            },
            contentDocFileOneOffToken: { // 正文附件令牌（一次性令牌），因为wps的InsertFile方法不会带上cookies，所以只能用一次性令牌
                type: String,
                required: true,
            },
            data: { // 书签对应的值，一个哈希表
                type: Object,
                required: true,
            },
            debug: {
                type: Boolean,
                default: true,
            },
            downloadFileName: {
                type: String,
                required: true,
            },
        },
    };
</script>
