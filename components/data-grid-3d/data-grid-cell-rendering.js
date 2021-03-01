export function enableCellRendering(parent) {
    parent._cellRendering = new CellRendering();
}

export function disableCellRendering(parent) {
    parent._cellRendering.dispose();
    delete parent._cellRendering;
}

class CellRendering {
    constructor() {
        this._renderers = new Map();
        this._buffers = new Map();
    }

    dispose() {
        this._renderers.clear();
        this._buffers.clear();
    }

    async addRenderer(datatype, renderer) {
        this._renderers.set(datatype, renderer);
    }

    async render(dataType, fieldName, value) {
        const key = `${fieldName}_${value}`;

    }
}