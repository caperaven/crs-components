import {calculateRowWidth, generateRowRenderer} from "./data-grid-row-utils.js";

export class DataGridBase extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        this.refresh().catch(e => console.error(e));
    }

    async initialize(columnsDef) {
        this._columnsDef = columnsDef;

        const padding = 16;
        const textDimensions = this._ctx.measureText("T");
        const textHeight = Math.round(textDimensions.actualBoundingBoxAscent + textDimensions.actualBoundingBoxDescent);

        this.rowHeight = Math.round(textHeight + (padding * 2));
        this.rowWidth = calculateRowWidth(this._columnsDef);
        this.pageSize = this.rect.height / this.rowHeight + 10;

        const args = {
            columnsDef: this._columnsDef,
            rowWidth: this.rect.width,
            rowHeight: this.rowHeight,
            textHeight: textHeight,
            padding: padding
        }

        args.rowWidth = this.rowWidth;
        this.rowRenderer = generateRowRenderer(args);
    }

    async refresh() {
        this.startIndex = 0;
        this.endIndex = this.pageSize;

        await this._clearBackBuffer();
        crs.canvas.clear(this._ctx, "#ffffff");

        this.rows = new Map();
        await this._createBackBuffer(0, this.pageSize);
        this.marker.style.transform = `translate(${this.rowWidth}px, ${this.rowHeight * this.data.length}px)`
        await this._redrawAll();
    }

    async scroll(args) {
        this.offsetX = args.left;
        this.offsetY = args.top;
        await this._redrawAll();
    }
}