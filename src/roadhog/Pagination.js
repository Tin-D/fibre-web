class PaginationResult {
    constructor () {
        this.page = 1; // 当前页
        this.pageSize = 15; // 默认页数
        this.total = 0; // 总数目
        this.items = []; // 记录
    }
}

class PaginationQuery {
    constructor ({ sortField, sortOrder, ...conditions }) {
        this.page = 1; // 当前页
        this.sortField = sortField;
        this.sortOrder = sortOrder;
        Object.assign(this, conditions);
    }
}

export class Pagination {
    constructor ({ sortField, sortOrder = 'ascending', ...conditions }) {
        this.result = new PaginationResult();
        this.query = new PaginationQuery({ sortField, sortOrder, ...conditions });
        sortOrder = _.endsWith(sortOrder, 'ending') ? sortOrder : `${sortOrder}ending`;
        this.defaultSort = { prop: sortField, order: sortOrder };
    }

    setResult (responseData) {
        this.result.total = responseData.total;
        this.result.page = responseData.page;
        this.result.pageSize = responseData.pageSize;
        this.result.items = responseData.items;

        this.query.page = responseData.page;
    }

    setPage (page) {
        this.query.page = page;
    }

    setPageSize (pageSize) {
        this.query.pageSize = pageSize;
    }

    setSort (sortField, sortOrder) {
        this.query.sortField = sortField || 'id';
        this.query.sortOrder = sortOrder || 'asc';
    }
}
