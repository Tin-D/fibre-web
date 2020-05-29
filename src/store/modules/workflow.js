import axios from 'axios';
import { generateCurdManager } from '@/store/baseManager';
import { actionTypes } from '@/store/actionTypes';
import { WorkflowInstanceStatus as wis, WorkflowTaskStatus } from '@/store/enum';

const url = '/workflow';

const store = generateCurdManager({
    url,
    listProperty: 'workflows',
    namespaced: true,
});

class WorkflowInstanceDetails {
    constructor (instanceStatus) {
        _.forOwn(instanceStatus, (value, key) => {
            this[key] = value;
        });

        this.currentStepCode = _.last(instanceStatus.steps).code;
        this.currentStepName = _.last(instanceStatus.steps).name;

        this.result = instanceStatus.status === wis.Finish ? _.last(instanceStatus.steps).result : null;

        this.executors = []; // 待办人员
        this.actualExecuteUsers = []; // 已办人员
        _.forEach(instanceStatus.steps, step => {
            _.forEach(step.tasks, task => {
                if (task.status === WorkflowTaskStatus.Todo) {
                    this.executors.push({
                        id: task.executorId,
                        name: task.executorName,
                    });
                } else if (task.status === WorkflowTaskStatus.Finish) {
                    this.actualExecuteUsers.push({
                        id: task.actualExecutorId,
                        name: task.actualExecutorName,
                    });
                }
            });
        });
    }

    // 判断用户是否是当前实例当前步骤的待办人员
    isExecutorUser (user) {
        const allIds = user ? _.concat(user.id, user.groupIds, user.departmentIds, user.postIds) : [];
        return _.intersection(allIds, _.map(this.executors, 'id')).length > 0;
    }

    // 判断用户是否是当前实例的参与者
    isActor (user) {
        const allIds = user ? _.concat(user.id, user.groupIds, user.departmentIds, user.postIds) : [];
        const allActorIds = _.map(_.concat(this.executors, this.actualExecuteUsers), 'id');
        return _.intersection(allIds, allActorIds).length > 0;
    }

    // 获取指定步骤
    getStep (stepCode) {
        return _.find(this.steps, s => s.code === stepCode);
    }
}

const { actions } = store;

Object.assign(actions, {
    async [actionTypes.workflow.checkRecorderCreatorClassName] (store, className) {
        const { data } = await axios.post(`${url}/check_recorder_creator_class_name`, className, {
            headers: { 'Content-Type': 'text/plain' },
        });
        return data.success;
    },
    async [actionTypes.workflow.getInstances] (store, query) {
        const { data } = await axios.post('/workflow_instance', query);
        return data;
    },
    async [actionTypes.workflow.getTasks] (store, query) {
        const { data } = await axios.post(`${url}/tasks`, query);
        return data;
    },
    async [actionTypes.workflow.getInstanceStatus] (store, instanceId) {
        const { data } = await axios.get(`${url}/instance_details/${instanceId}`);
        return new WorkflowInstanceDetails(data);
    },
    [actionTypes.workflow.export] ({ dispatch }, id) {
        dispatch(actionTypes.common.openNewWindow, `${url}/export/${id}`, { root: true });
    },
    async [actionTypes.workflow.import] (store, file) {
        await axios.post(`${url}/import`, file, { formPost: true, loading: true });
    },
    async [actionTypes.workflow.cancelTask] (store, { instanceId, taskId }) {
        await axios.put(`/workflow_instance/${instanceId}/cancel_task/${taskId}`, { formPost: true, loading: true });
    },
    async [actionTypes.workflow.addExecutorsToStep] (store, { instanceId, executorIds }) {
        await axios.put('/workflow_instance/add_executors', { instanceId, executorIds }, { formPost: true, loading: true });
    },
    async [actionTypes.workflow.transfer] (store, { instanceId, taskId, toUserId, remark }) {
        await axios.put('workflow_instance/transfer', { instanceId, taskId, toUserId, remark });
    },
    async [actionTypes.workflow.parseCronExpression] (store, expression) {
        const { data } = await axios.post(`${url}/parse_cron_expression`, { expression });
        return data;
    },
    async [actionTypes.workflow.parseWorkflow] (store, codes) {
        if (_.isString(codes)) {
            codes = [codes];
        }
        const { data } = await axios.post(`${url}/parse_workflow`, codes);
        return data;
    },
    async [actionTypes.workflow.parseUeExpression] (store, expression) {
        const { data } = await axios.post(`${url}/parse_ue_expression`, { expression });
        return data;
    },
});

export default store;
