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
        this.orthographicCanvas = orthographicCanvas;
        this.scrollbox = scrollBox;
    }

    dispose() {
        delete this.orthographicCanvas;
        delete this.scrollbox;
    }
}