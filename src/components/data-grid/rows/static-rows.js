export default class StaticRows {
    static async enable(grid, data) {
        grid._data = data;
        grid._cells = [];
        grid.settings.pageSize = grid.settings.pageSize || 20;
        grid.settings.page = 0;
        grid.settings.lastPage = Math.ceil(data.length / grid.settings.pageSize);

        const rowSize = grid.settings.pageSize + (grid.settings.headers == null ? 1 : 2);
        grid.bodyElement.style.gridTemplateRows = `repeat(${rowSize}, 2.5rem)`;

        await this.redraw(grid, data);
    }

    static async disable(grid) {
        grid._data = null;
        grid._cells = null;
        return null;
    }

    static async firstPage(grid) {
        grid.settings.page = 0;
        await updateRows(grid);
    }

    static async previousPage(grid) {
        grid.settings.page = Math.max(grid.settings.page -= 1, 0);
        await updateRows(grid);
    }

    static async nextPage(grid) {
        grid.settings.page = Math.min(grid.settings.page += 1, grid.settings.lastPage);
        await updateRows(grid);
    }

    static async lastPage(grid) {
        grid.settings.page = grid.settings.lastPage;
        await updateRows(grid);
    }

    static async gotoPage(grid, page) {
        grid.settings.page = page > 0 && page < grid.settings.pageSize ? page : grid.settings.pageSize;
        await updateRows(grid);
    }

    static async redraw(grid, data) {
        if (grid.groupDescriptor != null) {
            return await createRootGroups(grid);
        }

        await createRows(grid, data);
    }
}

async function createRows(grid, data) {
    const fragment = document.createDocumentFragment();
    const start = grid.settings.page * grid.settings.pageSize;
    let end = Math.min(start + grid.settings.pageSize, data.length);

    let index = 0;
    for (let i = start; i < end; i++) {
        const row = data[i];
        await createCells(grid, row, fragment, grid._startRowIndex + index);
        index++;
    }

    grid.bodyElement.appendChild(fragment);
}

async function createCells(grid, row, fragment, rowIndex) {
    let index = 1;
    for (let column of grid._columns) {
        const element = document.createElement("div");
        element.setAttribute("role", "gridcell");
        element.textContent = row[column.field];
        element.dataset.field = column.field;
        element.classList.add(column.align || "left");
        element.dataset.col = index;
        element.style.gridColumnStart = index++;
        element.style.gridRowStart = rowIndex;

        if (column.sticky == true) {
            element.classList.add("sticky");
            element.style.left = `${column.left}px`;
            element.style.zIndex = 1;
        }

        grid._cells.push(element);
        fragment.appendChild(element);
    }
}

async function updateRows(grid) {
    const start = grid.settings.page * grid.settings.pageSize;
    let end = Math.min(start + grid.settings.pageSize, grid._data.length);

    let index = 0;
    for (let i = start; i < end; i++) {
        const row = grid._data[i];
        await updateRow(grid, row, index);
        index++;
    }
}

async function updateRow(grid, row, index) {
    const length = grid._columns.length;
    const cIndex = index * length;

    for (let i = 0; i < length; i++) {
        grid._cells[cIndex + i].textContent = row[grid._columns[i].field];
    }
}

async function createRootGroups() {

}