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
        }
    }

    async connectedCallback() {
        this.offsetX = 0;
        this.offsetY = 0;

        this.scrollHandler = this.scroll.bind(this);
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        await initialize(this)
    }

    async disconnectedCallback() {
        await dispose(this);

        this.scrollHandler = null;
    }

    /**
     * scroll event callback
     * @param args
     * @returns {Promise<void>}
     */
    async scroll(args) {
        this.offsetX = args.left;
        this.offsetY = args.top;
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
        this.rowWidth = calculateRowWidth(columnsDef);
        this.pageSize = this.height / this.rowHeight;

        const args = {
            columnsDef: columnsDef,
            rowWidth: this.offsetWidth,
            rowHeight: this.rowHeight,
            textHeight: textHeight,
            padding: padding
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
    }

    async _clearBackBuffer() {
        if (this.rows != null) {
            Array.from(this.rows).forEach(row => row[1] = null);
            this.rows.clear();
        }
    }

    async _createBackBuffer(startIndex, endIndex) {
        for (let i = startIndex; i <= endIndex; i++) {
            const row = this.data[i];
            const ctx = await this.canvasInflatorFn(row);
            this.rows.set(row.id, {ctx: ctx, index: i});
        }
    }

    async _render() {
        const top = this.canvas.top - this.rowHeight / 2;
        for (let i = 0; i < 1; i++) {
            const row = this.rows.get(i);
            const width = Number(row.ctx.canvas.width);
            const plane = await createRowItem(width, this.rowHeight, row.ctx);

            const nextTop = top - (row.index * this.rowHeight);
            plane.position.y = nextTop;
            this.canvas.scene.add(plane);
        }
        this.canvas.render();
        this.animate();
    }

    async animate() {
        requestAnimationFrame(() => {
            this.canvas.render();
            this.animate();
        });
    }
}

customElements.define("data-grid-3d", DataGrid3D);