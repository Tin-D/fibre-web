<template>
    <el-tree ref="tree"
             :props="props"
             :data="treeData"
             node-key="id"
             default-expand-all
             highlight-current
             @current-change="handleCurrentChange"
             :expand-on-click-node="false"
             current-node-key="__root__group__"
    >
         <span slot-scope="{ node }">
            <i :class="orgNodeIconMap[node.data.type.toLowerCase()]"></i>&nbsp;
            <span>{{ node.label }}</span>
        </span>

    </el-tree>
</template>

<script>
    import { actionTypes } from '@/store/actionTypes';

    export default {
        created () {
            this.$store.dispatch(`group/${actionTypes.common.list}`);
        },
        data () {
            return {
                props: {
                    label: 'name',
                    children: 'children',
                },
            };
        },
        computed: {
            treeData () {
                const groups = this.$store.state.group.groups;
                return [
                    {
                        id: '__root__group__',
                        name: '角色',
                        type: 'group',
                        children: _.map(groups, n => {
                            return {
                                id: n.id,
                                name: n.name,
                                type: 'group',
                            };
                        }),
                    },
                ];
            },
        },
        methods: {
            handleCurrentChange (data, node) {
                this.$emit('current-change', data, node);
            },
            getCurrentNode () {
                return this.$refs.tree.getCurrentNode();
            },
        },
        props: {
            orgNodeIconMap: {
                type: Object,
                required: true,
            },
        },
    };
</script>
