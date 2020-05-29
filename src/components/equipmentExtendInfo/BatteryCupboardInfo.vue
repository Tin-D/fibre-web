<template>
    <el-form :model="form"
             label-width="80px"
             ref="form"
             size="mini"
    >
        <el-form-item label="电池柜" prop="batteryCupboard"/>
    </el-form>
</template>

<script>
    /**
     * 设备仓库新增编辑电池柜扩展信息
     */
    export default {
        data () {
            return {
                form: {},
            };
        },
    };
</script>
