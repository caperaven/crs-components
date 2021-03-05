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

    async structureChanged() {
        await this._updateRenderFunction();

        this.rows.forEach(row => {
            if (row.ctx != null) {
                this.canvasInflatorFn(this.data[row.index], row.ctx);
                row.plane.material.map.needsUpdate = true;
            }
        });

        await this._update();
    }
}

customElements.define("data-grid-3d", DataGrid3D);
