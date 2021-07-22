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
    let index = 1;

    const rowIndex = grid._startRowIndex - 1;

    for (let column of columns) {
        const element = await createColumn(column, index++, rowIndex);

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

async function createColumn(column, index, rowIndex) {
    const element = document.createElement("div");
    element.classList.add("column-header");
    element.classList.add(column.align || "left");
    element.textContent = column.title;
    element.element = element;
    element.style.width = `${column.width}px`;
    element.style.gridColumnStart = index;
    element.style.gridRowStart = rowIndex;
    element.dataset.col = index;
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