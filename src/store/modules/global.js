import axios from 'axios';
import { actionTypes } from '@/store/actionTypes';
import { mutationTypes } from '@/store/mutationTypes';
import { getAbsoluteHeight } from '@/roadhog/utils';

const state = {
    mainHeight: 0,
    contentHeight: 0,
    headerHeight: 0,
    webSettings: {
        clientVersion: process.env.CLIENT_VERSION,
    },
};

const mutations = {
    calcViewHeight (state) {
        const $app = document.getElementById('app');
        const $header = document.getElementsByClassName('header')[0];
        const $mainFrame = document.getElementsByClassName('main-frame')[0];

        state.mainHeight = getAbsoluteHeight($app);
        if ($header) {
            state.headerHeight = getAbsoluteHeight($header);
        }

        let mainFramePaddingHeight = 0;
        if ($mainFrame) {
            const styles = window.getComputedStyle($mainFrame);
            mainFramePaddingHeight = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) +
                parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        }

        state.contentHeight = state.mainHeight - state.headerHeight - mainFramePaddingHeight;
    },
    [mutationTypes.global.setWebSettings] (state, data) {
        document.title = data.title;
        state.webSettings = Object.assign(state.webSettings, data);
    },
};

const actions = {
    async [actionTypes.common.getWebSettings] ({ commit }) {
        await Promise.all([
            axios.get('/web_settings'),
            axios.get('/logo'),
        ]).then(([response1, response2]) => {
            const data = {};
            Object.assign(data, response1.data, { logo: response2.data });
            commit(mutationTypes.global.setWebSettings, data);
        });
    },
    async [actionTypes.common.getAttachments] (store, { recorderId }) {
        const { data } = await axios.get(`/attachment/recorder_attachments/${recorderId}`);
        return data;
    },
    async [actionTypes.common.saveAttachmentTemp] (store, { name, content, recorderType }) {
        const { data } = await axios.post(`/attachment/save_temp/${recorderType}`, { name, content });
        // 返回的是附件概要，有一个token，用于取这个附件: id, name, type, token
        return data;
    },
    async [actionTypes.common.getAttachmentBase64] (store, { id, token }) {
        const { data } = await axios.get(`/attachment/get_base64/${id}/${token}`);
        return data;
    },
    async [actionTypes.common.saveExistsAttachment] (store, { attachmentId, token, content }) {
        await axios.put(`/attachment/save/${attachmentId}/${token}`, { content });
    },
    [actionTypes.common.openNewWindow] (store, url) {
        if (_.startsWith(url, '/')) {
            url = url.substr(1);
        }
        if (!_.startsWith('/api', url)) {
            url = `/api/${url}`;
        }
        window.open(url, 'blank');
    },
    [actionTypes.common.downloadAttachment] ({ dispatch }, { attachmentId, token }) {
        dispatch(actionTypes.common.openNewWindow, `/attachment/download/${attachmentId}/${token}`);
    },
    [actionTypes.common.previewImage] ({ dispatch }, { attachmentId, token }) {
        dispatch(actionTypes.common.openNewWindow, `/attachment/preview_image/${attachmentId}/${token}`);
    },
    [actionTypes.common.loadGlobalSecureData] (store) {
        return Promise.all([
            store.dispatch(`department/${actionTypes.common.list}`), // 获取部门列表
            store.dispatch(`brand/${actionTypes.common.list}`), // 获取品牌列表
            store.dispatch(`brandModel/${actionTypes.common.list}`), // 获取型号列表
        ]);
    },
    async [actionTypes.common.getUniqueId] () {
        const { data } = await axios.get('/unique_id');
        return data;
    },
};

export default {
    state,
    actions,
    mutations,
};
