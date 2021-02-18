import {generateRowRenderer, calculateRowWidth} from "./data-grid-row-utils.js";
import {createScrollBox} from "./scrollbox.js";

class DataGrid extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        this.refresh().catch(e => console.error(e));
    }

    async connectedCallback() {
        this.scrollHandler = this.scroll.bind(this);
        this.style.position = "relative";
        this.offsetX = 0;
        this.offsetY = 0;

        requestAnimationFrame(async () => {
            this.rect = this.getBoundingClientRect();
            createScrollBox(this);

            this._ctx = crs.canvas.create(this.rect.width, this.rect.height);
            this.appendChild(this._ctx.canvas);
            this.dispatchEvent(new CustomEvent("ready"));
        });
    }

    async disconnectedCallback() {
        await this._clearBackBuffer();

        this._ctx = null;
        this._columnsDef = null;
    }

    async initialize(columnsDef) {
        this._columnsDef = columnsDef;

        const padding = 16;
        const textDimensions = this._ctx.measureText("T");
        const textHeight = Math.round(textDimensions.actualBoundingBoxAscent + textDimensions.actualBoundingBoxDescent);

        this.rowHeight = Math.round(textHeight + (padding * 2));
        this.rowWidth = calculateRowWidth(this._columnsDef);
        this.pageSize = this.rect.height / this.rowHeight + 5;

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
        let index = 0;

        await this._clearBackBuffer();
        crs.canvas.clear(this._ctx, "#ffffff");

        this.rows = new Map();
        for (let row of this.data || []) {
            const ctx = await this.rowRenderer(row);
            this.rows.set(row.id, {ctx: ctx, index: index});
            index ++;
        }

        this.marker.style.transform = `translate(${this.rowWidth}px, ${this.rowHeight * this.data.length}px)`
        await this._redrawAll();
    }

    async _clearBackBuffer() {
        if (this.rows != null) {
            Array.from(this.rows).forEach(row => row[1] = null);
            this.rows.clear();
        }
    }

    async redrawItem(id) {
        const target = this.rows.get(id);
        this._ctx.drawImage(target.ctx.canvas, -this.offsetX, target.index * this.rowHeight - this.offsetY);
    }

    async _redrawAll() {
        crs.canvas.clear(this._ctx, "#ffffff");
        for (let row of this.data) {
            await this.redrawItem(row.id);
        }
    }

    async scroll(args) {
        this.offsetX = args.left;
        this.offsetY = args.top;
        await this._redrawAll();
    }
}

customElements.define("data-grid", DataGrid)