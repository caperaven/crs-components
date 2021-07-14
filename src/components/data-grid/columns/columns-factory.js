export class Columns {
    static async enable(grid, def) {
        grid._columns = def;
        await createColumnCSS(grid, def.length);
        await createColumns(grid, def);
    }

    static async disable(grid) {
        for (let column of grid._columns) {
            column.element = null;
        }
        grid._columns = null;
    }
}

async function createColumns(grid, columns) {
    const fragment = document.createDocumentFragment();

    for (let column of columns) {
        fragment.appendChild(await createColumn(column));
    }

    grid.bodyElement.appendChild(fragment);
}

async function createColumnCSS(grid, length) {
    const width = [];
    for (let i = 0; i < length; i++) {
        width.push("auto");
    }
    grid.bodyElement.style.gridTemplateColumns = width.join(" ");
}

async function createColumn(column) {
    const element = document.createElement("div");
    element.classList.add("column-header");
    element.textContent = column.title;
    element.element = element;
    element.style.width = `${column.width}px`;
    return element;
}