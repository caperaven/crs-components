export class Headers {
    static async enable(grid) {
        await createHeaders(grid, grid.settings.headers, grid.settings.columns.length);
    }
}

async function createHeaders(grid, headers, length) {
    const fragment = document.createDocumentFragment();

    let start = 1;
    let count = 0;
    for (let header of headers) {
        await createHeader(header.title, start, header.span, fragment);
        start += header.span;
        count += header.span;
    }

    if (count < length) {
        await createHeader("", start, length - count, fragment);
    }

    grid.bodyElement.appendChild(fragment);
}

async function createHeader(title, start, span, fragment) {
    const element = document.createElement("div");
    element.textContent = title;
    element.style.gridColumn = `${start} / span ${span}`;
    element.classList.add("column-group");
    fragment.appendChild(element);
}