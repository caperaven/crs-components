import {createDragCanvas, setPlaceholder} from "../lib/element-utils.js";

export async function enableMoveElements(args) {
    args.container.__moveArgs = new GridMoveElement(args);
}

export async function disableMoveElements(container) {
    container.__moveArgs.dispose();
    delete container.__moveArgs;
}

class GridMoveElement {
    get placeholder() {
        if (this.dragElement == null) return null;
        return this.dragElement.__placeHolder;
    }

    constructor(args) {
        this.grid = args.grid;
        this.container = args.container;
        this.moveQuery = args.movableQuery;
        this.dropQueries = args.dropQueries;
        this.phProperties = args.copyPlaceholderProperties;

        this._mouseDownHandler = this._mouseDown.bind(this);
        this._mouseMoveHandler = this._mouseMove.bind(this);
        this._mouseUpHandler = this._mouseUp.bind(this);
        this._clearRectHandler = this._clearRect.bind(this);

        this.container.addEventListener("mousedown", this._mouseDownHandler);
    }

    dispose() {
        this.container.removeEventListener("mousedown", this._mouseDownHandler);

        delete this.grid;
        delete this.container;
        delete this.moveQuery;
        delete this.dropQueries;
        delete this.phProperties;

        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;
        this._clearRectHandler = null;
    }

    async _mouseDown(event) {
        if (event.target.matches(this.moveQuery) == false) return;

        this.originContainer = event.target.parentElement;

        const element = await createDragCanvas();

        element.addEventListener("mousemove", this._mouseMoveHandler);
        element.addEventListener("mouseup", this._mouseUpHandler);

        this.dragElement = await setPlaceholder(event.target, this.phProperties);
        element.appendChild(this.dragElement);
        this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }

    async _mouseMove(event) {
        this.x = event.clientX;
        this.y = event.clientY;
        this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

        crsbinding.idleTaskManager.add(async () => {
            const target = await this._checkMoveTarget();
            if (target != null) {
                const direction = await this._checkPosition(target, event.clientX, event.clientY);
                await this._movePlaceholder(target, direction);
            }
        });
    }

    async _mouseUp(event) {
        // remove animation layer
        const element = event.target;
        element.removeEventListener("mousemove", this._mouseMoveHandler);
        element.removeEventListener("mouseup", this._mouseUpHandler);
        element.parentElement.removeChild(element);

        this.dragElement.parentElement.removeChild(this.dragElement);

        // 1. is it on a drop surface?
        const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
        let result = null;
        for (let dropQuery of this.dropQueries) {
            if (dropTarget.matches(dropQuery)) {
                result = dropTarget;
                break;
            }
        }

        // 3. if not replace the placeholder
        this.dragElement.style.transform = null;

        const placeholder = this.dragElement.__placeHolder;
        if (result == null) {
            placeholder.parentElement.replaceChild(this.dragElement, placeholder);

            if (placeholder.dataset && placeholder.dataset.drop) {
                crsbinding.idleTaskManager.add(async () => await this.grid.drop(element, placeholder, dropTarget));
            }
        }
        else {
            const element = this.dragElement;
            const placeholder = this.dragElement.__placeHolder;
            crsbinding.idleTaskManager.add(async () => await this.grid.drop(element, placeholder, dropTarget));
        }

        delete this.dragElement.__placeHolder;
        delete this.dragElement;
        delete this.originContainer;

        crsbinding.idleTaskManager.add(this._clearRectHandler);
    }

    async _movePlaceholder(element, direction) {
        switch(direction) {
            case 0:
                if (element.parentElement == this.originContainer) {
                    await this._movePlaceholderAppend();
                }
                break;
            case -1:
                if (element.previousSibling && element.previousSibling.dataset.placeholder == "true") return;
                await this._movePlaceholderBefore(element);
                break;
            case 1:
                if (element.nextSibling && element.nextSibling.dataset.placeholder == "true") return;
                await this._movePlaceholderAfter(element);
                break;
        }
    }

    async _movePlaceholderBefore(element) {
        this.container.removeChild(this.placeholder);
        this.container.insertBefore(this.placeholder, element);
    }

    async _movePlaceholderAfter(element) {
        this.container.removeChild(this.placeholder);

        if (element.nextSibling == null) {
            this.container.appendChild(this.placeholder);
        }
        else {
            this.container.insertBefore(this.placeholder, element.nextSibling);
        }
    }

    async _movePlaceholderAppend() {
        this.container.removeChild(this.placeholder);
        this.container.appendChild(this.placeholder);
    }

    async _checkMoveTarget() {
        if (this.dragElement == null) return null;
        const pointerEvent = this.dragElement.parentElement.style.pointerEvents;
        this.dragElement.parentElement.style.pointerEvents = "none";
        const dropTarget = document.elementFromPoint(this.x, this.y);
        this.dragElement.parentElement.style.pointerEvents = pointerEvent;

        for (let query of this.dropQueries) {
            if (dropTarget.matches(query)) {
                return dropTarget;
            }
        }

        return null;
    }

    async _checkPosition(target, x) {
        if (target.matches(this.dropQueries[0])) {
            return 0;
        }

        target.__rect = target.__rect || target.getBoundingClientRect();
        const half = target.__rect.width / 2;

        if (x > target.__rect.x + half) {
            return 1;
        }
        return -1;
    }

    async _clearRect() {
        this.container.querySelectorAll(this.moveQuery).forEach(element => delete element.__rect);
    }
}

