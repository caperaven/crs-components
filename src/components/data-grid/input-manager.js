const mouseEvents = Object.freeze({
    DOWN    : { key: "mousedown", fn: mouseDown },
    UP      : { key: "mouseup",   fn: mouseUp },
    MOVE    : { key: "mousemove", fn: mouseMove },
    CLICK   : { key: "click",     fn: click }
})

export class InputManager {
    static async enable(grid) {
        grid._inputManager = new InputManager();

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
    await enableEvents(this, mouseEvents.UP, mouseEvents.MOVE);
    this._input.start = performance.now();
    this._input.startPosition.x = event.clientX;
    this._input.startPosition.y = event.clientY;
}

async function mouseMove(event) {
    this._input.position.x = event.clientX;
    this._input.position.y = event.clientY;
}

async function mouseUp(event) {
    this._input.end = performance.now();
    this._input.position.x = event.clientX;
    this._input.position.y = event.clientY;
    await disableEvents(this, mouseEvents.UP, mouseEvents.MOVE);

    if (this._input.time < 300 && this._input.offset < 5) {
        this._events[mouseEvents.CLICK.key](event);
    }
}

async function click(event) {
    if (event.target.classList.contains("column-header")) {
        await this._sort?.perform(event.target);
    }
}