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

    static async expand(grid, path) {
        await expand(grid, path);
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

        if (rowIndex != null) {
            element.style.gridRowStart = rowIndex;
        }

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

async function createRootGroups(grid) {
    const template = grid.querySelector("#group");
    const width = grid.rect.width - 8;
    const keys = Object.keys(grid.groupDescriptor);
    const fragment = document.createDocumentFragment();

    const grouping = grid.grouping[0];
    const column = grid._columns.find(item => item.field == grouping);
    const title = column.title;

    for (let key of keys) {
        const descriptor = grid.groupDescriptor[key];
        await createGroupedRow(template, `${title}: ${key}`, key, descriptor._count, 0, grid._columns.length, width, fragment);
    }

    grid.bodyElement.appendChild(fragment);
}

async function createGroupedRow(template, text, path, count, level, length, width, fragment) {
    if (text.indexOf("_count") != -1) return;

    const instance          = template.content.cloneNode(true);
    const contentElement    = instance.querySelector(".content");
    const textElement       = instance.querySelector(".text");
    const countElement      = instance.querySelector(".count");
    const chevronElement    = instance.querySelector(".chevron-svg");

    contentElement.style.width = `${width}px`;

    textElement.style.marginLeft = `${level * 16}px`;
    textElement.textContent = text;
    countElement.textContent = `Count: ${count}`;
    chevronElement.dataset.path = path;

    instance.children[0].style.gridColumn = `1 / span ${length}`;

    fragment.appendChild(instance);
}

async function expand(grid, path) {
    const items = crsbinding.utils.getValueOnPath(grid.groupDescriptor, path);
    const level = path.split(".").length;
    const fragment = document.createDocumentFragment();
    const target = grid.bodyElement.querySelector(`[data-path="${path}"]`).parentElement.parentElement;

    if (items.ind == null) {
        const template = grid.querySelector("#group");
        const width = grid.rect.width - 8;
        const grouping = grid.grouping[level];
        const column = grid._columns.find(item => item.field == grouping);
        const title = column.title;

        for (let key of Object.keys(items)) {
            let count = items[key]._count;

            if (items[key].ind != null) {
                count = items[key].ind.length;
            }

            await createGroupedRow(template, `${title}: ${key}`, `${path}.${key}`, count, level, grid._columns.length, width, fragment);
        }
    }
    else {
        for (let index of items.ind) {
            const row = grid._data[index];
            await createCells(grid, row, fragment);
        }
    }

    if (target.nextElementSibling == null) {
        target.parentElement.appendChild(fragment);
    }
    else {
        target.parentElement.insertBefore(fragment, target.nextElementSibling);
    }
}