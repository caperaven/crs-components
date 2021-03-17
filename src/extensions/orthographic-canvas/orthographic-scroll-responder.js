export async function enableOrthographicResponder(parent, callbackMargin) {
    const orthographicCanvas = parent.querySelector("orthographic-canvas");
    const scrollBox = parent.querySelector(".scroll");

    const ready = async () => {
        const virtualizeBottomCallbackHandler = parent.virtualizeBottomCallback ? parent.virtualizeBottomCallback.bind(parent) : null;
        const virtualizeTopCallbackHandler = parent.virtualizeTopCallback ? parent.virtualizeTopCallback.bind(parent) : null;
        parent._orthographicResponder = new OrthographicScrollResponder(orthographicCanvas, scrollBox, virtualizeBottomCallbackHandler, virtualizeTopCallbackHandler, callbackMargin);
        orthographicCanvas.removeEventListener("ready", ready);
    }

    if (orthographicCanvas.isReady == true) {
        await ready();
    }
    else {
        orthographicCanvas.addEventListener("ready", ready);
    }
}

export async function disableOrthographicResponder(parent) {
    parent._orthographicResponder.dispose();
    delete parent._orthographicResponder;
}

class OrthographicScrollResponder {
    get callbackMargin() {
        return this._callbackMargin;
    }

    set callbackMargin(newValue) {
        this._callbackMargin = newValue;
        this._nextCallbackMargin = newValue;
    }

    constructor(orthographicCanvas, scrollBox, virtualizeBottomCallback, virtualizeTopCallback, callbackMargin) {
        this._oldY = 0;
        this._orthographicCanvas = orthographicCanvas;
        this._scrollbox = scrollBox;

        this._scrollHandler = this._scroll.bind(this);
        this._scrollbox.addEventListener("scroll", this._scrollHandler);
        this._prevCallbackMargin = 0;
        this._virtualizeBottomCallback = virtualizeBottomCallback;
        this._virtualizeTopCallback = virtualizeTopCallback;
        this.callbackMargin = callbackMargin;
    }

    dispose() {
        this._scrollbox.removeEventListener("scroll", this._scrollHandler);

        delete this._orthographicCanvas;
        delete this._scrollbox;

        this._scrollHandler = null;
    }

    async _scroll(event) {
        requestAnimationFrame(async () => {
            this._x = event.target.scrollLeft;
            this._y = event.target.scrollTop;
            const offsetX = this._orthographicCanvas.cameraStartLeft + this._x;
            const offsetY = this._orthographicCanvas.cameraStartTop - this._y;

            this._orthographicCanvas.camera.position.set(offsetX, offsetY, 0);
            await this._orthographicCanvas.render();

            if (this._y != this._oldY) {
                await this.updateMargins(this._y - this._oldY);
            }

            this._oldY = this._y;
        })
    }

    async updateMargins(direction) {
        if (this._callbackMargin != null) {
            if (direction > 0 && this._y >= this._nextCallbackMargin) {
                this._prevCallbackMargin = this._nextCallbackMargin;
                this._nextCallbackMargin = this._nextCallbackMargin + this._callbackMargin;
                this._virtualizeBottomCallback();
            }
            else if (this._y <= this._prevCallbackMargin) {
                this._prevCallbackMargin = this._prevCallbackMargin - this._callbackMargin;
                this._nextCallbackMargin = this._prevCallbackMargin;
                this._virtualizeTopCallback();
            }
        }
    }
}