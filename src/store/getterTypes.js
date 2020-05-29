export const getterTypes = {
    common: {
        getById: 'getById',
    },
    dictionaryCode: {
        getByCode: 'getByCode', // 根据代码获取
        getCodeTree: 'getCodeTree', // 获取代码树
        getChildrenTreeByParentId: 'getChildrenTreeByParentId', // 根据父节点的id，获取直接子节点
        getChildrenTreeByParentCode: 'getChildrenTreeByParentCode', // 根据父节点code，获取直接子节点
        getParentsById: 'getParentsById', // 获取指定节点的所有父节点
        getParentsByCode: 'getParentsByCode', // 获取指定节点的所有父节点
    },
    department: {
        getTreeData: 'getTreeData',
        getTreeDataByRoot: 'getTreeDataByRoot',
    },
    brandModel: {
        renderBrandModel: 'renderBrandModel', // 输出品牌型号
    },
};
