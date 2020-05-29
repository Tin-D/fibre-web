<template>
    <el-tree ref="tree"
             :props="props"
             :data="treeData"
             node-key="id"
             default-expand-all
             highlight-current
             @current-change="handleCurrentChange"
             :expand-on-click-node="false"
             current-node-key="__root__post__">

        <span slot-scope="{ node }">
            <i :class="orgNodeIconMap[node.data.type.toLowerCase()]"></i>&nbsp;
            <span>{{ node.label }}</span>
        </span>

    </el-tree>
</template>

<script>
    import { getterTypes } from '@/store/getterTypes';

    export default {
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
                const posts = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getChildrenTreeByParentCode}`]('Post');
                return [
                    {
                        id: '__root__post__',
                        name: '岗位',
                        type: 'post',
                        children: _.map(posts, n => {
                            return {
                                id: n.id,
                                name: n.name,
                                type: 'post',
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
