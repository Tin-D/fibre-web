<template>
    <lan-form-dialog
        ref="lanDialog"
        title="维护等级"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="false"
    >
        <el-select v-model="selectedValue"
                   :placeholder="placeholder"
                   style="width: 100%"
        >
            <el-option v-for="o of options"
                       :key="o.id"
                       :value="o.id"
                       :label="o.name"
            />
        </el-select>

    </lan-form-dialog>
</template>

<script>
    /**
     * 此组件为任务新增、编辑后选中客户及机房后添加设备选中后提交选择巡检表格模板select
     */
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import { models } from '@/store/models';
    import { actionTypes } from '@/store/actionTypes';
    import { alertError } from '@/roadhog/alert';

    export default {
        mixins: [dialogMixin()],
        async created () {
            this.selectedValue = this.value;
            this.options = _.orderBy(await this.$store.dispatch(`${models.maintenanceLevel}/${actionTypes.maintenanceLevel.findByEquipmentTypeId}`, this.equipmentTypeId), 'name');
        },
        data () {
            return {
                options: [],
                selectedValue: this.multiple ? [] : null,
            };
        },
        methods: {
            handleSubmit () {
                if (this.selectedValue == null || this.selectedValue.length === 0) {
                    alertError('请选择模板');
                    return;
                }

                /**
                 * 将选中设备进行filter，若是多选判断this.options是否为数组再将其过滤并map取出想要的属性
                 */
                const result = this.options
                    .filter(i => this.selectedValue === i.id)
                    .map(i => ({
                        id: i.id,
                        name: i.name,
                    }));
                /**
                 * 将result（选中过滤后的模板数据）传回EquipmentSelector
                 */
                this.closeDialog(result[0]);
            },
        },
        props: {
            equipmentTypeId: {
                type: String,
                required: true,
            },
            placeholder: {
                type: String,
                default: '请选择维护等级',
            },
        },
    };
</script>
