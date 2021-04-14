export class Program {
    constructor() {
        this._disposables = [];
        return this;
    }

    async dispose() {
        this._disposables = await disposeItems(this._disposables);
        this.canvas = null;

        return null;
    }

    async render() {
        this.canvas.render();
    }
}

async function disposeItems(disposables) {
    for (let i = 0; i < disposables.length; i++) {
        const disposable = disposables[i];
        if (Array.isArray(disposable)) {
            disposable.length = 0;
        }
        else if (disposable.constructor.name == "Map") {
            disposable.clear();
        }
        else if (typeof disposable == "function") {
            await disposable();
        }
        else if (disposable.dispose != null) {
            await disposable.dispose();
        }
        disposables[i] = null;
    }
    disposables.length = 0;
    return null;
}