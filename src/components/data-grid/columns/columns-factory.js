export class Columns {
    static async enable(grid, columns) {
        grid._columns = columns;
        await createColumnCSS(grid, columns.length);
        await createColumns(grid, columns);
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
    let sticky = 0;
    for (let column of columns) {
        const element = await createColumn(column);

        if (column.sticky == true) {
            column.left = sticky;
            element.style.position = "sticky";
            element.style.left = `${sticky}px`;
            element.style.zIndex = 2;
            sticky += column.width;
        }

        fragment.appendChild(element);
    }

    grid.bodyElement.appendChild(fragment);
}

async function createColumn(column) {
    const element = document.createElement("div");
    element.classList.add("column-header");
    element.textContent = column.title;
    element.element = element;
    element.style.width = `${column.width}px`;
    element.dataset.feature = "move";
    return element;
}

async function createColumnCSS(grid, length) {
    const width = [];
    for (let i = 0; i < length; i++) {
        width.push("auto");
    }
    grid.bodyElement.style.gridTemplateColumns = `repeat(${length}, auto)`;
}