<template>
    <div :style="{width: width, height: height}">
        <div v-if="!app" style="font-size: 18px;">
            <i class="el-icon-loading"></i>
            wps loading...
        </div>
        <el-form size="mini" inline v-if="!readonly">
            <el-form-item>
                <el-button type="primary" icon="fa fa-save" @click="handleSave"> 保存文档</el-button>
            </el-form-item>
        </el-form>
        <object name='webwps' :id='id' type='application/x-wps' data='/opt/kingsoft/wps-office//office6/mui/default/templates/Normal.dotm'
                width='100%' height='100%'>
            <param name='Enabled' value='1'/>
        </object>
    </div>
</template>

<script>

    import { confirmDialog } from '@/roadhog/alert';

    const exportMenuTexts = [
        '保存(&S)',
        '保存(Ctrl+S)',
        '另存为(&A)...',
        '保存所有文档(&E)',
        '另存为网页(&G)...',
        '输出为OFD格式(&G)...',
        '输出为PDF格式(&F)...',
        '新建空白文档(&B)',
        '打印(&P)',
        '打开(&O)',
        '新建(&N)...',
        '输出为PDF格式...',
    ];

    const printMenuTexts = [
        '打印预览(&V)',
        '打印(&P)...',
    ];

    // window.wpsSave = (doc, saveAs, cancel) => {
    // cancel.SetValue(true);
    // };

    export default {
        beforeDestroy () {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        },
        data () {
            return {
                id: _.uniqueId('webwps_'),
                app: null,
                intervalId: null,
            };
        },
        methods: {
            afterInit () {
                const bars = this.app.get_CommandBars();

                // 隐藏“文件”菜单里面不需要显示的东西
                const fileBar = bars.get_Item('file');
                this.hideBarMenus(fileBar, (caption) => {
                    let disable;
                    if (this.disableExportMenus && exportMenuTexts.includes(caption)) {
                        disable = true;
                    } else if (this.disablePrintMenus && printMenuTexts.includes(caption)) {
                        disable = true;
                    }
                    return disable;
                });

                // 隐藏特色工具里面的东西
                const workspaceBar = bars.get_Item('Workspacemenu');
                this.hideBarMenus(workspaceBar, (caption) => {
                    return caption === '输出为PDF格式(&F)...';
                });

                // 隐藏有打印、保存按钮小图标的工具条
                const standardBar = bars.get_Item('standard');
                this.hideBarMenus(standardBar, (caption) => {
                    let disable;
                    if (this.disableExportMenus && exportMenuTexts.includes(caption)) {
                        disable = true;
                    } else if (this.disablePrintMenus && printMenuTexts.includes(caption)) {
                        disable = true;
                    }
                    return disable;
                });

                if (this.openDocContent) {
                    this.openDoc(this.openDocContent);
                } else if (this.createDocImmediate) {
                    this.createDoc();
                }

                if (this.userName) {
                    this.app.setUserName(this.userName);
                }

                if (this.enableRevision) {
                    this.app.enableRevision(this.revisionType);
                    this.app.showRevision(0);
                }
            },
            hideBarMenus (barObj, cb) { // 通过回调决定该按钮是否禁用，cb(caption) 返回true: 禁用，false: 不禁用
                const controls = barObj.get_Controls();
                let control;
                for (let i = 1; i < 100; i++) {
                    let disable = false;
                    control = controls.get_Item(i);
                    if (control) {
                        const caption = control.get_Caption();
                        disable = cb(caption);
                        control.put_Visible(!disable);
                    } else {
                        break;
                    }
                }
            },
            createDoc () {
                this.app.createDocument('wps');
            },
            getContent () {
                return this.app.saveAsBase64Str('wps');
            },
            openDoc (contentBase64) {
                this.app.openDocumentFromBase64Str(contentBase64, this.readonly);
                if (this.readonly) {
                    this.app.enableCut(false);
                    this.app.enableCopy(false);
                }
            },
            copy () {
                this.app.ActiveDocument.GetRange().Select();
                const a = this.app.Selection.get_Type();
                alert(a);
            },
            async handleSave () {
                let content;
                try {
                    content = this.getContent();
                } catch (e) {
                    await confirmDialog({ message: `无法获取正文内容${e}，如果继续将不会保存正文，是否继续` });
                }
                this.$emit('save', content);
            },
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
        watch: {
            revisionType (newValue) {
                if (this.app && this.enableRevision) {
                    this.app.showRevision(newValue);
                }
            },
        },
        props: {
            width: {
                type: String,
                default: '100%',
            },
            height: {
                type: String,
                default: '820px',
            },
            createDocImmediate: { // 初始化后是否创建新文档
                type: Boolean,
                default: false,
            },
            readonly: { // 是否只读模式打开
                type: Boolean,
                default: false,
            },
            openDocContent: { // 初始化后打开文档，优先级比 createDocImmediate 高
                type: String,
            },
            userName: { // 编辑文档的用户的姓名
                type: String,
            },
            enableRevision: { // 启用修订
                type: Boolean,
                default: false,
            },
            revisionType: {
                type: Number,
                default: 1,
            },
            disableExportMenus: {
                type: Boolean,
                default: false,
            },
            disablePrintMenus: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
