import {Columns} from "./columns/columns-factory.js";

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
        this.headerElement = null;
        this.bodyElement = null;
        this.footerElement = null;
    }

    async initialize(args) {
        await this._initColumns(args.columns);
    }

    async _initColumns(columns) {
        await Columns.enable(this, columns);
    }
}

customElements.define("data-grid", DataGrid);