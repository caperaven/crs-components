/*
    Q: How do I add custom columns?
        - selection checkbox column
        - status image column 1:N
 */


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

        grid.resize?.decorate(element);

        fragment.appendChild(element);
    }

    const headers = grid.settings.headers || [];
    let offset = 0;
    for (let i = 0; i < headers.length; i++) {
        const toIndex = headers[i].span + offset;
        for (let j = offset; j < toIndex; j++) {
            const element = grid._columns[j].element;
            element.dataset.group = i;
            element.querySelectorAll("div").forEach(el => el.dataset.group = i);
        }
        offset = toIndex;
    }

    for (let i = offset; i < grid._columns.length; i++) {
        grid._columns[i].element.dataset.group = headers.length;
    }

    grid.bodyElement.appendChild(fragment);
}

async function createColumn(column, index, rowIndex) {
    const element = document.createElement("div");
    element.classList.add("column-header");
    element.classList.add(column.align || "left");
    element.style.width = `${column.width}px`;
    element.style.gridColumnStart = index;
    element.style.gridRowStart = rowIndex;
    element.dataset.col = index;
    element.dataset.feature = "move";
    element.dataset.field = column.field;
    column.element = element;

    const content = document.createElement("span");
    content.textContent = column.title;
    element.appendChild(content);

    return element;
}

async function createColumnCSS(grid, length) {
    const width = [];
    for (let i = 0; i < length; i++) {
        width.push("auto");
    }
    grid.bodyElement.style.gridTemplateColumns = `repeat(${length}, auto)`;
}