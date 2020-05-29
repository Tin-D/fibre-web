import Vue from 'vue';
import { mapState } from 'vuex';
import { getterTypes } from '@/store/getterTypes';
import { renderUnixTimeStamp } from '@/roadhog/utils';
import { renderWorkflowAction, renderWorkflowInstanceStatus, roles } from '@/store/enum';
import dayjs from 'dayjs';
import { checkRole } from '@/router';

Vue.mixin({
    data () {
        return {
            roles: roles,
        };
    },
    computed: {
        ...mapState({
            currentUser: (state) => state.auth.currentUser,
            enums: (state) => state.global.enums,
            enumNames: (state) => state.global.enumNames,
        }),
    },
    methods: {
        getAbsoluteHeight (el) {
            if (!el) {
                return 0;
            }

            const styles = window.getComputedStyle(el);
            const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
            return Math.ceil(el.offsetHeight + margin);
        },
        renderIdNameColumnRow (row, column) {
            let value = row[column.property];
            if (value == null) {
                return null;
            }

            if (!_.isArray(value)) {
                value = [value];
            }

            const result = [];
            _.forEach(value, (i) => {
                result.push(i.name);
            });
            return result.join('; ');
        },
        renderDictionaryCodeRow (row, column) {
            let value = row[column.property];
            if (value == null) {
                return null;
            }

            if (!_.isArray(value)) {
                value = [value];
            }

            const result = [];
            _.forEach(value, (i) => {
                const code = this.$store.getters[`dictionaryCode/${getterTypes.common.getById}`](i);
                result.push(code ? code.name : 'unknown');
            });

            return result.join('; ');
        },
        renderDictionaryCodeRowForPath (row, column) {
            const value = row[column.property];
            if (value == null) {
                return null;
            }
            const parents = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getParentsById}`](value);
            // 一般来说，根节点是大类的分类，不需要展示
            if (parents.length > 0) {
                parents.shift();
            }
            return parents.map(i => i.name).join('/');
        },
        renderBooleanRow (row, column) {
            const value = row[column.property];
            return value ? '是' : '否';
        },
        renderBoolean (value) {
            return value ? '是' : '否';
        },
        renderReversedBooleanRow (row, column) {
            const value = row[column.property];
            return value ? '否' : '是';
        },
        renderUnixTimestampRow (row, column) {
            const value = row[column.property];
            return renderUnixTimeStamp(value);
        },
        getDictionaryCode (id) {
            return this.$store.getters[`dictionaryCode/${getterTypes.common.getById}`](id);
        },
        getDictionaryCodeByTypeAndName (type, name) {
            if (type == null || name == null) {
                return null;
            }

            const codes = this.$store.getters[`dictionaryCode/${getterTypes.dictionaryCode.getByType}`](type);
            return codes.find(n => n.name === name);
        },
        renderDictionaryCodeName (id) {
            return this.getDictionaryCode(id)?.name;
        },
        renderEnum (enumName, value) {
            return this.enums[enumName].getText(value);
        },
        renderDateRow (row, column) {
            const value = row[column.property];
            return this.renderDate(value);
        },
        renderDate (value, defaultValue) {
            if (!value) {
                return defaultValue;
            }
            return dayjs(value).format('YYYY-MM-DD');
        },
        renderDateTimeRow (row, column) {
            const value = row[column.property];
            return this.renderDateTime(value);
        },
        renderDateTime (value, defaultValue = null) {
            if (!value) {
                return defaultValue;
            }
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
        },
        checkRole (roles) {
            return checkRole(this.currentUser, roles);
        },
        renderWorkflowInstanceStatus,
        renderWorkflowInstanceStatusRow (row, column) {
            return renderWorkflowInstanceStatus(row[column.property]);
        },
        renderWorkflowAction,
        renderWorkflowActionRow (row, column) {
            return renderWorkflowAction(row[column.property]);
        },
    },
});
