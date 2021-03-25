export async function enableInputManager(canvas, providers) {
    const manager = new InputManager(canvas, providers);
    await manager.initialize(providers);
    canvas._inputManager = manager;
}

export async function disableInputManager(canvas) {
    canvas._inputManager = canvas._inputManager.dispose();
}

class InputManager {
    constructor(canvas) {
        this._oldX = 0;
        this._oldY = 0;
        this._lastTime = 0;
        this._canvas = canvas;
        this._providers = [];
        this._mouseDownHandler = this._mouseDown.bind(this);
        this._mouseMoveHandler = this._mouseMove.bind(this);
        this._mouseUpHandler = this._mouseUp.bind(this);
        this._moveTimerHandler = this._moveTimer.bind(this);
    }

    dispose() {
        this._canvas = null;
        this._providers = null;
        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;
        this._moveTimerHandler = null;
        return null;
    }

    async initialize(providers) {
        const Vector2 = await crs.getThreePrototype("Vector2");
        this._mouse = new Vector2();
        this._startMouse = new Vector2();
        this.width = this._canvas.width;
        this.height = this._canvas.height;

        this._canvas.addEventListener("mousemove", this._mouseMoveHandler);
    }

    async _mouseDown(event) {
        await updateMouseFromEvent(event, this._startMouse, this.width, this.height);
    }

    async _mouseMove(event) {
        await updateMouseFromEvent(event, this._mouse, this.width, this.height);
        requestAnimationFrame(this._moveTimerHandler);
    }

    async _mouseUp(event) {
        await updateMouseFromEvent(event, this._mouse, this.width, this.height);
    }

    async _moveTimer(time) {
        if (this._oldX == this._mouse.x && this._oldY == this._mouse.y) return;

        requestAnimationFrame(this._moveTimerHandler);

        if (time - this._lastTime > 1000) {
            this._lastTime = time;
            console.log("scroll fired");
        }

        this._oldX = this._mouse.x;
        this._oldY = this._mouse.y;
    }
}

async function updateMouseFromEvent(event, mouse, width, height) {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = - (event.clientY / height) * 2 + 1;
}