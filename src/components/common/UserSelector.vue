<template>
    <div>
        <div v-if="isLoading">
            <i class="fa fa-spin fa-spinner"></i>
        </div>
        <el-select v-else
                   :value="value"
                   :multiple="multiple"
                   @change="handleValueChange"
                   :placeholder="placeholder"
                   style="width: 100%;"
                   filterable
        >
            <el-option v-for="u of users"
                       :key="u.id"
                       :label="`${u.fullName}(${u.username})`"
                       :value="u.id"
            >
                <el-row>
                    <el-col :span="8">
                        {{ u.fullName }} ({{ u.username }})
                        <i class="fa fa-lock" style="color: red" v-if="u.locked || !u.enable"></i>
                    </el-col>
                    <el-col :span="8">
                        <i class="fa fa-phone"></i> {{ u.phone }}
                    </el-col>
                    <el-col :span="8">
                        <i class="fa fa-envelope-o"></i> {{ u.email }}
                    </el-col>
                </el-row>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        created () {
            this.load();
        },
        data () {
            return {
                isLoading: true,
                users: [],
            };
        },
        methods: {
            async load () {
                const { data } = await axios.get('/user/list_options');
                this.users = data;
                this.isLoading = false;
            },
            handleValueChange (value) {
                this.$emit('input', value);
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
                default: '请选择用户',
            },
        },
    };
</script>
