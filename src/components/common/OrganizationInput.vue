<template>
    <div class="el-input el-input--mini el-input--suffix"
         tabindex="1"
         @dblclick="OrganizationSelectorDialog.handleEdit"
         :title="this.readonly ? null : '双击打开人员选择器'"
    >
        <div v-if="isLoading">
            <i class="fa fa-spinner fa-spin"></i>
        </div>
        <div v-else>
            <select-input :data.sync="selectItems"
                          :readonly="readonly"
                          :placeholder="placeholder"
                          :query-search="handleSearchKeywords"
                          @select="handleSelectSearchResult"
            />

            <organization-selector-dialog v-if="OrganizationSelectorDialog.show"
                                          @close="OrganizationSelectorDialog.handleClose"
                                          :mode="mode"
                                          :max-items="maxItems"
                                          :value="selectItems"
            />
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import SelectInput from './SelectInput';
    import OrganizationSelectorDialog from '@/components/common/OrganizationSelectorDialog';
    import { alertError } from '@/roadhog/alert';

    export default {
        components: { OrganizationSelectorDialog, SelectInput },
        data () {
            return {
                isLoading: false,
                hasParseInitData: false,
                OrganizationSelectorDialog: {
                    show: false,
                    id: null,
                    handleClose: (returnValues) => {
                        this.OrganizationSelectorDialog.show = false;
                        this.OrganizationSelectorDialog.id = null;
                        if (returnValues != null) {
                            this.selectItems = returnValues;
                        }
                    },
                    handleEdit: async (row) => {
                        if (this.readonly) {
                            return;
                        }
                        this.hasParseInitData = true;
                        this.OrganizationSelectorDialog.show = true;
                        this.OrganizationSelectorDialog.id = row.id;
                    },
                },
                selectItems: [],
            };
        },
        methods: {
            async handleSearchKeywords (keywords, cb) {
                if (!keywords || keywords.length < 1) {
                    cb([]);
                } else {
                    const { data } = await axios.post('/workflow/search_executor', {
                        types: _.map(this.mode, n => _.upperFirst(n)),
                        keywords: keywords,
                    });
                    _.forEach(data, n => {
                        n.value = n.name;
                        return true;
                    });
                    cb(data);
                }
            },
            handleSelectSearchResult (item) {
                if (this.maxItems > 0 && this.selectItems.length === this.maxItems) {
                    alertError(`最多只允许选择${this.maxItems}项`);
                    return;
                }
                const any = _.find(this.selectItems, n => n.id === item.id);
                if (!any) {
                    this.selectItems.push(item);
                }
            },
        },
        watch: {
            value: {
                async handler () {
                    // 加载初始化的选项
                    try {
                        if (this.value.length > 0) {
                            let ids;
                            if (this.value[0].id) {
                                ids = _.map(this.value, 'id');
                            } else {
                                ids = this.value;
                            }

                            const existsIds = _.map(this.selectItems, 'id');

                            const newIds = _.difference(ids, existsIds);
                            if (newIds.length > 0) {
                                this.isLoading = true;
                                const { data } = await axios.post('/workflow/parse_executor', newIds);
                                this.selectItems.push(...data);
                            }
                        }
                    } finally {
                        this.isLoading = false;
                        this.hasParseInitData = true;
                    }
                },
                immediate: true,
            },
            selectItems (newValue) {
                this.$emit('input', _.map(newValue, 'id'));
            },
        },
        props: {
            mode: { // 模式：支持 department(部门), user(人员), post(岗位), group(角色)
                type: Array,
                required: true,
            },
            value: {
                type: Array,
                required: true,
            },
            maxItems: {
                type: Number,
                default: 0,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '输入查询或双击选择',
            },
        },
    };
</script>
