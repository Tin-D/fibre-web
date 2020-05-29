<template>
    <curd-index store-module-name="brand"
                state-list-property="brands"
                :default-sort="{prop: 'name', order: 'ascending'}"
                :filter-method="['name', 'remark']"
                :editor="brandEditor"
                pagination
    >

        <el-table-column prop="name" label="名称" sortable/>

        <el-table-column :formatter="renderDictionaryCodeRow" label="设备类型" prop="equipmentTypeId" sortable/>

        <el-table-column prop="orderNumber" label="排序" sortable/>

        <el-table-column prop="remark" label="备注" sortable/>

    </curd-index>
</template>

<script>
    import CurdIndex from '@/components/common/CurdIndex';
    import brandEditor from '@/components/brand/BrandEditor';

    export default {
        components: { CurdIndex },
        data () {
            return {
                brandEditor,
            };
        },
    };
</script>
