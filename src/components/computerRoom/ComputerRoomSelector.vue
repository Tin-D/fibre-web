<template>
    <el-cascader
        :value="value"
        :placeholder="placeholder"
        @change="handleChange"
        :options="options"
        :props="{value: 'id', label: 'name', children: 'children', disabled: 'disabled', emitPath: emitPath, multiple: multiple}"
        clearable
        filterable
        :show-all-levels="showAllLevels"
        :disabled="readonly"
        style="width: 100%;">
    </el-cascader>
</template>

<script>
    /**
     * 此组件为cascader机房级联选择
     * 先选择客户  再选择机房
     */
    import axios from 'axios';

    export default {
        data () {
            return {
                customers: [],
                computerRooms: [],
            };
        },
        computed: {
            options () {
                const res = [];
                _.forEach(_.orderBy(this.customers, ['name'], ['desc']), i => {
                    const item = {
                        id: i.id,
                        name: i.name,
                        children: _.chain(this.computerRooms).orderBy(['orderNumber'], ['asc']).filter(n => n.customerId === i.id).map(e => ({
                            id: e.id,
                            name: e.name,
                        })).value(),
                    };
                    res.push(item);
                });
                return res.filter(i => i.children.length > 0);
            },
        },
        async created () {
            const customers = await axios.get('/customer');
            const computerRooms = await axios.get('/computer_room');
            this.customers = customers.data;
            this.computerRooms = computerRooms.data;
            if (this.id) {
                this.options.forEach(i => {
                    i.disabled = !!(this.value.length > 0 && i.id !== this.value[0][0]);
                });
                const res = this.multipleReturnVal(this.value);
                this.$emit('returnVal', res);
            }
        },
        methods: {
            handleChange (value) {
                // 任务管理新增中机房多选参数回传
                if (this.emitPath) {
                    this.options.forEach(i => {
                        i.disabled = !!(value.length > 0 && i.id !== value[0][0]);
                    });
                    const res = this.multipleReturnVal(value);
                    this.$emit('returnVal', res);
                }

                this.$emit('input', value);
            },
            customer (value) { // 任务管理新增中将已选的客户数据去重整理
                const customer = [];
                const res = [];

                value.forEach(i => {
                    customer.push({
                        id: i[0],
                    });
                });
                const customers = _.unionBy(customer, 'id');

                customers.forEach(e => {
                    res.push(_.filter(this.customers, i => {
                        return i.id === e.id;
                    }));
                });

                return res;
            },
            computerRoom (value) { // 任务管理新增中将已选的机房数据整理
                const computerRoom = [];
                const res = [];

                value.forEach(i => {
                    computerRoom.push({
                        id: i[1],
                    });
                });

                computerRoom.forEach(e => {
                    res.push(_.filter(this.computerRooms, i => {
                        return i.id === e.id;
                    }));
                });

                return res;
            },
            multipleReturnVal (value) { // 任务管理新增中将已选的客户及机房过滤合并
                const a = this.customer(value);
                const b = this.computerRoom(value);
                const res = [];
                _.forEach(_.orderBy(a, ['name'], ['desc']), i => {
                    const item = {
                        id: i[0].id,
                        name: i[0].name,
                        children: _.chain(b).orderBy(['orderNumber'], ['asc']).filter(n => n[0].customerId === i[0].id).map(e => ({
                            id: e[0].id,
                            name: e[0].name,
                        })).value(),
                    };
                    res.push(item);
                });
                return res;
            },
        },
        props: {
            value: {
                type: [String, Array],
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '请选择机房(可输入搜索)',
            },
            showAllLevels: {
                type: Boolean,
                default: false,
            },
            id: {
                type: String,
            },
            emitPath: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
