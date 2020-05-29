<template>
    <curd-index store-module-name="workflow"
                state-list-property="workflows"
                :editor="WorkflowEditor"
                :operation-buttons="buttons"
                :operation-column-width="300"
                :default-sort="{prop: 'name', order: 'ascending'}"
                :filter-method="['name', 'code']"
    >
        <template slot="toolbar">
            <el-form-item>
                <input ref="btnFile"
                       type="file"
                       @change="handleFileChange"
                       accept=".json,application/json"
                       style="display: none"
                />
                <el-button size="mini" icon="el-icon-upload2" @click="$refs.btnFile.click()">导入</el-button>
            </el-form-item>
        </template>

        <el-table-column type="index" width="55"/>

        <el-table-column prop="name" label="名称"/>

        <el-table-column prop="code" label="代码"/>
    </curd-index>
</template>

<script>
    import CurdIndex from '@/components/common/CurdIndex';
    import WorkflowEditor from '@/components/workflow/workflowDesign/WorkflowEditor';
    import { actionTypes } from '@/store/actionTypes';
    import { generateFileJson } from '@/roadhog/utils';

    export default {
        components: { CurdIndex },
        data () {
            return {
                WorkflowEditor,
                buttons: [{
                    type: 'default',
                    icon: 'el-icon-download',
                    text: '导出',
                    handler: (row) => this.$store.dispatch(`workflow/${actionTypes.workflow.export}`, row.id),
                }],
            };
        },
        methods: {
            async handleFileChange (e) {
                const files = e.target.files;

                if (!files || files.length === 0) {
                    return;
                }

                const jsonFile = await generateFileJson(files[0]);
                e.target.value = '';

                await this.$store.dispatch(`workflow/${actionTypes.workflow.import}`, jsonFile);
                await this.$store.dispatch(`workflow/${actionTypes.common.list}`);
            },
        },
    };
</script>
