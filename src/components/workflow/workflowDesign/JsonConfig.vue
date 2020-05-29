<template>
    <div>
        <el-form size="mini">
            <el-form-item>
                <el-button type="primary" @click="accept">应用JSON配置</el-button>
            </el-form-item>
        </el-form>

        <el-input type="textarea"
                  :rows="20"
                  placeholder="流程配置信息"
                  v-model="jsonConfig"
        />
    </div>
</template>

<script>
    export default {
        data () {
            return {
                jsonConfig: null,
            };
        },
        methods: {
            read () {
                this.jsonConfig = JSON.stringify(this.configs, null, 2);
            },
            accept () {
                this.$emit('update:configs', JSON.parse(this.jsonConfig));
            },
            validate () {
                return true;
            },
        },
        props: {
            configs: {
                type: Object,
                required: true,
            },
        },
    };
</script>
