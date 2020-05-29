import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { actionTypes } from '@/store/actionTypes';
import { roles } from '@/store/enum';

Vue.use(Router);

export const checkRole = (currentUser, needRoles) => {
    if (currentUser == null) {
        return false;
    }

    if (needRoles == null) {
        return true;
    }

    if (_.isFunction(needRoles)) {
        return needRoles(currentUser);
    }

    if (_.isString(needRoles)) {
        needRoles = [needRoles];
    }

    const result = _.intersection(_.map(currentUser.groups, 'code'), needRoles).length > 0;
    console.log(`need role: ${needRoles}, ${result}`);
    return result;
};

/**
 * 检查用户是否三员
 * @param currentUser 用户
 * @returns {boolean} 是否三员
 */
export const isSy = (currentUser) => {
    return checkRole(currentUser, [roles.sjy, roles.aqy, roles.gly]);
};

export const routes = [
    {
        path: '/',
        beforeEnter: (to, from, next) => {
            const currentUser = store.state.auth.currentUser;
            if (!isSy(currentUser)) {
                next('/home');
            } else if (checkRole(currentUser, roles.gly)) {
                next('/system_config');
            } else {
                next('/audit');
            }
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "base" */ '@/components/auth/Login'),
    },
    {
        path: '/home',
        name: 'home',
        text: '首页',
        icon: 'fa fa-home',
        component: () => import(/* webpackChunkName: "base" */ '@/components/home/Index'),
    },
    {
        path: '/system_config',
        name: 'system_config',
        redirect: '/system_config/user',
        component: () => import(/* webpackChunkName: "systemConfig" */ '@/components/frames/SystemManagerFrame'),
        icon: 'icon iconfont B-icon_shezhi',
        text: '系统管理',
        meta: {
            auth: true,
            role: [roles.gly, roles.aqy],
        },
        children: [
            {
                path: 'index',
                name: 'jcsz',
                text: '基础设置',
                component: () => import(/* webpackChunkName: "systemConfig" */ '@/components/systemConfig/Index'),
                meta: {
                    auth: true,
                    role: [roles.gly, roles.aqy],
                },
            },
            {
                path: 'department',
                name: 'department',
                text: '组织架构管理',
                component: () => import(/* webpackChunkName: "systemConfig" */ '@/components/department/Index'),
                meta: {
                    auth: true,
                    role: [roles.gly, roles.aqy],
                },
            },
            {
                path: 'user',
                name: 'user',
                component: () => import(/* webpackChunkName: "systemConfig" */ '@/components/user/Index'),
                text: '用户管理',
                meta: {
                    auth: true,
                    role: [roles.gly, roles.aqy],
                },
            },
            {
                path: 'group',
                name: 'group',
                component: () => import(/* webpackChunkName: "systemConfig" */ '@/components/group/Index'),
                text: '角色管理',
                meta: {
                    auth: true,
                    role: [roles.gly, roles.aqy],
                },
            },
            {
                path: 'dictionary_code',
                name: 'dictionary_code',
                component: () => import(/* webpackChunkName: "systemConfig" */ '@/components/dictionaryCode/Index'),
                text: '代码管理',
                meta: {
                    auth: true,
                    role: [roles.gly, roles.aqy],
                },
            },
        ],
    },
    {
        path: '/equipment_manager',
        name: 'equipment_manager',
        component: () => import(/* webpackChunkName: "equipmentConfig" */ '@/components/frames/EquipmentManagerFrame'),
        icon: 'fa fa-truck',
        text: '设备管理',
        meta: {
            auth: user => !isSy(user),
        },
        children: [
            {
                path: 'brand',
                name: 'brand',
                component: () => import(/* webpackChunkName: "equipmentConfig" */ '@/components/brand/Index'),
                text: '品牌管理',
            },
            {
                path: 'brandModel',
                name: 'brandModel',
                component: () => import(/* webpackChunkName: "equipmentConfig" */ '@/components/brandModel/Index'),
                text: '型号管理',
            },
            {
                path: 'equipment',
                name: 'equipment',
                component: () => import(/* webpackChunkName: "equipmentConfig" */ '@/components/equipment/Index'),
                text: '设备仓库',
            },
        ],
    },
    {
        path: '/customer',
        name: 'customer',
        component: () => import(/* webpackChunkName: "customer" */ '@/components/customer/Index'),
        icon: 'fa fa-address-card-o',
        text: '客户管理',
        meta: {
            auth: user => !isSy(user),
        },
    },
    {
        path: '/computer_room',
        name: 'computer_room',
        component: () => import(/* webpackChunkName: "computerRoom" */ '@/components/computerRoom/Index'),
        icon: 'fa fa-building',
        text: '机房管理',
        meta: {
            auth: user => !isSy(user),
        },
    },
    {
        path: '/task',
        name: 'task',
        component: () => import(/* webpackChunkName: "computerRoom" */ '@/components/task/Index'),
        icon: 'fa fa-tasks',
        text: '任务管理',
        meta: {
            auth: user => !isSy(user),
        },
    },
    {
        path: '/task_process',
        name: 'task_process',
        component: () => import(/* webpackChunkName: "computerRoom" */ '@/components/taskProcess/Index'),
        icon: 'fa fa-pencil-square-o',
        text: '任务办理',
        meta: {
            auth: user => !isSy(user),
        },
    },
    {
        path: '/patrol_excel',
        name: 'patrol_excel',
        component: () => import(/* webpackChunkName: "computerRoom" */ '@/components/patrolExcel/Index'),
        icon: 'fa fa-table',
        text: '运维表格管理',
        meta: {
            auth: user => !isSy(user),
        },
    },
    {
        path: '/maintenance_level',
        name: 'maintenance_level',
        component: () => import(/* webpackChunkName: "computerRoom" */ '@/components/maintenanceLevel/Index'),
        icon: 'fa fa-newspaper-o',
        text: '维护等级管理',
        meta: {
            auth: user => !isSy(user),
        },
    },
    {
        // 会匹配所有路径，404
        path: '*',
        component: () => import(/* webpackChunkName: "base" */ '@/components/error/Error404'),
    },
];

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

const getCurrentUser = async () => {
    let currentUser = store.state.auth.currentUser;
    if (!currentUser) {
        try {
            await store.dispatch(actionTypes.auth.getCurrentUser);
            currentUser = store.state.auth.currentUser;
            await store.dispatch(actionTypes.common.loadGlobalSecureData);
        } catch (e) {
            currentUser = null;
        }
    }
    return currentUser;
};

// 登录页面
router.beforeEach(async (to, from, next) => {
    const currentUser = await getCurrentUser();

    if (to.fullPath === '/login') {
        if (currentUser) {
            next('/');
        } else {
            next();
        }
        return;
    }

    // 可以匿名访问的页面
    if (!to.meta.auth) {
        next();
        return;
    }

    if (currentUser == null) {
        next('/login');
        return;
    }

    const { role } = to.meta;
    if (role && !checkRole(currentUser, role)) {
        next('/');
        return;
    }

    next();
});

export default router;
