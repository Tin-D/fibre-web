<template>
    <el-select :value="value"
               :multiple="!onlyGroup && multiple"
               @change="handleValueChange"
               :placeholder="placeholder"
               style="width: 100%;"
               filterable
               :clearable="!readonly"
               :disabled="readonly"
    >
        <el-option v-for="g of groups"
                   :key="g.id"
                   :label="g.name"
                   :value="g.id"
        />
    </el-select>
</template>

<script>
    export default {
        computed: {
            groups () {
                let groups = this.$store.state.group.groups;
                if (!this.allGroups) {
                    groups = _.filter(this.$store.state.group.groups, n => n.only === this.onlyGroup);
                }
                return groups;
            },
        },
        methods: {
            handleValueChange (value) {
                if (!this.readonly) {
                    this.$emit('input', value);
                }
            },
        },
        props: {
            value: {},
            multiple: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '请选择角色',
            },
            onlyGroup: { // 只显示三员分组
                type: Boolean,
                default: false,
            },
            allGroups: { // 显示所有分组（包含三员分组），这个选项的优先级比 onlyGroup 高
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
