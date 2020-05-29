<template>
    <div class="organization-selector">
        <el-row :gutter="0">
            <el-col :span="5" class="orgbox" :style="{height: `${maxHeight+11}px`, overflow: 'auto'}">
                <el-form size="mini">
                    <el-form-item title="模式" class="moshi">
                        <el-radio-group v-model="currentMode">
                            <el-radio-button v-for="(value, key) of displayModes"
                                             :label="key"
                                             :key="key"
                            >
                                {{ value }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>

                <keep-alive>
                    <component ref="tree"
                               :is="currentTree"
                               :org-node-icon-map="orgNodeIconMap"
                               @current-change="(data)=> currentSelectTreeNodeData = data"
                    />
                </keep-alive>
            </el-col>

            <el-col :span="13" class="orgbox" :style="{height:maxHeight+11+'px'}">
                <el-form inline size="mini" class="toolbar" @submit.prevent.native="handleSearch">
                    <el-form-item title="请输入关键字" style="">
                        <el-input placeholder="请输入关键字" v-model.trim="keywords" prefix-icon="el-icon-search" clearable/>
                    </el-form-item>

                    <el-form-item>
                        <el-checkbox label="全局搜索(只能搜索用户)" v-model="searchGlobal"/>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">检索</el-button>
                    </el-form-item>
                </el-form>

                <lan-client-table ref="orgDataTable"
                                  :data="displayTableData"
                                  :max-height="maxHeight-100"
                                  :min-height="maxHeight-100"
                                  :height="maxHeight-100"
                                  :show-operation-column="false"
                                  @selection-change="handleSelectionChange"
                                  @row-click="handleDataTableRowClick"
                                  :default-sort="{prop: 'type'}"
                                  pagination
                                  class="tablebox"
                >
                    <el-table-column
                        type="selection"
                        width="50"
                    />

                    <el-table-column prop="type" label="类别" width="80" sortable>
                        <template slot-scope="{ row }">
                            {{ modes[row.type] }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="name" label="名称" sortable/>

                    <el-table-column prop="email" label="邮箱" width="120" sortable/>

                    <el-table-column prop="phone" label="电话" width="120" sortable/>

                </lan-client-table>
            </el-col>

            <el-col :span="1" class="">
                <div style="position: relative;">
                    <el-button type="text" @click="handleAddSelection(false)" class="orgselectbtnico"
                               style="margin-top:80px;">
                        <i class="el-icon-arrow-right"></i>
                        添加选中
                    </el-button>
                    <el-button type="text" @click="handleAddSelection(true)" class="orgselectbtnico"
                               style="margin-top:50px;">
                        <i class="el-icon-d-arrow-right"></i>
                        添加所有
                    </el-button>
                </div>
            </el-col>
            <el-col :span="5" class="orgbox">
                <el-row :gutter="0">
                    <el-col :span="16" class="orgselected">
                        <div>
                            <span style="font-size: 1.2em; color: #00A2E8;line-height: 32px;"> 选中的项目({{ checkedNodes.length }})</span>
                        </div>
                    </el-col>
                    <el-col :span="8" class="orgselected">
                        <div style="float: right">
                            <el-button size="mini" type="primary" @click.stop.prevent="handleRemoveAllSelected"><i
                                class="el-icon-delete"></i> 清空
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <div :style="{height: `${maxHeight-36}px`, overflowY: 'auto'}" class="orgselectbox">
                    <div v-for="node of checkedNodes" :key="node.id" class="orgseleitem">
                        <i class="fa fa-times" style="cursor: pointer" title="删除" @click="handleRemoveNode(node)"></i>&nbsp;
                        <i :class="orgNodeIconMap[node.type.toLowerCase()]"></i>&nbsp;
                        <a href="#" @click.prevent.stop="">{{ node.name }}</a>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from 'axios';
    import OrgDepartmentTree from './OrgDepartmentTree';
    import OrgPostList from '@/components/common/OrgPostList';
    import OrgGroupTree from '@/components/common/OrgGroupTree';
    import { alertError } from '@/roadhog/alert';
    import LanClientTable from '@/roadhog/LanClientTable';
    import { Pagination } from '@/roadhog/Pagination';

    export default {
        name: 'OrganizationSelector',
        components: {
            LanClientTable,
            'post': OrgPostList,
            'department': OrgDepartmentTree,
            'group': OrgGroupTree,
        },
        created () {
            _.forEach(this.value, n => {
                this.checkedNodes.push({
                    id: n.id,
                    name: n.name,
                    type: n.type,
                });
            });
        },
        data () {
            return {
                checkedNodes: [],
                currentMode: 'department',
                keywords: null,
                searchGlobal: false,
                tableData: [],
                displayTableData: [],
                selectionTableData: [],
                currentSelectTreeNodeData: null,
                currentTree: null,
                orgNodeIconMap: {
                    'department': 'icon iconfont B-baohuduixiangshaixuan',
                    'user': 'icon iconfont B-renyuan',
                    'post': 'icon iconfont B-bmgangwei',
                    'group': 'icon iconfont B-jiaoseguanli',
                },
                modes: {
                    'department': '部门',
                    'user': '用户',
                    'post': '岗位',
                    'group': '角色',
                },
            };
        },
        computed: {
            displayModes () {
                return _.pickBy(this.modes, (value, key) => key !== 'user');
            },
        },
        methods: {
            handleRemoveNode (node) {
                const index = this.checkedNodes.indexOf(node);
                if (index > -1) {
                    this.checkedNodes.splice(index, 1);
                }
            },
            handleRemoveAllSelected () {
                this.checkedNodes = [];
            },
            handleAddSelection (all) {
                const newNodes = all ? _.map(this.displayTableData, n => {
                    return {
                        id: n.id,
                        name: n.name,
                        type: n.type,
                    };
                }) : this.selectionTableData;
                if (newNodes.length === 0) {
                    alertError('没有选中项');
                    return;
                }

                const addNodes = _.differenceBy(newNodes, this.checkedNodes, 'id');
                if (addNodes.length === 0) {
                    return;
                }

                if (this.maxItems > 0 && (addNodes.length + this.checkedNodes.length) > this.maxItems) {
                    alertError(`最多只允许选择 ${this.maxItems} 项`);
                } else {
                    this.checkedNodes.push(...addNodes);
                }
            },
            handleSelectionChange (selectionRows) {
                this.selectionTableData = _.map(selectionRows, n => {
                    return {
                        id: n.id,
                        name: n.name,
                        type: n.type,
                    };
                });
            },
            handleDataTableRowClick (row) {
                this.$refs.orgDataTable.$children[0].$refs.lanBaseTable.toggleRowSelection(row);
            },
            async handleSearch () {
                const keywords = (this.keywords == null || this.keywords === '') ? null : _.trim(this.keywords);
                if (!this.searchGlobal) {
                    this.displayTableData = keywords ? _.filter(this.tableData, n => n.name.includes(keywords)) : this.tableData;
                } else {
                    const pagination = new Pagination({
                        sortField: 'id',
                        sortOrder: 'asc',
                        fullName: keywords,
                    });

                    const { data } = await axios.post('/user/list_users', pagination.query);
                    this.displayTableData = data;
                }
            },
        },
        props: {
            mode: { // 模式：支持 department(部门), user(人员), post(岗位), group(角色)
                type: Array,
                required: true,
            },
            maxHeight: {
                type: Number,
                default: 460,
            },
            maxItems: {
                type: Number,
                default: 0,
            },
            value: {
                type: Array,
                required: true,
            },
        },
        watch: {
            checkedNodes (newValue) {
                this.$emit('input', newValue);
            },
            currentMode: {
                handler (newValue) {
                    this.currentTree = newValue;
                    this.$nextTick(() => {
                        this.currentSelectTreeNodeData = this.$refs.tree.getCurrentNode();
                    });
                },
                immediate: true,
            },
            tableData: {
                handler () {
                    this.keywords = null;
                    this.handleSearch();
                },
                immediate: true,
            },
            async currentSelectTreeNodeData (newValue) {
                const pagination = new Pagination({
                    sortField: 'id',
                    sortOrder: 'asc',
                });
                pagination.setPageSize(0);
                this.tableData = [];

                if (this.mode.includes(this.currentMode) && newValue.children?.length > 0) {
                    const d = _.map(newValue.children, n => {
                        const { children, ...i } = n;
                        return i;
                    });
                    this.tableData.push(...d);
                }

                if (newValue == null) {
                    return;
                } else if (this.currentMode === 'department') {
                    pagination.query.departmentIds = [newValue.id];
                } else if (this.currentMode === 'post') {
                    pagination.query.postIds = [newValue.id];
                } else if (this.currentMode === 'group') {
                    pagination.query.groupIds = [newValue.id];
                }

                if (this.mode.includes('user')) {
                    const { data } = await axios.post('/user/list_users', pagination.query);
                    this.tableData.push(...data);
                }
            },
        },
    };
</script>

<style lang="scss">
    .organization-selector {
        * {
            font-size: 12px;
        }

        .orgbox {
            border: 1px #dddddd solid;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 0px;
            padding: 5px;
            /*margin-right: 3px;*/
        }

        .moshi {

            .el-radio-button__inner {
                width: 70px;
            }
        }

        .el-pagination__sizes {
            display: none !important;
        }

        .el-table__body-wrapper {
            /*max-height:310px !important;*/
        }

        .el-tree {
            height: 370px;
            overflow-y: auto;
        }

        .orgselectbtnico {
            text-align: center;
            width: 50px;
            margin: 0 auto;
            white-space: normal;
            line-height: 1.2;
            color: #999999;

            i {
                font-size: 32px;
                font-weight: bold;
                display: block;
                margin-bottom: 10px;
                color: #2690FA;
            }
        }

        .orgselectbox {
            /*background: #E8F3F6;*/
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            padding: 5px;
        }

        .el-table .cell {
            white-space: nowrap;
        }

        .tablebox {
            /*height:400px;*/
        }

        .orgseleitem {
            padding: 5px 10px;
            /*border:1px #e1e1e1 solid;*/
            border-radius: 5px;

            a {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
</style>
