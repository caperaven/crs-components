export async function enableOrthographicDraggable(orthographicCanvas, lockX = false, lockY = false) {
    orthographicCanvas._draggable = new OrthographicDraggable(orthographicCanvas);
    orthographicCanvas._draggable.lockX = lockX;
    orthographicCanvas._draggable.lockY = lockY;
}

export async function disableOrthographicDraggable(orthographicCanvas) {
    orthographicCanvas._draggable.dispose();
    delete orthographicCanvas._draggable;
}

class OrthographicDraggable {
    get enabled() {
        return this._enabled;
    }

    set enabled(newValue) {
        this._enabled = newValue;

        if (newValue == false) {
            this.canvas && this.canvas.removeEventListener("mousedown", this._mouseDownHandler);
        }
        else {
            this.canvas && this.canvas.addEventListener("mousedown", this._mouseDownHandler);
        }
    }

    constructor(orthographicCanvas) {
        this._mouseDownHandler = this._mouseDown.bind(this);
        this._mouseUpHandler = this._mouseUp.bind(this);
        this._mouseMoveHandler = this._mouseMove.bind(this);

        this._orthographicCanvas = orthographicCanvas;

        this.canvas = orthographicCanvas.querySelector("canvas");
        this.lockX = false;
        this.lockY = false;
        this.enabled = true;
    }

    dispose() {
        this.enabled = false;
        delete this._orthographicCanvas;
        delete this.canvas;

        this._mouseDownHandler = null;
        this._mouseUpHandler = null;
        this._mouseMoveHandler = null;
    }

    async _mouseDown(event) {
        this.oldX = event.clientX;
        this.oldY = event.clientY;
        this.canvas.addEventListener("mousemove", this._mouseMoveHandler);
        this.canvas.addEventListener("mouseup", this._mouseUpHandler);
    }

    async _mouseUp(event) {
        this.canvas.removeEventListener("mousemove", this._mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this._mouseUpHandler);
    }

    async _mouseMove(event) {
        this.x = event.clientX;
        this.y = event.clientY;
        const offsetX = (this.x - this.oldX);
        const offsetY = (this.y - this.oldY);

        const current = this._orthographicCanvas.camera.position;
        const x = this.lockX == true ? current.x : current.x - offsetX;
        const y = this.lockY == true ? current.y : current.y + offsetY;

        this._orthographicCanvas.camera.position.set(x, y, current.z);
        await this._orthographicCanvas.render();

        this.oldX = this.x;
        this.oldY = this.y;
    }
}