import {initialize, dispose} from "./initialize.js";
import {createColumns} from "./columns-helper.js";
import {calculateRowWidth} from "./data-grid-row-utils.js";

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
        this.minColumnWidth = 140;

        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        this._marker = this.querySelector(".scroll-marker");

        await initialize(this);
    }

    async disconnectedCallback() {
        await dispose(this);
        this._marker = null;
        this.canvas = null;
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
        this.columnsDef = columnsDef;
        this._columnResizeContext.columnsDef = columnsDef;
        await createColumns(this.querySelector(".grid-columns"), columnsDef);
    }

    /**
     * data has changed, redraw content
     * @returns {Promise<void>}
     */
    async _dataChanged() {
        this.startIndex = 0;
        this.endIndex = this.pageSize;

        await this._clearBackBuffer();
        await this._updateRenderFunction();

        this.rows = new Map();
        await this._createBackBuffer(0, this.pageSize);
        await this._render();
        this._marker.style.transform = `translate(${this.rowWidth}px, ${this.rowHeight * this.data.length}px)`;
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

    async sort(field) {
        console.log(field);
    }

    async structureChanged() {
        await this._updateRenderFunction();
        this.rowWidth = calculateRowWidth(this.columnsDef, this.minColumnWidth);
        const leftOffset = this.rowWidth / 2;

        this.rows.forEach(row => {
            if (row.ctx != null && row.isGroup != true) {
                crs.canvas.resizeCanvas(row.ctx, this.rowWidth, this.rowHeight);
                row.plane.scale.set(this.rowWidth, this.rowHeight, 1);
                this.canvasInflatorFn(this.data[row.index], row.ctx);
                row.plane.material.map.needsUpdate = true;
                row.plane.position.x = leftOffset;
            }
        })

        await this._update();
    }

    async swapColumns(startIndex, endIndex) {
        const def = this.columnsDef[startIndex];
        this.columnsDef.splice(startIndex, 1);
        this.columnsDef.splice(endIndex, 0, def);
        await this.structureChanged();
    }
}

customElements.define("data-grid-3d", DataGrid3D);
