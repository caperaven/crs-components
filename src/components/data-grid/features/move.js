import {createDragCanvas, cloneForMoving, createPlaceholder} from "./../../lib/element-utils.js";

export default class Move {
    static async enable(grid) {
    }

    static async disable(grid) {
        delete grid.move;
    }

    static async mouseMove(grid, event, input) {
        if (input._isMoving !== true && input.offset > 5) {
            input._isMoving = true;
            await startMove(grid, event, input);
            await AutoScroller.enable(grid);
        }

        if (grid.moveArgs != null) {
            grid.moveArgs.target = event.target;
            grid.moveArgs.currentX = event.currentX;
        }
    }

    static async mouseUp(grid, event, input) {
        grid.moveArgs.placeholder.parentElement.replaceChild(grid.moveArgs.element, grid.moveArgs.placeholder);

        await AutoScroller.disable(grid);

        grid.animationLayer.removeChild(grid.moveArgs.clone);
        grid.animationLayer.removeChild(grid.moveArgs.marker);

        await grid.animationLayer.parentElement.removeChild(grid.animationLayer);

        if (grid.moveArgs.target.classList.contains("column-header")) {
            const position  = Number(grid.moveArgs.marker.dataset.position);
            const fromIndex = Number(grid.moveArgs.element.dataset.col);
            const toIndex   = Number(grid.moveArgs.target.dataset.col) + position;

            if (fromIndex !== toIndex) {
                await this.moveColumn(grid, fromIndex, toIndex);
            }
        }

        delete grid.moveArgs.placeholder;
        delete grid.moveArgs.element;
        delete grid.moveArgs.clone;
        delete grid.moveArgs.target;
        delete grid.moveArgs.marker;
        delete grid.moveArgs;

        delete grid.animationLayer;
        delete input._isMoving;
    }

    static async moveColumn(grid, start, end) {
        const buffer = [
            {
                elements: grid.bodyElement.querySelectorAll(`[data-col="${start}"]`),
                start: start,
                end: end
            }
        ];

        // 1. Create buffer of affected elements
        for (let i = start + 1; i <= end; i++) {
            buffer.push({
                elements: grid.bodyElement?.querySelectorAll(`[data-col="${i}"]`),
                start: i,
                end: i-1
            })
        }

        // 2. Apply changes
        for (let item of buffer) {
            for (let element of item.elements) {
                element.dataset.col = item.end;
                element.style.gridColumnStart = item.end;
            }
        }
    }
}

class AutoScroller {
    static async enable(grid) {
        grid.moveArgs.checkScrollHandler = checkScroll.bind(grid);
        grid.moveArgs.checkScrollHandler();
    }

    static async disable(grid) {
        delete grid.moveArgs.checkScrollHandler;
    }
}

async function startMove(grid, event) {
    grid.animationLayer = await createDragCanvas();

    const clone = await cloneForMoving(event.target);
    grid.animationLayer.appendChild(clone);

    const placeholder = await createPlaceholder(event.target);
    event.target.parentElement.replaceChild(placeholder, event.target);

    const marker = document.createElement("div");
    marker.classList.add("marker");

    grid.animationLayer.append(marker);

    grid.moveArgs = {
        placeholder : placeholder,
        element     : event.target,
        clone       : clone,
        marker      : marker
    }
}

async function checkScroll() {
    if (this.moveArgs?.checkScrollHandler == null) return;

    requestAnimationFrame(this.moveArgs.checkScrollHandler);

    const x = this._input.position.x;

    if (this.moveArgs != null) {
        this.moveArgs.clone.style.transform = `translate(${this._input.position.x}px, ${this._input.position.y}px)`;
        await updateMarker(this.moveArgs.target, this.moveArgs.marker, x);
    }

    if (x > this.rect.right - 32) {
        this.bodyElement.scrollBy({left: this.settings.scrollSpeed});
    }

    if (x < this.rect.left + 32) {
        this.bodyElement.scrollBy({left: -this.settings.scrollSpeed});
    }
}

async function updateMarker(target, marker, x) {
    if (target == null) return;
    const isColumn = target.classList.contains("column-header");
    const isPlaceholder = target.classList.contains("placeholder");

    if (isColumn === false && isPlaceholder === false) return;

    const rect = target.getBoundingClientRect();

    if (x < rect.left + (rect.width / 2)) {
        marker.style.transform = `translate(${rect.left - 4}px, ${rect.top}px)`;
        marker.dataset.position = -1;
    }
    else {
        marker.style.transform = `translate(${rect.right - 4}px, ${rect.top}px)`;
        marker.dataset.position = 0;
    }
}