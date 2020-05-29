<template>
    <el-tree ref="tree"
             :props="props"
             :data="treeData"
             node-key="id"
             :default-expanded-keys="expandKeys"
             highlight-current
             @current-change="handleCurrentChange"
             :expand-on-click-node="false"
    >
        <span slot-scope="{ node }" @dblclick="toggleNodeExpand(node)" style="width: 100%; user-select: none;">
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
                expandKeys: [],
                props: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'leaf',
                },
            };
        },
        watch: {
            treeData: {
                handler (newValue) {
                    if (newValue && newValue.length > 0) {
                        this.expandKeys.push(newValue[0].id);
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(newValue[0].id);
                            this.handleCurrentChange(newValue[0], null);
                        });
                    }
                },
                immediate: true,
            },
        },
        computed: {
            treeData () {
                return this.$store.getters[`department/${getterTypes.department.getTreeData}`];
            },
        },
        methods: {
            handleCurrentChange (data, node) {
                this.$emit('current-change', data, node);
            },
            getCurrentNode () {
                return this.$refs.tree.getCurrentNode();
            },
            toggleNodeExpand (node) {
                node.expanded = !node.expanded;
            },
        },
        props: {
            rootId: { // 从哪个部门开始展示，null就是整个组织架构树
                type: String,
                default: null,
            },
            orgNodeIconMap: {
                type: Object,
                required: true,
            },
        },
    };
</script>
