export const WorkflowTaskStatus = {
    Todo: 'Todo',
    Finish: 'Finish',
    Overtime: 'Overtime',
    Cancel: 'Cancel',
};

const WorkflowTaskStatusText = {
    Todo: '待办',
    Finish: '已办',
    Overtime: '超时',
    Cancel: '取消',
};

export const renderWorkflowTaskStatus = (value) => {
    return WorkflowTaskStatusText[value] || value;
};

export const WorkflowAction = {
    Start: 'Start',
    Agree: 'Agree',
    Reject: 'Reject',
    RejectToStarter: 'RejectToStarter',
    Stop: 'Stop',
    Cancel: 'Cancel',
};

export const WorkflowActionText = {
    Start: '启动流程',
    Agree: '同意',
    Reject: '不同意',
    RejectToStarter: '退回发起者',
    Stop: '终止',
    Cancel: '取消',
};

export const renderWorkflowAction = (value) => {
    return WorkflowActionText[value] || value;
};

export const WorkflowInstanceStatus = {
    Running: 'Running',
    Finish: 'Finish',
    Stop: 'Stop',
};

export const WorkflowInstanceStatusText = {
    Running: '审批中',
    Finish: '已结束',
    Stop: '挂起',
};

export const renderWorkflowInstanceStatus = (value) => {
    return WorkflowInstanceStatusText[value] || value;
};

export const WorkflowRecorderStatus = {
    NotStart: 'NotStart', // 新创建的，还没启动流程的，这个时候这条记录还没有和工作流引擎发生关系
    Todo: 'Todo', // 待办
    AlreadyDone: 'AlreadyDone', // 已办，但是流程实例还未结束
    Finish: 'Finish', // 办结
};

export const WorkflowStepType = {
    Blank: 'Blank',
    Serial: 'Serial',
    Parallel: 'Parallel',
    OneOf: 'OneOf',
};

export const WorkflowStepTypeText = {
    Blank: '空',
    Serial: '串行',
    Parallel: '并行',
    OneOf: '共同执行',
};

export const renderWorkflowStepType = (value) => {
    return WorkflowStepTypeText[value] || value;
};

export const roles = {
    WorkflowAdmin: 'WorkflowAdmin', // 流程管理员
    gly: 'gly', // 系统管理员
    sjy: 'sjy', // 审计员
    aqy: 'aqy', // 安全员
    dayin: 'dayin', // 打印人员
};
