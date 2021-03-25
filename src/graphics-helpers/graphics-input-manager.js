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
        this._timeLimit = 250;
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
        this._racycaster = null;
        this._bounds = null;
        return null;
    }

    async initialize(providers) {
        const Vector2 = await crs.getThreePrototype("Vector2");
        this._racycaster = await crs.createThreeObject("Raycaster");
        this._mouse = new Vector2();
        this._startMouse = new Vector2();
        this.width = this._canvas.width;
        this.height = this._canvas.height;

        this._bounds = this._canvas.getBoundingClientRect();
        this._canvas.addEventListener("mousemove", this._mouseMoveHandler);
    }

    async _mouseDown(event) {
        await this._updateMouseFromEvent(event, this._startMouse, this.width, this.height);
    }

    async _mouseMove(event) {
        await this._updateMouseFromEvent(event, this._mouse, this.width, this.height);
        requestAnimationFrame(this._moveTimerHandler);
    }

    async _mouseUp(event) {
        await this._updateMouseFromEvent(event, this._mouse, this.width, this.height);
    }

    async _moveTimer(time) {
        if (this._oldX == this._mouse.x && this._oldY == this._mouse.y) return;

        requestAnimationFrame(this._moveTimerHandler);

        if (time - this._lastTime > this._timeLimit) {
            this._lastTime = time;
            await this._rayCast();
        }

        this._oldX = this._mouse.x;
        this._oldY = this._mouse.y;
    }

    async _rayCast() {
        this._racycaster.setFromCamera(this._mouse, this._canvas.camera);
        const intersects = this._racycaster.intersectObjects(this._canvas.scene.children);
        console.log(intersects);
    }

    async _updateMouseFromEvent(event) {
        const x = event.clientX - this._bounds.x;
        const y = event.clientY - this._bounds.y;

        this._mouse.x = (x / this.width) * 2 - 1;
        this._mouse.y = - (y / this.height) * 2 + 1;
    }
}