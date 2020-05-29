<template>
    <div class="top">
        <div class="TopLogo" :style="{'background-image': `url(${logoImage})`}"></div>
        <div class="TopTitle">{{ webSettings.title }}</div>
        <div class="TopUser">
            <el-dropdown @command="handleCommand">
                <div class="el-dropdown-link">
                    <i class="icon iconfont B-kefuyouxian usericon"></i>
                    <span class="TopUsername">{{ currentUser.fullName }}</span>
                    <i class="icon iconfont B-caret-down" style="font-size:12px;color:#01AFF8;float:right;"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="profile"><i class="icon iconfont B-renyuan"></i> 个人信息</el-dropdown-item>
                    <el-dropdown-item command="changePassword"><i class="icon iconfont B-yuechi"></i> 密码修改</el-dropdown-item>
                    <el-dropdown-item command="about" style="padding:0 13px;"><i class="f20 icon iconfont B-banquan"></i>关于本软件</el-dropdown-item>
                    <el-dropdown-item command="help"><i class="icon iconfont B-bangzhu"></i> 帮助手册</el-dropdown-item>
                    <el-dropdown-item command="logout"><i class="icon iconfont B-tuichu"></i> 退出系统
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <user-profile-editor v-if="UserProfileEditorDialog.show"
                             @close="UserProfileEditorDialog.handleClose"
        />
        <change-my-password v-if="ChangeMyPasswordDialog.show"
                            @close="ChangeMyPasswordDialog.handleClose"
        />
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import { actionTypes } from '@/store/actionTypes';
    import ChangeMyPassword from '@/components/profile/ChangeMyPassword';
    import UserProfileEditor from '@/components/profile/UserProfileEditor';
    import defaultLogo from '@/assets/images/logo.png';

    export default {
        name: 'Top',
        components: { ChangeMyPassword, UserProfileEditor },
        data () {
            return {
                UserProfileEditorDialog: {
                    show: false,
                    handleClose: () => {
                        this.UserProfileEditorDialog.show = false;
                    },
                    handleEdit: () => {
                        this.UserProfileEditorDialog.show = true;
                    },
                },
                ChangeMyPasswordDialog: {
                    show: false,
                    handleClose: () => {
                        this.ChangeMyPasswordDialog.show = false;
                    },
                    handleEdit: () => {
                        this.ChangeMyPasswordDialog.show = true;
                    },
                },
            };
        },
        computed: {
            webSettings () {
                return this.$store.state.global.webSettings;
            },
            logoImage () {
                const logo = this.$store.state.global.webSettings.logo;
                return logo || defaultLogo;
            },
        },
        methods: {
            async handleCommand (cmd) {
                const h = this.$createElement;
                const webSettings = this.$store.state.global.webSettings;

                if (cmd === 'logout') {
                    await this.$store.dispatch(actionTypes.auth.logout);
                    this.$router.push('/login');
                } else if (cmd === 'profile') {
                    this.UserProfileEditorDialog.handleEdit();
                } else if (cmd === 'changePassword') {
                    this.ChangeMyPasswordDialog.handleEdit();
                } else if (cmd === 'about') {
                    this.$msgbox({
                        title: '关于本软件',
                        message: h('p', null, [
                            h('span', null, '客户端版本 '),
                            h('i', { style: 'color: teal; cursor: pointer;' }, `${process.env.COMMIT_HASH}@${dayjs(process.env.BUILD_DATE).format('YYYY-MM-DD HH:mm:ss')}`),
                            h('br'),
                            h('span', null, '服务端版本 '),
                            h('i', { style: 'color: teal; cursor: pointer;' }, `${webSettings.buildRevisionNumber}@${dayjs(webSettings.buildDate).format('YYYY-MM-DD HH:mm:ss')}`),
                        ]),
                    });
                } else if (cmd === 'help') {
                    this.$store.dispatch(actionTypes.common.openNewWindow, '/user_manual/download');
                } else {
                    throw new Error(`unsupported cmd: ${cmd}`);
                }
            },
        },
    };
</script>
