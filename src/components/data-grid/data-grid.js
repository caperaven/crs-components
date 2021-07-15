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
        await this._initColumns(args.columns);
        await this._initRows(args.type, args.data);
        delete this.settings.columns;
        delete this.settings.data;
    }

    async _initColumns(columns) {
        await Columns.enable(this, columns);
    }

    async _initRows(type, data) {
        this.renderer = (await import(paths[type])).default;
        await this.renderer.enable(this, data);
    }
}

customElements.define("data-grid", DataGrid);