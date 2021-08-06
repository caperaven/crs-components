import {createDragCanvas} from "./../../lib/element-utils.js";

export default class Resize {
    static async enable(grid) {

    }

    static async disable(grid) {
        delete grid.resize;
    }

    static async decorate(column) {
        const element = document.createElement("div");
        element.classList.add("resize");
        element.dataset.feature = "resize";
        column.appendChild(element);
    }

    static async autoSize(grid, column) {
        await autoSizeColumn(grid, column);
    }

    static async mouseDown(grid, event, input) {
        const source = event.target.parentElement;
        const rect = source.getBoundingClientRect();
        const element = await createResizeUI(source, rect);

        grid.animationLayer = await createDragCanvas();
        grid.animationLayer.appendChild(element);

        grid.resizeArgs = {
            field   : source.dataset.field,
            element : element,
            width   : rect.width
        }
    }

    static async mouseMove(grid, event, input) {
        grid.resizeArgs.newWidth = grid.resizeArgs.width + input.xOffset;
        grid.resizeArgs.element.style.width = `${grid.resizeArgs.newWidth}px`;
    }

    static async mouseUp(grid, event, input) {
        const field  = grid.resizeArgs.field;
        const column = grid._columns.find(item => item.field === field);
        column.width = grid.resizeArgs.newWidth;
        column.element.style.width = `${column.width}px`

        grid.animationLayer.removeChild(grid.resizeArgs.element);
        await grid.animationLayer.parentElement.removeChild(grid.animationLayer);

        delete grid.resizeArgs.resizeElement;
        delete grid.resizeArgs.element;
        delete grid.resizeArgs.width;
        delete grid.resizeArgs;
    }
}

async function createResizeUI(source, rect) {
    const element               = document.createElement("div");
    element.style.position      = "absolute";
    element.style.top           = `${rect.top}px`;
    element.style.left          = `${rect.left}px`;
    element.style.width         = `${rect.width}px`;
    element.style.height        = `${rect.height}px`;
    element.style.cursor        = "col-resize";
    element.classList.add("resize-clone");
    return element;
}

async function autoSizeColumn(grid, column) {
    const col = column.dataset.col;
    const elements = grid.querySelectorAll(`[role="gridcell"][data-col="${col}"]`);
    const font = getComputedStyle(grid).font;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.font = font;
    ctx.font = font;

    let max = ctx.measureText(column.firstChild.textContent).width;
    elements.forEach(element => {
        const width = ctx.measureText(element.textContent).width;
        max = Math.max(max, width);
    });
    max += 18;

    grid._columns.find(item => item.element === column).width = max;
    column.style.width = `${max}px`;
}