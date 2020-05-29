<template>
    <div :style="{width: width, height: height}">
        <div v-if="!ocx" style="font-size: 18px;">
            <i class="el-icon-loading"></i>
            foxito loading...
        </div>
        <el-form size="mini" inline v-if="!readonly">
            <el-form-item>
                <el-button type="primary" icon="fa fa-save"> 保存文档</el-button>
            </el-form-item>
        </el-form>
        <div ref="ocx" :id='id'></div>
    </div>
</template>

<script>
    window.initSetting = () => {
    };

    export default {
        created () {
            this.$nextTick(() => {
                // eslint-disable-next-line no-undef
                this.ocx = foxit.ofdReaderInit(this.id, this.width, this.height);
                this.ocx.JsCallbackFun_InitSetting();
                // ocx.JsCallbackFun_UpdateInfo();
                // this.ocx.openFile('/root/桌面/总.ofd', true);
                this.ocx.openFile(this.url, this.readonly);
            });
        },
        data () {
            return {
                id: _.uniqueId('foxito_'),
                ocx: null,
            };
        },
        props: {
            width: {
                type: String,
                default: '100%',
            },
            height: {
                type: String,
                default: '850px',
            },
            url: {
                type: String,
                required: true,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
