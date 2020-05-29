<template>
    <el-form :model="form"
             label-width="80px"
             ref="form"
             size="mini"
    >
        <el-form-item label="配电柜" prop="powerDistributionCabinet"/>
    </el-form>
</template>

<script>
    /**
     * 设备仓库新增编辑配电柜扩展信息
     */
    export default {
        data () {
            return {
                form: {},
            };
        },
    };
</script>
