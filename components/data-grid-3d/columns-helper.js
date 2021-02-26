import {createSvgImage} from "./../lib/element-utils.js";

export async function createColumns(element, columnsDef, minWidth = 140) {
    const fragment = document.createDocumentFragment();

    for (let column of columnsDef) {
        let width = Number(column.width);
        if (width < minWidth) {
            width = minWidth;
        }

        const ce = document.createElement("div");
        ce.style.width = `${width}px`;
        ce.style.position = "relative";
        ce.classList.add("column-header");
        ce.dataset.field = column.field;

        const text = document.createElement("span");
        text.style.textOverflow = "ellipsis";
        text.textContent = column.title;
        ce.appendChild(text);


        ce.appendChild(await createSvgImage("filter", "filter-icon"));
        ce.appendChild(await createSvgImage("grid-resize", "resize-icon"));

        fragment.appendChild(ce);
    }
    element.appendChild(fragment);
}