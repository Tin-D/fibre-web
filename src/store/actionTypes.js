export const actionTypes = {
    common: {
        list: 'list', // 更新列表数据
        add: 'add', // 新增
        edit: 'edit', // 更新
        remove: 'remove', // 删除
        get: 'get', // 获取一条数据,
        checkUnique: 'checkUnique', // 检查重名,
        exportExcel: 'exportExcel', // 导出Excel表
        parseExcel: 'parseExcel', // 读取excel文件
        parseDbf: 'parseDbf', // 读取dbf文件
        downloadImportTemplate: 'downloadImportTemplate', // 下载导入模板
        parseFile: 'parseFile', // 读取文件
        getWebSettings: 'getWebSettings', // 获取网站配置信息
        previewImage: 'previewImage', // 预览图片
        getAttachments: 'getAttachments', // 获取记录的附件
        saveAttachmentTemp: 'saveAttachmentTemp', // 临时保存附件
        getAttachmentBase64: 'getAttachmentBase64', // 获取附件内容，以base64返回
        saveExistsAttachment: 'saveExistsAttachment', // 保存一个已有的附件
        loadGlobalSecureData: 'loadGlobalSecureData', // 加载非匿名用户才能获取的全局数据
        getUniqueId: 'getUniqueId', // 从服务器上获取一个guid
        openNewWindow: 'openNewWindow', // 打开新窗口并导航
    },
    dictionaryCode: {
        forceRefresh: 'forceRefresh', // 强制刷新缓存
    },
    auth: {
        login: 'login',
        logout: 'logout',
        resetMyPassword: 'resetMyPassword',
        getCurrentUser: 'getCurrentUser',
    },
    user: {
        resetPassword: 'resetPassword', // 重置密码
        resetMyPassword: 'resetMyPassword', // 修改自己的密码
        findPostUsers: 'findPostUsers',
        findDepartmentUsers: 'findDepartmentUsers',
        importUsers: 'importUsers', // 批量导入用户
    },
    group: {
        findGroupUsers: 'findGroupUsers', // 获取角色组下的所有人
        addUsersToGroup: 'addUsersToGroup', // 将人员加入分组
        removeUsersFromGroup: 'removeUsersFromGroup', // 将人员移出分组
    },
    department: {
        findDepartmentUsers: 'findDepartmentUsers',
        findDepartmentChildren: 'findDepartmentChildren',
    },
    workflow: {
        export: 'export',
        import: 'import',
        checkRecorderCreatorClassName: 'checkRecorderCreatorClassName',
        getTasks: 'getTasks',
        getInstances: 'getInstances',
        getInstanceStatus: 'getInstanceStatus',
        saveAndStartWorkflow: 'saveAndStartWorkflow', // 保存并启动流程，要在各自模块的controller中自己实现
        doTask: 'doTask', // 执行任务
        addExecutorsToStep: 'addExecutorsToStep', // 加签人员
        forceGotoStep: 'forceGotoStep', // 强行跳转到指定步骤
        cancelTask: 'cancelTask', // 取消任务，会导致流程挂起
        transfer: 'transfer', // 转办任务
        parseCronExpression: 'parseCronExpression', // 解析cron表达式，返回下10次的执行结果
        parseWorkflow: 'parseWorkflow', // 从code解析出流程的基本信息
        parseUeExpression: 'parseUeExpression', // 解析组织架构查找表达式
    },
    patrolExcel: {
        findByEquipmentTypeId: 'findByEquipmentTypeId', // 按照设备类型查找巡检表格模板
    },
    maintenanceLevel: {
        findByEquipmentTypeId: 'findByEquipmentTypeId',
    },
    task: {
        findDetails: 'findDetails', // 查询任务详情
    },
};
