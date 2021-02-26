import {createDragCanvas, setPlaceholder} from "./element-utils.js";

/**
 * Function to allow elements to be dragged around
 * @param parentElement {element} contains the draggable elements
 * @param query {query selector string} what can I drag around
 * @param dropQueries {query selector string} on what kind of element can I drop this
 * @param callback {function} call me when dropping and item
 * @returns {Promise<void>}
 */
export async function enableMoveElements(parentElement, query, dropQueries, callback) {
    // moveArgs becomes "this"
    const moveArgs = {
        moveQuery: query,
        dropQueries: dropQueries,
        drop: callback
    }

    moveArgs.mouseDownHandler = mouseDown.bind(moveArgs);

    parentElement.__moveArgs = moveArgs;
    parentElement.addEventListener("mousedown", moveArgs.mouseDownHandler);
}

export async function disableMoveElements(parentElement) {
    parentElement.removeEventListener("mousedown", parentElement.__moveArgs.mouseDownHandler);
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

    this.dragElement = await setPlaceholder(event.target);
    element.appendChild(this.dragElement);
    this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
}

async function mouseMove(event) {
    this.dragElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
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
}