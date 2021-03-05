import {calculateRowWidth, createRowItem, generateRowRenderer} from "./data-grid-row-utils.js";

export async function enableRowRendering(parent) {
    parent._clearBackBuffer = _clearBackBuffer;
    parent._createBackBuffer = _createBackBuffer;
    parent._render = _render;
    parent._renderRowById = _renderRowById;
    parent._updateRenderFunction = updateRenderFunction;
}

export async function disableRowRendering(parent) {
    parent._clearBackBuffer = null;
    parent._createBackBuffer = null;
    parent._render = null;
    parent._renderRowById = null;
}

async function updateRenderFunction() {
    const padding = 16;
    // THis should be calculated according to the pixel hight of the font.
    const textHeight = 12;

    this.rowHeight = Math.round(textHeight + (padding * 2));
    this.rowWidth = calculateRowWidth(this.columnsDef, this.minColumnWidth);
    this.pageSize = (this.height / this.rowHeight) * 2;
    this.virtualSize = Math.round(this.pageSize / 4);
    this._orthographicResponder.callbackMargin = this.virtualSize * this.rowHeight;

    const args = {
        columnsDef: this.columnsDef,
        rowWidth: this.offsetWidth,
        rowHeight: this.rowHeight,
        textHeight: textHeight,
        padding: padding,
        minWidth: 140
    }

    args.rowWidth = this.rowWidth;

    this.canvasInflatorFn = await generateRowRenderer(args);
}

async function _clearBackBuffer() {
    if (this.rows != null) {
        Array.from(this.rows).forEach(row => row[1] = null);
        this.rows.clear();
    }
}

async function _createBackBuffer(startIndex, endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
        if (i > this._lastDataIndex) break;
        const row = this.data[i];

        const data = this.rows.get(row.id);
        if (data == null || data.ctx == null) {
            const ctx = crs.canvas.createCanvasForTexture(this.rowWidth, this.rowHeight);
            await this.canvasInflatorFn(row, ctx);
            this.rows.set(row.id, {ctx: ctx, index: i});
        }
    }
}

async function _render() {
    const top = this.rowHeight / 2;
    const leftOffset = this.rowWidth / 2;

    let i = 0;
    for (i; i < this.pageSize; i++) {
        await this._renderRowById(this.data[i].id, top, leftOffset)
    }

    this.bottomIndex = i;

    this.canvas.render();
    // return this.animate();
}

async function _renderRowById(id, top, leftOffset) {
    const row = this.rows.get(id);
    const width = Number(row.ctx.canvas.width);
    const plane = await createRowItem(width, this.rowHeight, row.ctx);

    const nextTop = top + (row.index * this.rowHeight);
    this.canvas.canvasPlace(plane, leftOffset, nextTop);
    this.canvas.scene.add(plane);
    row.plane = plane;
}