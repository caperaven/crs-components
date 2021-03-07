import {createDragCanvas, setPlaceholder} from "../lib/element-utils.js";
import {rebuildGrouping} from "./data-grid-grouping.js";

export async function enableMoveElements(parent) {
    parent._moveContext = new GridMoveElement(parent);
}

export async function disableMoveElements(parent) {
    parent._moveContext.dispose();
    delete parent._moveContext;
}

class GridMoveElement {
    get placeholder() {
        if (this.dragElement == null) return null;
        return this.dragElement.__placeHolder;
    }

    get isDraggingColumn() {
        return this.dragElement && this.dragElement.classList.contains("column-header");
    }

    get isDraggingGrouping() {
        return this.dragElement && this.dragElement.classList.contains("column-header-group");
    }

    constructor(parent) {
        this.grid = parent;
        this.gridGroupingContainer = this.grid.querySelector(".grid-grouping");
        this.gridColumnsContainer = this.grid.querySelector(".grid-columns");

        this._mouseDownHandler = this._mouseDown.bind(this);
        this._mouseMoveHandler = this._mouseMove.bind(this);
        this._mouseUpHandler = this._mouseUp.bind(this);
        this._clearRectHandler = this._clearRect.bind(this);

        this.grid.querySelector(".grid-grouping").addEventListener("mousedown", this._mouseDownHandler);
        this.grid.querySelector(".grid-columns").addEventListener("mousedown", this._mouseDownHandler);
    }

    dispose() {
        this.grid.querySelector(".grid-grouping").removeEventListener("mousedown", this._mouseDownHandler);
        this.grid.querySelector(".grid-columns").removeEventListener("mousedown", this._mouseDownHandler);

        delete this.grid;
        delete this.gridGroupingContainer;
        delete this.gridColumnsContainer;

        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;
        this._clearRectHandler = null;
    }

    async _mouseDown(event) {
        if (event.button != 0) return;
        if (event.target.matches(".column-header, .column-header-group") == false) return;

        this.dragCanvas = await createDragCanvas();
        this.dragCanvas.addEventListener("mousemove", this._mouseMoveHandler);
        this.dragCanvas.addEventListener("mouseup", this._mouseUpHandler);

        this._isMoving = false;
        this._startX = event.clientX;
        this._startY = event.clientY;
        this.originContainer = event.target.parentElement;
        this.selectedColumnElement = event.target;

        this._startIndex = Array.from(this.originContainer.children).indexOf(this.selectedColumnElement);
    }

    async _startDrag(event) {
        this.dragElement = await setPlaceholder(this.selectedColumnElement, {field: "field"});
        this.dragCanvas.appendChild(this.dragElement);
        this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }

    async _getTarget(event) {
        event.target.style.pointerEvents = "none";
        const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
        event.target.style.pointerEvents = "initial";
        return dropTarget;
    }

    async _mouseMove(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        if (this._isMoving == true) {
            this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

            if (this.isDraggingColumn) {
                await this._movingColumn(event);
            }
            else {
                await this._movingGrouping(event);
            }
        }
        else {
            if (Math.abs(this.x - this._startX) > 5 || Math.abs(this.y - this._startY) > 5) {
                this._isMoving = true;
                return this._startDrag(event);
            }
        }
    }

    async _movingGrouping(event) {
        const target = await this._getTarget(event);
        await this._move(target, [".column-header-group"]);
    }

    async _movingColumn(event) {
        const target = await this._getTarget(event);
        await this._move(target, [".column-header"]);
    }

    async _move(target, query) {
        if (await this.matches(target, query)) {
            const position = await this._checkPosition(target, event.clientX);

            if (position == -1) {
                await this._movePlaceholderBefore(target);
            }
            else if (position == 1) {
                await this._movePlaceholderAfter(target);
            }
        }
    }

    async _mouseUp(event) {
        event.target.removeEventListener("mousemove", this._mouseMoveHandler);
        event.target.removeEventListener("mouseup", this._mouseUpHandler);
        event.target.parentElement.removeChild(event.target);

        if (this.dragElement == null) {
            if (this.selectedColumnElement.classList.contains("column-header")) {
                const field = this.selectedColumnElement.dataset.field;
                this.grid.sort(field);
            }
        }
        else {
            this.dragElement.parentElement.removeChild(this.dragElement);
            this.dragElement.style.transform = null;

            if (this.isDraggingColumn) {
                await this._mouseUpColumn(event);
            }
            else {
                await this._mouseUpGrouping(event);
            }
        }

        delete this.originContainer;
        delete this.dragCanvas;
        delete this.selectedColumnElement;
    }

    async _mouseUpColumn(event) {
        const target = await this._getTarget(event);

        this._endIndex = Array.from(this.originContainer.children).indexOf(target);

        if (target.dataset.placeholder == "true") {
            await this.grid.swapColumns(this._startIndex, this._endIndex);
        }
        else if (target == this.gridGroupingContainer) {
            const placeholder = this.dragElement.__placeHolder;
            const element = this.dragElement;

            crsbinding.idleTaskManager.add(async () => {
                await this.grid.orderGrouping(element, placeholder, target);
            });
        }

        await this._swapPlaceAndDrag();
        await this._clearRect(".column-header");

        delete this._startIndex;
        delete this._endIndex;
    }

    async _mouseUpGrouping(event) {
        const target = await this._getTarget(event);
        await this._swapPlaceAndDrag();
        await this._clearRect(".column-header-group");
        await rebuildGrouping(this.gridGroupingContainer, this.grid._groupingContext.grouping)
    }

    async matches(element, queries) {
        let isValid = false;
        for (let query of queries) {
            if (element.matches(query)) {
                isValid = true;
                break;
            }
        }
        return isValid;
    }

    async _checkPosition(target, x) {
        target.__rect = target.__rect || target.getBoundingClientRect();
        const half = target.__rect.width / 2;

        if (x > target.__rect.x + half) {
            return 1;
        }
        return -1;
    }

    async _movePlaceholderBefore(element) {
        const container = this.placeholder.parentElement;
        container.removeChild(this.placeholder);
        container.insertBefore(this.placeholder, element);
    }

    async _movePlaceholderAfter(element) {
        const container = this.placeholder.parentElement;
        container.removeChild(this.placeholder);

        if (element.nextSibling == null) {
            container.appendChild(this.placeholder);
        }
        else {
            container.insertBefore(this.placeholder, element.nextSibling);
        }
    }

    async _swapPlaceAndDrag() {
        const placeholder = this.dragElement.__placeHolder;
        placeholder.parentElement.replaceChild(this.dragElement, placeholder);
        await this._releaseDragElement();
    }

    async _releaseDragElement() {
        this.dragElement.__placeHolder = null;
        this.dragElement = null;
    }

    async _clearRect(query) {
        this.grid.querySelectorAll(query).forEach(element => delete element.__rect);
    }
}

