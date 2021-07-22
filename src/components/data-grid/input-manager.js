const mouseEvents = Object.freeze({
    LEAVE   : { key: "mouseleave", fn: mouseLeave},
    DOWN    : { key: "mousedown",  fn: mouseDown },
    UP      : { key: "mouseup",    fn: mouseUp },
    MOVE    : { key: "mousemove",  fn: mouseMove },
    CLICK   : { key: "click",      fn: click }
})

export class InputManager {
    static async enable(grid) {
        grid._events = {
            [mouseEvents.CLICK.key]: click.bind(grid)
        };

        grid._input = {
            startPosition: {x: 0, y: 0},
            position: {x: 0, y: 0},

            get time() { return this.end - this.start },
            get offset() { return Math.max(this.position.x - this.startPosition.x, this.position.y - this.startPosition.y) }
        };

        await enableEvents(grid, mouseEvents.DOWN);
    }

    static async disable(grid) {
        await disableEvents(grid, mouseEvents.DOWN);

        delete grid._events[mouseEvents.DOWN.key];
        delete grid._events[mouseEvents.UP.key];
        delete grid._events[mouseEvents.MOVE.key];
        delete grid._events[mouseEvents.CLICK.key];

        delete grid._events;
        delete grid._input;
        delete grid._inputManager;
    }
}

async function enableEvents(grid, ...events) {
    for (let event of events) {
        grid._events[event.key] = grid._events[event.key] || event.fn.bind(grid);
        grid.addEventListener(event.key, grid._events[event.key]);
    }
}

async function disableEvents(grid, ...events) {
    for (let event of events) {
        const handler = grid._events[event.key];
        grid.removeEventListener(event.key, handler);
    }
}

async function mouseDown(event) {
    if (this._isMoving == true) {
        return;
    }

    if (event.button == 2) {
        return context(event);
    }

    await enableEvents(this, mouseEvents.UP, mouseEvents.MOVE, mouseEvents.LEAVE);
    this._input.start = performance.now();
    this._input.startPosition.x = event.clientX;
    this._input.startPosition.y = event.clientY;
    this._feature = this[event.target.dataset?.feature];
    await this._feature?.mouseDown?.(this, event, this._input);
}

async function mouseMove(event) {
    this._input.position.x = event.clientX;
    this._input.position.y = event.clientY;
    await this._feature?.mouseMove?.(this, event, this._input);
}

async function mouseUp(event) {
    this._input.end = performance.now();
    this._input.position.x = event.clientX;
    this._input.position.y = event.clientY;
    await disableEvents(this, mouseEvents.UP, mouseEvents.MOVE, mouseEvents.LEAVE);

    if (this._input.time < 300 && this._input.offset < 5) {
        this._events[mouseEvents.CLICK.key](event);
    }

    await this._feature?.mouseUp?.(this, event, this._input);
    delete this._feature;
}

async function click(event) {
    if (event.target.classList.contains("column-header")) {
        await this._sort?.perform(event.target);
    }
}

async function mouseLeave(event) {
    return this._events[mouseEvents.UP.key](event);
}

async function context(event) {

}