import {calculateRowWidth, createRowItem, generateRowRenderer} from "./_row-utils.js";

export async function enableRowRendering(parent) {
    parent._clearBackBuffer = _clearBackBuffer;
    parent._createBackBuffer = _createBackBuffer;
    parent._render = _render;
    parent._renderRowById = _renderRowById;
    parent._updateRenderFunction = updateRenderFunction;
    parent._update = _update;
    parent._groupRenderer = groupRenderer;
}

export async function disableRowRendering(parent) {
    parent._clearBackBuffer = null;
    parent._createBackBuffer = null;
    parent._render = null;
    parent._renderRowById = null;
    parent._groupRenderer = null;
}

async function groupRenderer(row, ctx) {
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "16px serif";
    ctx.fillText(row.title, 16, 22);
    ctx.fillText(row.descriptor, this.width - 100, 22);
    return ctx;
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
            if (row.__isGroup == true) {
                const ctx = crs.canvas.createCanvasForTexture(this.width, 44);
                await this._groupRenderer(row, ctx);
                this.rows.set(row.id, {ctx: ctx, index: i, isGroup: true});
            }
            else {
                const ctx = crs.canvas.createCanvasForTexture(this.rowWidth, this.rowHeight);
                await this.canvasInflatorFn(row, ctx);
                this.rows.set(row.id, {ctx: ctx, index: i});
            }
        }
    }
}

async function _render() {
    const top = this.rowHeight / 2;
    const leftOffset = this.rowWidth / 2;

    let i = 0;
    for (i; i < this.pageSize; i++) {
        if (i > this.data.length -1) break;
        await this._renderRowById(this.data[i].id, top, leftOffset, i)
    }

    this.bottomIndex = i;

    this.canvas.render();
    // return this.animate();
}

async function _renderRowById(id, top, leftOffset, index) {
    const row = this.rows.get(id);
    const x = row.isGroup == true ? this.width / 2 : leftOffset;
    const width = Number(row.ctx.canvas.width);
    const plane = await createRowItem(width, this.rowHeight, row.ctx);

    const nextTop = top + (index * this.rowHeight);
    this.canvas.canvasPlace(plane, x, nextTop);
    this.canvas.scene.add(plane);
    row.plane = plane;
}

async function _update() {
    this.canvas.render();
}