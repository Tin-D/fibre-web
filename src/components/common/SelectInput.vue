<template>
    <div class="g-multiselect el-select el-input__inner">
        <el-tag :closable="!readonly" size="mini" v-for="v of data" :key="v.id" @close="handleClose(v)">
            {{ v.name }}
        </el-tag>
        <el-autocomplete type="text"
                         class="g-multiselect-input"
                         :placeholder="placeholder"
                         :fetch-suggestions="handleFetchSuggestions"
                         v-model="keywords"
                         @select="handleSelect"
                         clearable
                         v-if="!readonly"
        />
        <i class="icon iconfont B-bm-bumen Mselect"></i>
    </div>
</template>

<script>
    export default {
        name: 'SelectInput',
        data () {
            return {
                keywords: null,
            };
        },
        methods: {
            handleClose (item) {
                const index = this.data.indexOf(item);
                if (index > -1) {
                    this.data.splice(index, 1);
                }
            },
            handleSelect (item) {
                this.$emit('select', item);
                this.keywords = null;
            },
            handleFetchSuggestions (queryString, cb) {
                if (this.querySearch) {
                    this.querySearch(queryString, cb);
                } else {
                    cb([]);
                }
            },
        },
        props: {
            data: {
                type: Array,
                required: true,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '输入查询或双击选择',
            },
            querySearch: {
                type: Function,
            },
        },
    };
</script>

<style lang="scss">
    .g-multiselect {
        padding: 0px;
        position: relative;
        border: 1px #dcdfe6 solid;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: auto !important;
        min-height: 28px;
        line-height: 24px;
        outline: 0;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
        flex-grow: 1;
        user-select: none;

        .el-input {
            height: 20px;

            input {
                padding: 0;
                height: 20px;
                line-height: 20px;
                border: 0px #ffffff solid;
                min-width: 150px;
                width: 150px !important;
            }
        }

        .g-multiselect-input {
            border-width: 0;
            padding: 0px 5px;
            margin-left: 5px;
            outline: 0;

            &::-webkit-input-placeholder {
                color: #cccccc
            }

            /* 使用webkit内核的浏览器 */
            &:-moz-placeholder {
                color: #cccccc
            }

            /* Firefox版本4-18 */
            &::-moz-placeholder {
                color: #cccccc
            }

            /* Firefox版本19+ */
            &:-ms-input-placeholder {
                color: #cccccc
            }

            font-size: 12px;
        }

        .Mselect {
            position: absolute;
            top: 0px;
            right: 1px;
            font-size: 24px;
            color: #999999;

        }

        .el-form--inline .g-multiselect {
            width: 200px;
        }

        i.g-m-close {
            float: right;
            margin-top: 3px !important;
            margin-right: 3px !important;
            line-height: 20px;
        }

        .el-select .el-select__caret {
            color: #c0c4cc;
            font-size: 14px;
            -webkit-transition: -webkit-transform .3s;
            transition: -webkit-transform .3s;
            transition: transform .3s;
            transition: transform .3s, -webkit-transform .3s;
            transition: transform .3s, -webkit-transform .3s;
            -webkit-transform: rotateZ(180deg);
            transform: rotateZ(180deg);
            cursor: pointer;
        }

        .el-form--inline {
            .el-date-editor--daterange.el-input__inner {
                width: 410px;
            }

            .el-input--mini .el-input__inner {
                width: 200px;
            }

            .vue-treeselect {
                width: 200px !important;
            }
        }
    }
</style>
