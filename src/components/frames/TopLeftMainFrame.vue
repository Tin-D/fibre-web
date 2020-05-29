<template>
    <el-container style="height: 100%;">

        <div class="fangkuai"></div>

        <el-header height="72px" style="padding: 0;" class="header">
            <top/>
        </el-header>

        <el-container class="main-container">
            <el-aside width="200px">
                <left :root-menu="routes"/>
            </el-aside>
            <el-main class="main-frame">
                <router-view/>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import { routes } from '@/router';
    import Top from '@/components/frames/Top';
    import Left from '@/components/frames/Left';

    export default {
        name: 'TopLeftMainFrame',
        components: { Top, Left },
        data () {
            return {
                routes,
                BUILD_DATE: process.env.BUILD_DATE || 'dev mode',
            };
        },
        mounted () {
            this.$store.commit('calcViewHeight');
        },
    };
</script>
