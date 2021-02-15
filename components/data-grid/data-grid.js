import {createCanvas} from "./../canvas-utils/canvas.js"
import {generateRowRenderer} from "./data-grid-row-utils.js";

class DataGrid extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        this.refresh().catch(e => console.error(e));
    }

    async connectedCallback() {
        requestAnimationFrame(async () => {
            this.rect = this.getBoundingClientRect();
            this._ctx = crs.canvas.create(this.rect.width, this.rect.height, "#ffffff");
            this.appendChild(this._ctx.canvas);
            this.dispatchEvent(new CustomEvent("ready"));
        });
    }

    async disconnectedCallback() {
        this._ctx = null;
        this._columnsDef = null;
    }

    async initialize(columnsDef) {
        this._columnsDef = columnsDef;

        const padding = 8;
        const textDimensions = this._ctx.measureText("T");
        const textHeight = Math.round(textDimensions.actualBoundingBoxAscent + textDimensions.actualBoundingBoxDescent);

        this.rowHeight = Math.round(textHeight + (padding * 2));

        const args = {
            columnsDef: this._columnsDef,
            rowWidth: this.rect.width,
            rowHeight: this.rowHeight,
            textHeight: textHeight,
            padding: padding
        }

        this.rowRenderer = generateRowRenderer(args);
    }

    async refresh() {
        let index = 0;
        this.rows = new Map();
        for (let row of this.data || []) {
            const ctx = await this.rowRenderer(row);
            this.rows.set(row.id, {ctx: ctx, index: index});
            index ++;
        }

        // Temp
        this.stressHandler = this.stress.bind(this);
        await this.stress();
    }

    async redraw(id) {
        const target = this.rows.get(id);
        this._ctx.drawImage(target.ctx.canvas, 0, target.index * this.rowHeight);
    }

    async stress() {
        requestAnimationFrame(this.stressHandler);
        this._ctx.save();
        this._ctx.fillStyle = "#ffffff";
        this._ctx.fillRect(0, 0, this.rect.width, this.rect.height);
        this._ctx.restore();

        for (let row of this.data) {
            await this.redraw(row.id);
        }
    }
}

customElements.define("data-grid", DataGrid)