import {Columns} from "./columns/columns-factory.js";

export const RowRenderer = Object.freeze({
    STATIC      : "static",
    DYNAMIC     : "dynamic",
    VIRTUAL     : "virtualized"
})

const paths = Object.freeze({
    [RowRenderer.STATIC]: "./rows/static-rows.js",
    [RowRenderer.DYNAMIC]: "./rows/dynamic-rows.js",
    [RowRenderer.VIRTUAL]: "./rows/virtual-rows.js",
    undefined: "./rows/static-rows.js"
})

export class DataGrid extends HTMLElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    async connectedCallback() {
        this.innerHTML = await crsbinding.templates.get("DataGrid", this.html);
        requestAnimationFrame(() => {
            this.headerElement = this.querySelector(".header");
            this.bodyElement = this.querySelector(".body");
            this.footerElement = this.querySelector(".footer");
            this.isReady = true;
            this.dispatchEvent(new CustomEvent("isReady"));
        })
    }

    async disconnectedCallback() {
        await Columns.disable(this);
        this.renderer = this.renderer.disable(this);
        this.headerElement = null;
        this.bodyElement = null;
        this.footerElement = null;
    }

    async initialize(args) {
        this.settings = args;
        await this._initHeaders();
        await this._initColumns();
        await this._initRows();
        delete this.settings.columns;
        delete this.settings.data;
    }

    async _initHeaders() {
        if (this.settings.headers != null) {
            const headers = (await import("./headers/headers.js")).Headers;
            await headers.enable(this);
        }
    }

    async _initColumns() {
        await Columns.enable(this, this.settings.columns);
    }

    async _initRows() {
        this.renderer = (await import(paths[this.settings.type])).default;
        await this.renderer.enable(this, this.settings.data);
    }
}

customElements.define("data-grid", DataGrid);