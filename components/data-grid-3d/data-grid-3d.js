import {initialize, dispose} from "./initialize.js";
import {createColumns} from "./columns-helper.js";

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
        await this._rowFactory.updateRenderFunction(columnsDef);
    }

    /**
     * data has changed, redraw content
     * @returns {Promise<void>}
     */
    async _dataChanged() {
        this._marker.style.transform = `translate(${this._rowFactory.dimensions.rowWidth}px, ${this._rowFactory.dimensions.rowHeight * this.data.length}px)`;
        const cacheSize = this.data.length < 200 ? this.data.length : 200;
        await this._rowFactory.initialize(cacheSize);

        this._renderer.render(0, this.pageSize);
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
        return this._renderer.structureChanged();
    }

    async swapColumns(startIndex, endIndex) {
        const def = this.columnsDef[startIndex];
        this.columnsDef.splice(startIndex, 1);
        this.columnsDef.splice(endIndex, 0, def);
        await this.structureChanged();
    }
}

customElements.define("data-grid-3d", DataGrid3D);
