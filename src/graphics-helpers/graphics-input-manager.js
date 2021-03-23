export async function enableInputManager(canvas, providers) {
    const manager = new InputManager(canvas, providers);
    await manager.initialize();
    canvas._inputManager = manager;
}

export async function disableInputManager(canvas) {
    canvas._inputManager = canvas._inputManager.dispose();
}

class InputManager {
    constructor(canvas, providers) {
        this._canvas = canvas;
        this._providers = [];
        this._mouseDownHandler = this._mouseDown.bind(this);
        this._mouseMoveHandler = this._mouseMove.bind(this);
        this._mouseUpHandler = this._mouseUp.bind(this);
    }

    dispose() {
        this._canvas = null;
        this._providers = null;
        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;
        return null;
    }

    async initialize() {
        const Vector2 = crs.getThreePrototype("Vector2");
        this._mouse = new Vector2();
        this._startMouse = new Vector2();
    }

    async _mouseDown(event) {
        await updateMouseFromEvent(this._startMouse, event, this.width, this.height);
    }

    async _mouseMove(event) {
        await updateMouseFromEvent(this._mouse, event, this.width, this.height);
    }

    async _mouseUp(event) {

    }
}

async function updateMouseFromEvent(event, mouse, width, height) {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = - (event.clientY / height) * 2 + 1;
}