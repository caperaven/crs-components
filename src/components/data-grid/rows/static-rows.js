export default class StaticRows {
    static async enable(grid, data) {
        grid._data = data;
    }

    static async disable(grid) {
        grid._data = null;
        return null;
    }
}

async function createRows(grid, data) {
    grid.rows = [];
    for (let row of data) {

    }
}