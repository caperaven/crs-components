export async function addResizeEvent(target) {
    if (globalThis.crs == null || globalThis.crs.resize == null) {
        globalThis.crs = globalThis.crs || {};
        globalThis.crs.resize = new ResizeManager();
    }

    globalThis.crs.resize.add(target.resizeHandler);
}

export async function removeResize(target) {
    globalThis.crs.resize.remove(target.resizeHandler);
}

class ResizeManager {
    constructor() {
        this.callbacks = [];
        this._resizeHandler = this._resize.bind(this);
        window.addEventListener("resize", this._resizeHandler);
    }

    dispose() {
        this.callbacks.length = 0;
    }

    add(callback) {
        if (this.callbacks.indexOf(callback) == -1) {
            this.callbacks.push(callback);
        }
    }

    remove(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index != -1) {
            this.callbacks.splice(index, 1);
        }
    }

    async _resize() {
        let fromTime = Date.now();

        if (this._interval == null) {
            this._interval = setInterval(async () => {
                const toTime = Date.now();
                if (toTime - fromTime > 500) {
                    await this._notifyResize();
                    clearInterval(this._interval);
                    this._interval = null;
                    fromTime = toTime;
                }
            }, 500);
        }
    }

    async _notifyResize() {
        for (let callback of this.callbacks) {
            callback().catch(e => console.error(e));
        }
    }
}