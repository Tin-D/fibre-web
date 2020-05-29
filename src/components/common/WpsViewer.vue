<template>
    <div>
        <el-button-group>
            <el-button size="mini" type="default" icon="el-icon-printer" v-if="canPrint">打印</el-button>
        </el-button-group>

        <wps-editor v-if="showWpsEditor"
                    ref="wpsEditor"
                    :open-doc-content="content"
                    :user-name="currentUser.fullName"
                    disable-export-menus
                    disable-print-menus
                    readonly
        />
    </div>
</template>

<script>
    import WpsEditor from '@/components/common/WpsEditor';
    import { actionTypes } from '@/store/actionTypes';

    export default {
        components: { WpsEditor },
        async created () {
            this.content = await this.$store.dispatch(actionTypes.common.getAttachmentBase64, {
                id: this.attachmentId,
                token: this.token,
            });
            this.showWpsEditor = true;
        },
        data () {
            return {
                showWpsEditor: false,
                revisionType: 2,
                content: null,
            };
        },
        props: {
            canPrint: {
                type: Boolean,
                default: false,
            },
            attachmentId: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
        },
    };
</script>
