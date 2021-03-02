import {initialize, dispose} from "./initialize.js";
import {createColumns} from "./columns-helper.js";
import {generateRowRenderer, calculateRowWidth, createRowItem} from "./data-grid-row-utils.js";

class DataGrid3D extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        if (this._isReady == true) {
            this._dataChanged().catch(e => console.error(e));
            this._lastDataIndex = newValue.length -1;
        }
    }

    async connectedCallback() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.minColumnWidth = 140;

        this.scrollHandler = this.scroll.bind(this);
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        this._marker = this.querySelector(".scroll-marker");

        await initialize(this);
    }

    async disconnectedCallback() {
        await dispose(this);
        this._marker = null;
        this.canvas = null;
        this.scrollHandler = null;
    }

    /**
     * called when the canvas is initialized and ready to use
     * @returns {Promise<void>}
     */
    async ready() {
        const canvas = this.querySelector("canvas");
        this.width = Number(canvas.getAttribute("width"));
        this.height = Number(canvas.getAttribute("height"));
        this.dispatchEvent(new CustomEvent("ready"));
    }

    /**
     * Initialize grid with query definition
     * @param columnsDef
     * @returns {Promise<void>}
     */
    async initialize(columnsDef) {
        await createColumns(this.querySelector(".grid-columns"), columnsDef);

        const padding = 16;
        // THis should be calculated according to the pixel hight of the font.
        const textHeight = 12;

        this.rowHeight = Math.round(textHeight + (padding * 2));
        this.rowWidth = calculateRowWidth(columnsDef, this.minColumnWidth);
        this.pageSize = (this.height / this.rowHeight) * 2;
        this.virtualSize = Math.round(this.pageSize / 4);
        this._orthographicResponder.callbackMargin = this.virtualSize * this.rowHeight;

        const args = {
            columnsDef: columnsDef,
            rowWidth: this.offsetWidth,
            rowHeight: this.rowHeight,
            textHeight: textHeight,
            padding: padding,
            minWidth: 140
        }

        args.rowWidth = this.rowWidth;

        this.canvasInflatorFn = await generateRowRenderer(args);
    }

    /**
     * data has changed, redraw content
     * @returns {Promise<void>}
     */
    async _dataChanged() {
        this.startIndex = 0;
        this.endIndex = this.pageSize;

        await this._clearBackBuffer();

        this.rows = new Map();
        await this._createBackBuffer(0, this.pageSize);
        await this._render();
        this._marker.style.transform = `translate(${this.rowWidth}px, ${this.rowHeight * this.data.length}px)`;
    }

    async _clearBackBuffer() {
        if (this.rows != null) {
            Array.from(this.rows).forEach(row => row[1] = null);
            this.rows.clear();
        }
    }

    async _createBackBuffer(startIndex, endIndex) {
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

    async _render() {
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

    async _renderRowById(id, top, leftOffset) {
        const row = this.rows.get(id);
        const width = Number(row.ctx.canvas.width);
        const plane = await createRowItem(width, this.rowHeight, row.ctx);

        const nextTop = top + (row.index * this.rowHeight);
        this.canvas.canvasPlace(plane, leftOffset, nextTop);
        this.canvas.scene.add(plane);
        row.plane = plane;
    }

    /**
     * Temp for debugging purposes so that it will auto render
     * @returns {Promise<void>}
     */
    async animate() {
        if (this.canvas == null) return;
        requestAnimationFrame(() => {
            this.canvas.render();
            this.animate();
        });
    }

    async drop(element, placeholder, dropTarget) {
        const dropFn = dropTarget.dataset.drop || dropTarget.parentElement.dataset.drop;
        if (this[dropFn] != null) {
            await this[dropFn](element, placeholder, dropTarget);
        }
    }

    async virtualizeBottomCallback() {
        const top = this.rowHeight / 2;
        const leftOffset = this.rowWidth / 2;
        const start = this.bottomIndex;
        const end = this.bottomIndex + this.virtualSize;
        await this._createBackBuffer(this.bottomIndex, this.bottomIndex + this.virtualSize);
        for (let i = start; i < end; i++) {
            if (i > this._lastDataIndex) break;
            await this._renderRowById(this.data[i].id, top, leftOffset);
        }
        this.bottomIndex = end;
    }

    async virtualizeTopCallback() {
        console.log("virtualize top");
    }
}

customElements.define("data-grid-3d", DataGrid3D);
