export const dialogAutoHeightTableMixin = (tableHeightProperties) => {
    if (tableHeightProperties == null) {
        tableHeightProperties = ['tableHeight'];
    } else if (_.isString(tableHeightProperties)) {
        tableHeightProperties = [tableHeightProperties];
    }

    return {
        mounted () {
            this.$nextTick(() => {
                const dialogHeight = this.getAbsoluteHeight(this.$el);
                const headerHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('el-dialog__header')[0]);
                const footerHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('el-dialog__footer')[0]);

                const toolbarHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('toolbar')[0]);
                const tableHeight = dialogHeight - headerHeight - footerHeight - toolbarHeight - 60; // el-dialog__body 有上下 padding 各30
                tableHeightProperties.forEach((n) => {
                    this[n] = tableHeight;
                    return true;
                });
            });
        },
    };
};

export const autoHeightTableMixin = (tableHeightProperties) => {
    if (tableHeightProperties == null) {
        tableHeightProperties = ['tableHeight'];
    } else if (_.isString(tableHeightProperties)) {
        tableHeightProperties = [tableHeightProperties];
    }

    return {
        watch: {
            contentHeight: {
                handler () {
                    this.resize();
                },
                immediate: true,
            },
        },
        computed: {
            contentHeight () {
                return this.$store.state.global.contentHeight;
            },
        },
        methods: {
            resize () {
                this.$nextTick(() => {
                    const pageHeaderHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('page-header')[0]);
                    const toolbarHeight = this.getAbsoluteHeight(this.$el.getElementsByClassName('toolbar')[0]);
                    const tableHeight = this.contentHeight - pageHeaderHeight - toolbarHeight;
                    tableHeightProperties.forEach((n) => {
                        this[n] = tableHeight;
                        return true;
                    });
                });
            },
        },
    };
};
