<template>
    <el-select @change="handleChange"
               clearable
               multiple
               placeholder="请选择运维表格"
               style="width: 100%;"
               v-model="value">
        <el-option :key="item.id"
                   :label="item.name"
                   :value="item.id"
                    v-for="item in options">
        </el-option>
    </el-select>
</template>

<script>
    import axios from 'axios';

    export default {
        data () {
            return {
                options: [],
                value: null,
            };
        },
        created () {
            if (this.values) {
                this.value = this.values;
            }
        },
        methods: {
            handleChange (value) {
                this.$emit('input', value);
            },
        },
        watch: {
            equipmentTypeId: {
                async handler (newVal) {
                    if (newVal) {
                        this.value = null;
                        const { data } = await axios.get(`/built_in_template/find_by_equipment_type_id/${newVal}`);
                        this.options = data;
                    }
                },
                immediate: true,
            },
        },
        props: {
            equipmentTypeId: {
                type: String,
            },
            values: {
                type: Array,
            },
        },
    };
</script>
