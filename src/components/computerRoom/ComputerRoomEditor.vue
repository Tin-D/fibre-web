<template>
    <lan-form-dialog
        ref="lanDialog"
        :title="title"
        @submit="handleSubmit"
        @close="handleClose"
        :is-loading="isLoadingFormData"
    >

        <el-form v-if="!isLoadingFormData"
                 ref="form"
                 :model="form"
                 :rules="rules"
                 label-width="100px"
                 size="mini"
        >
            <el-form-item prop="name" label="名称">
                <el-input label="名称" v-model="form.name"/>
            </el-form-item>

            <el-form-item prop="contactsName" label="联系人名称">
                <el-input label="联系人名称" v-model="form.contactsName"/>
            </el-form-item>

            <el-form-item prop="contactsPhone" label="联系人电话">
                <el-input label="联系人电话" v-model="form.contactsPhone"/>
            </el-form-item>

            <el-form-item prop="address" label="地址">
                <el-input label="地址" v-model="form.address"/>
            </el-form-item>

            <el-form-item prop="orderNumber" label="排序">
                <el-input label="排序" v-model="form.orderNumber"/>
            </el-form-item>

            <el-form-item prop="customerId" label="所属客户">
                <el-select v-model="form.customerId" clearable filterable style="width: 100%;">
                    <el-option v-for="c of customers"
                               :key="c.id"
                               :value="c.id"
                               :label="c.name"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="其他资料">
                <file-list v-model="form.attachments" :recorder-id="form.attachmentListToken"/>
            </el-form-item>

        </el-form>

    </lan-form-dialog>
</template>

<script>
    import axios from 'axios';
    import { formPageMixin } from '@/roadhog/formPageMixin';
    import { dialogMixin } from '@/roadhog/dialogMixin';
    import * as validators from '@/roadhog/validators';
    import { models } from '@/store/models';
    import FileList from '@/components/common/FileList';

    const storeModuleName = models.computerRoom;

    export default {
        components: { FileList },
        mixins: [formPageMixin(storeModuleName), dialogMixin()],
        data () {
            return {
                partTitle: '机房',
                customers: null,
            };
        },
        async created () {
            const { data } = await axios.get('customer');
            this.customers = _.sortBy(data, ['name']);
        },
        methods: {
            initForm () {
                return {
                    name: {
                        rules: [validators.required()],
                    },
                    contactsName: {},
                    contactsPhone: {},
                    address: {},
                    orderNumber: {
                        rules: [validators.isNumber()],
                    },
                    customerId: {},
                    attachments: {
                        default: [],
                    },
                    attachmentListToken: {},
                };
            },
        },
    };
</script>
