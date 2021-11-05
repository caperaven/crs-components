const mouseEvents = Object.freeze({
    DOWN    : { key: "mousedown",  fn: mouseDown },
    UP      : { key: "mouseup",    fn: mouseUp },
    MOVE    : { key: "mousemove",  fn: mouseMove },
    CLICK   : { key: "click",      fn: click },
    DBLCLICK: { key: "dblclick",   fn: dblClick }
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
            get offset() { return Math.max(this.position.x - this.startPosition.x, this.position.y - this.startPosition.y) },
            get xOffset() { return this.position.x - this.startPosition.x },
            get yOffset() { return this.position.y - this.startPosition.y }
        };

        // JHR: this is populated from the feature
        grid.dblClickEvents = grid.dblClickEvents || [];

        await enableEvents(grid, mouseEvents.DOWN, mouseEvents.DBLCLICK);
    }

    static async disable(grid) {
        await disableEvents(grid, mouseEvents.DOWN, mouseEvents.DBLCLICK);

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
        document.addEventListener(event.key, grid._events[event.key]);
    }
}

async function disableEvents(grid, ...events) {
    for (let event of events) {
        const handler = grid._events[event.key];
        document.removeEventListener(event.key, handler);
    }
}

async function mouseDown(event) {
    if (this._isMoving == true) {
        return;
    }

    if (event.button == 2) {
        return context(event);
    }

    await enableEvents(this, mouseEvents.UP, mouseEvents.MOVE);
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
    await disableEvents(this, mouseEvents.UP, mouseEvents.MOVE);

    if (this._input.time < 300 && this._input.offset < 5) {
        this._events[mouseEvents.CLICK.key](event);
    }

    await this._feature?.mouseUp?.(this, event, this._input);
    delete this._feature;
}

async function click(event) {
    if (event.target.classList.contains("column-header")) {
        return await this._sort?.perform(event.target);
    }

    if (event.target.dataset.action === "expand") {
        this.renderer.expand(this, event.target.dataset.path);
    }
}

async function dblClick(event) {
    /*
        Loop through the dbl click events and when you find something that matches the query. stop the loop and execute that intent.
     */


    const classes = event.target.classList;
    if (classes.contains("column-header")) {
        this.resize?.autoSize(this, event.target);
    }
}