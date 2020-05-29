import Vue from 'vue';
import Vuex from 'vuex';
import global from '@/store/modules/global';
import auth from '@/store/modules/auth';
import group from '@/store/modules/group';
import user from '@/store/modules/user';
import dictionaryCode from '@/store/modules/dictionaryCode';
import department from '@/store/modules/department';
import workflow from '@/store/modules/workflow';
import auditLog from '@/store/modules/auditLog';
import brand from '@/store/modules/brand';
import brandModel from '@/store/modules/brandModel';
import customer from '@/store/modules/customer';
import computerRoom from '@/store/modules/computerRoom';
import equipment from '@/store/modules/equipment';
import task from '@/store/modules/task';
import patrolExcel from '@/store/modules/patrolExcel';
import maintenanceLevel from '@/store/modules/maintenanceLevel';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        global,
        auth,
        auditLog,
        dictionaryCode,
        group,
        user,
        department,
        workflow,
        brand,
        brandModel,
        customer,
        computerRoom,
        equipment,
        task,
        patrolExcel,
        maintenanceLevel,
    },
});
