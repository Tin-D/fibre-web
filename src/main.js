import Vue from 'vue';
import 'lodash';
import 'font-awesome/css/font-awesome.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css';
import './assets/css/mainStyle.scss';
import './assets/css/panel.scss';
import './roadhog/commonMixins';
import './roadhog/axiosConfig';
import roadHog from './roadhog/roadhog';
import App from './App.vue';
import router from './router';
import store from './store';
import { actionTypes } from '@/store/actionTypes';

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: 'small' });
Vue.use(roadHog);

window.addEventListener('resize', () => {
    store.commit('calcViewHeight');
    console.log('window resize!');
});

Promise.all([
    // 网站加载的时候，自动获取配置信息
    store.dispatch(actionTypes.common.getWebSettings), // 获取网站配置信息
    store.dispatch(`dictionaryCode/${actionTypes.common.list}`), // 获取所有数据字典
    store.dispatch(`group/${actionTypes.common.list}`), // 获取所有分组
]).then(() => {
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app');
});
