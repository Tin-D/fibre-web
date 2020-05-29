<template>
    <div id="app">
        <login v-if="!currentUser"></login>
        <top-left-main-frame v-else/>
    </div>
</template>
<script>
    import Login from './components/auth/Login';
    import TopLeftMainFrame from '@/components/frames/TopLeftMainFrame';

    export default {
        components: { TopLeftMainFrame, Login },
    };
</script>
