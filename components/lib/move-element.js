import {createDragCanvas, setPlaceholder} from "./element-utils.js";

/**
 * Function to allow elements to be dragged around
 * @param parentElement {element} contains the draggable elements
 * @param query {query selector string} what can I drag around
 * @param dropQueries {query selector string} on what kind of element can I drop this
 * @param phProperties {object} what properties to copy over to placeholder
 * @param callback {function} call me when dropping and item
 * @returns {Promise<void>}
 */
export async function enableMoveElements(parentElement, query, dropQueries, phProperties, callback) {
    // moveArgs becomes "this"
    const moveArgs = {
        moveQuery: query,
        dropQueries: dropQueries,
        drop: callback,
        parent: parentElement,
        phProperties: phProperties
    }

    moveArgs.mouseDownHandler = mouseDown.bind(moveArgs);

    parentElement.__moveArgs = moveArgs;
    parentElement.addEventListener("mousedown", moveArgs.mouseDownHandler);
}

export async function disableMoveElements(parentElement) {
    parentElement.removeEventListener("mousedown", parentElement.__moveArgs.mouseDownHandler);
    delete parentElement.__moveArgs.parent;
    delete parentElement.__moveArgs.drop;
    delete parentElement.__moveArgs.moveQuery;
    delete parentElement.__moveArgs.dropQueries;
    delete parentElement.__moveArgs.mouseDownHandler;
    delete parentElement.__moveArgs;
}

async function mouseDown(event) {
    if (event.target.matches(this.moveQuery) == false) return;

    const element = await createDragCanvas();
    this.mouseMoveHandler = mouseMove.bind(this);
    this.mouseUpHandler = mouseUp.bind(this);

    element.addEventListener("mousemove", this.mouseMoveHandler);
    element.addEventListener("mouseup", this.mouseUpHandler);

    this.dragElement = await setPlaceholder(event.target, this.phProperties);
    element.appendChild(this.dragElement);
    this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
}

async function mouseMove(event) {
    this.x = event.clientX;
    this.y = event.clientY;
    this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

    crsbinding.idleTaskManager.add(async () => {
        const target = await checkMoveTarget.call(this);
        if (target != null) {
            const direction = await checkPosition.call(this, target, event.clientX, event.clientY);
            await movePlaceholder.call(this, target, direction);
        }
    });
}

async function movePlaceholder(element, direction) {
    switch(direction) {
        case 0:
            await movePlaceholderAppend.call(this, element);
            break;
        case -1:
            if (element.previousSibling && element.previousSibling.dataset.placeholder == "true") return;
            await movePlaceholderBefore.call(this, element);
            break;
        case 1:
            if (element.nextSibling && element.nextSibling.dataset.placeholder == "true") return;
            await movePlaceholderAfter.call(this, element);
            break;
    }
}

/**
 * Insert placeholder before this element
 * @param element
 * @returns {Promise<void>}
 */
async function movePlaceholderBefore(element) {
    const placeholder = this.dragElement.__placeHolder;
    const parentElement = placeholder.parentElement;
    parentElement.removeChild(placeholder);
    parentElement.insertBefore(placeholder, element);
}

/**
 * Insert placeholder after this element
 * @param element
 * @returns {Promise<void>}
 */
async function movePlaceholderAfter(element) {
    const placeholder = this.dragElement.__placeHolder;
    const parentElement = placeholder.parentElement;
    parentElement.removeChild(placeholder);

    if (element.nextSibling == null) {
        parentElement.appendChild(placeholder);
    }
    else {
        parentElement.insertBefore(placeholder, element.nextSibling);
    }
}

/**
 * Append element to parent on collection
 * @param element
 * @returns {Promise<void>}
 */
async function movePlaceholderAppend(element) {
    const placeholder = this.dragElement.__placeHolder;
    const parentElement = placeholder.parentElement;
    parentElement.removeChild(placeholder);
    parentElement.appendChild(placeholder);
}

/**
 * Check if the drag target is over a valid sibling.
 * If not a valid sibling (same type) it returns null
 * If it is a sibling, other functions will perform the move update.
 * @returns {Promise<null|Element>}
 */
async function checkMoveTarget() {
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

/**
 * Check if the pointer is on the left or the right of the target element.
 * Left = insert before, Right = insert after
 * @param target
 * @param x
 * @param y
 * @returns {Promise<unknown>}
 */
async function checkPosition(target, x, y) {
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

async function mouseUp(event) {
    // remove animation layer
    const element = event.target;
    element.removeEventListener("mousemove", this.mouseMoveHandler);
    element.removeEventListener("mouseup", this.mouseUpHandler);
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

    if (result == null) {
        this.dragElement.__placeHolder.parentElement.replaceChild(this.dragElement, this.dragElement.__placeHolder);
    }
    else {
        const element = this.dragElement;
        const placeholder = this.dragElement.__placeHolder;
        crsbinding.idleTaskManager.add(async () => await this.drop(element, placeholder, dropTarget));
    }

    delete this.dragElement.__placeHolder;
    delete this.dragElement;

    crsbinding.idleTaskManager.add(clearRect.bind(this));
}

/**
 * Clean up the rect that was defined during the drag and drop operations
 * @returns {Promise<void>}
 */
async function clearRect() {
    this.parent.querySelectorAll(this.moveQuery).forEach(element => delete element.__rect);
}

