export async function enableOrthographicResponder(parent) {
    const orthographicCanvas = parent.querySelector("orthographic-canvas");
    const scrollBox = parent.querySelector(".scroll");

    const ready = async () => {
        parent._orthographicResponder = new OrthographicScrollResponder(orthographicCanvas, scrollBox);
        orthographicCanvas.removeEventListener("ready", ready);
    }

    orthographicCanvas.addEventListener("ready", ready);
}

export async function disableOrthographicResponder(parent) {
    parent._orthographicResponder.dispose();
    delete parent._orthographicResponder;
}

class OrthographicScrollResponder {
    constructor(orthographicCanvas, scrollBox) {
        this._orthographicCanvas = orthographicCanvas;
        this._scrollbox = scrollBox;

        this._scrollHandler = this._scroll.bind(this);
        this._scrollbox.addEventListener("scroll", this._scrollHandler);
        this._oldX = 0;
        this._oldY = 0;
    }

    dispose() {
        this._scrollbox.removeEventListener("scroll", this._scrollHandler);

        delete this._orthographicCanvas;
        delete this._scrollbox;

        this._scrollHandler = null;
    }

    async _scroll(event) {
        this._x = event.target.scrollLeft;
        this._y = event.target.scrollTop;
        const offsetX = this._orthographicCanvas.cameraStartLeft + (this._x - this._oldX);
        const offsetY = this._orthographicCanvas.cameraStartTop - (this._y - this._oldY);

        this._orthographicCanvas.camera.position.set(offsetX, offsetY, 0);
        await this._orthographicCanvas.render();

        this.oldX = this._x;
        this.oldY = this._y;
    }
}