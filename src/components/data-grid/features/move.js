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
        }

        if (grid.moveArgs != null) {
            grid.moveArgs.clone.style.transform = `translate(${input.position.x}px, ${input.position.y}px)`;
        }
    }

    static async mouseUp(grid, event, input) {
        grid.moveArgs.placeholder.parentElement.replaceChild(grid.moveArgs.element, grid.moveArgs.placeholder);

        grid.animationLayer.removeChild(grid.moveArgs.clone);
        await grid.animationLayer.parentElement.removeChild(grid.animationLayer);

        delete grid.moveArgs.placeholder;
        delete grid.moveArgs.element;
        delete grid.moveArgs.clone;
        delete grid.moveArgs;

        delete grid.animationLayer;
        delete input._isMoving;
    }
}

async function startMove(grid, event) {
    grid.animationLayer = await createDragCanvas();
    const clone = await cloneForMoving(event.target);
    grid.animationLayer.appendChild(clone);
    const placeholder = await createPlaceholder(event.target);
    event.target.parentElement.replaceChild(placeholder, event.target);

    grid.moveArgs = {
        placeholder : placeholder,
        element     : event.target,
        clone       : clone
    }
}
