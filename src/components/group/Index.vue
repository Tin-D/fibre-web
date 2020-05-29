<template>
    <curd-index store-module-name="group"
                state-list-property="groups"
                :default-sort="{prop: 'only', order: 'descending'}"
                :filter-method="['name']"
                :editor="GroupEditor"
                :can-edit="row=>row.editable"
                :can-remove="row=>row.editable"
                :show-operation-column="!readonly"
                :display-add-button="!readonly"
                pagination
    >

        <el-table-column type="index" width="55"/>

        <el-table-column prop="name" label="名称" sortable/>

        <el-table-column prop="code" label="代码" sortable/>

        <el-table-column prop="only" label="三员角色" sortable :formatter="renderBooleanRow"/>

        <el-table-column prop="remark" label="说明"/>

    </curd-index>
</template>

<script>
    import CurdIndex from '@/components/common/CurdIndex';
    import GroupEditor from '@/components/group/GroupEditor';

    export default {
        components: { CurdIndex },
        computed: {
            readonly () {
                return !this.checkRole(this.roles.gly);
            },
        },
        data () {
            return {
                GroupEditor,
            };
        },
    };
</script>
