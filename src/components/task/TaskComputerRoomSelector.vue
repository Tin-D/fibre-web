<template>
    <el-cascader
        :options="computerRooms"
        :props="{value: 'id', label: 'name', children: 'children', disabled: 'disabled', emitPath: false, multiple: true}"
        clearable
        filterable
        :show-all-levels="false"
        placeholder="请选择客户及机房"
        v-model="computerRoomId"
    />
</template>

<script>
    export default {
        data () {
            return {
                computerRoomId: null,
            };
        },
        watch: {
            computerRoomId (newValue) {
                this.$emit('computerRoomsId', newValue);
            },
        },
        props: {
            computerRooms: {
                type: Array,
                required: true,
            },
        },
    };
</script>
