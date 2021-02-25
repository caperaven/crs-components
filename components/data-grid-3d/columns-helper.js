export function createColumns(element, columnsDef) {
    const fragment = document.createDocumentFragment();
    for (let column of columnsDef) {
        const ce = document.createElement("div");
        ce.textContent = column.title;
        ce.style.width = `${column.width}px`;
        ce.classList.add("column-header");
        ce.dataset.field = column.field;
        fragment.appendChild(ce);
    }
    element.appendChild(fragment);
}