export default class StaticRows {
    static async enable(grid, data) {
        grid._data = data;
        grid.settings.pageSize = grid.settings.pageSize || 20;
        grid.settings.page = 0;
        await createRows(grid, data);
    }

    static async disable(grid) {
        grid._data = null;
        return null;
    }
}

async function createRows(grid, data) {
    const fragment = document.createDocumentFragment();
    grid.rows = [];
    const start = grid.settings.page * grid.settings.pageSize;
    const end = start + grid.settings.pageSize;
    for (let i = start; i < end; i++) {
        const row = data[i];
        await createCells(grid, row, fragment);
    }
    grid.bodyElement.appendChild(fragment);
}

async function createCells(grid, row, fragment) {
    for (let column of grid._columns) {
        const element = document.createElement("div");
        element.setAttribute("role", "gridcell");
        element.textContent = row[column.field];
        fragment.appendChild(element);
    }
}