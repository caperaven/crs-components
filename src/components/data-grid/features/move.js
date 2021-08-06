import {createDragCanvas, cloneForMoving, createPlaceholder} from "./../../lib/element-utils.js";
import {position as layoutPosition} from "./position.js";

export default class Move {
    static async enable(grid) {
    }

    static async disable(grid) {
        delete grid.move;
    }

    static async mouseMove(grid, event, input) {
        const classes = event.target.classList;

        if (classes.contains("grouping-header")) {
            return grid.group.mouseMove(grid, event, input);
        }

        if (input._isMoving !== true && ((input.xOffset > 5 || input.xOffset < -5) || (input.yOffset > 5 || input.yOffset < -5))) {
            input._isMoving = true;
            await startMove(grid, event, input);
            await AutoScroller.enable(grid);
        }

        if (grid.moveArgs?.groupPlaceholder != null) {
            if (classes.contains("group-item") == false && classes.contains("placeholder") == false) {
                grid._groupBar.removeChild(grid.moveArgs.groupPlaceholder);
                delete grid.moveArgs.groupPlaceholder;

                if (grid._groupBar.children.length === 0) {
                    grid._groupBar.textContent = grid.settings?.translations?.groupText || "drop here to group";
                }
            }
        }

        if (grid.moveArgs != null) {
            grid.moveArgs.target = event.target;
            grid.moveArgs.currentX = event.currentX;
        }
    }

    static async mouseUp(grid, event, input) {
        if (grid.moveArgs == null) return;

        if (event.target == grid._groupBar || event.target.parentElement == grid._groupBar) {
            await grid.group.mouseUp(grid, event, input);
        }

        if (grid.moveArgs.placeholder != null) {
            grid.moveArgs.placeholder.parentElement.replaceChild(grid.moveArgs.element, grid.moveArgs.placeholder);
        }

        await AutoScroller.disable(grid);

        grid.animationLayer.removeChild(grid.moveArgs.clone);
        grid.animationLayer.removeChild(grid.moveArgs.marker);

        await grid.animationLayer.parentElement.removeChild(grid.animationLayer);

        if (grid.moveArgs.target.classList.contains("column-header")) {
            const position  = Number(grid.moveArgs.marker.dataset.position);
            const fromIndex = Number(grid.moveArgs.element.dataset.col);
            let toIndex   = Number(grid.moveArgs.target.dataset.col);

            if (toIndex > fromIndex) {
                toIndex += position;
            }
            else {
                toIndex += position == layoutPosition.BEFORE ? 0 : 1;
            }

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

        if (start < end) {
            await this.moveRight(grid, start, end, buffer);
        }
        else {
            await this.moveLeft(grid, start, end, buffer);
        }

        for (let item of buffer) {
            for (let element of item.elements) {
                element.dataset.col = item.end;
                element.style.gridColumnStart = item.end;
            }
        }
    }

    static async moveLeft(grid, start, end, buffer) {
        for (let i = end; i < start; i++) {
            buffer.push({
                elements: grid.bodyElement?.querySelectorAll(`[data-col="${i}"]`),
                start: i,
                end: i+1
            })
        }
    }

    static async moveRight(grid, start, end, buffer) {
        for (let i = start + 1; i <= end; i++) {
            buffer.push({
                elements: grid.bodyElement?.querySelectorAll(`[data-col="${i}"]`),
                start: i,
                end: i-1
            })
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

    let placeholder = await createPlaceholder(event.target);
    event.target.parentElement.replaceChild(placeholder, event.target);

    let groupPlaceholder;

    if (event.target.classList == "group-item") {
        placeholder.style.height = "2rem";
        groupPlaceholder = placeholder;
        placeholder = null;
    }

    const marker = document.createElement("div");
    marker.classList.add("marker");
    marker.dataset.group = event.target.dataset.group;

    grid.animationLayer.append(marker);

    grid.moveArgs = {
        placeholder      : placeholder,
        element          : event.target,
        clone            : clone,
        marker           : marker,
        groupPlaceholder : groupPlaceholder
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
    marker.style.opacity = 1;

    const group = target.dataset.group;
    if (group != marker.dataset.group && group != -1){
        marker.style.opacity = 0;
    };

    const classes = target.classList;
    const isColumn = classes.contains("column-header") || classes.contains("group-item");
    const isPlaceholder = classes.contains("placeholder");

    if (isColumn === false && isPlaceholder === false) return;

    const rect = target.getBoundingClientRect();

    if (x < rect.left + (rect.width / 2)) {
        marker.style.transform = `translate(${rect.left - 4}px, ${rect.top}px)`;
        marker.dataset.position = layoutPosition.BEFORE;
    }
    else {
        marker.style.transform = `translate(${rect.right - 4}px, ${rect.top}px)`;
        marker.dataset.position = layoutPosition.AFTER;
    }
}