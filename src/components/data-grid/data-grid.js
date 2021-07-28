import {Columns} from "./columns/columns-factory.js";
import {InputManager} from "./input-manager.js";

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
            this.rect = this.getBoundingClientRect();
            this.isReady = true;
            this.dispatchEvent(new CustomEvent("isReady"));
        })
    }

    async disconnectedCallback() {
        await InputManager.disable(this);
        await Columns.disable(this);

        this._group && await this._group.disable(this);
        this._sort && await this._sort.disable(this);
        this._resize && await this._resize.disable(this);
        this._move && await this._move.disable(this);

        this.renderer = this.renderer.disable(this);
        this.headerElement = null;
        this.bodyElement = null;
        this.footerElement = null;
        this.topElement = null;
    }

    async initialize(args) {
        this.settings = args;
        this.settings.scrollSpeed = this.settings.scrollSpeed || 5;

        await this._initHeaders();
        await this._initColumns();
        await this._initRows();
        await this._initFeatures();

        delete this.settings.columns;
        delete this.settings.headers;
        delete this.settings.data;
        delete this.settings.features;

        await InputManager.enable(this);
    }

    async _initHeaders() {
        if (this.settings.headers != null) {
            const headers = (await import("./headers/headers.js")).Headers;
            await headers.enable(this);
        }
    }

    async _initColumns() {
        this._startRowIndex = this.settings.headers != null ? 3 : 2;
        await Columns.enable(this, this.settings.columns);
    }

    async _initRows() {
        this.renderer = (await import(paths[this.settings.type])).default;
        await this.renderer.enable(this, this.settings.data);
    }

    async _initFeatures() {
        if (this.settings.features == null) return;

        if (this.settings.features.group == true) {
            this.group = (await import("./features/group.js")).default;
            await this.group.enable(this);
        }

        if (this.settings.features.move == true) {
            this.move = (await import("./features/move.js")).default;
            await this.move.enable(this);
        }

        if (this.settings.features.sort == true) {
            this.sort = (await import("./features/sort.js")).default;
            await this.sort.enable(this);
        }

        if (this.settings.features.resize == true) {
            this.resize = (await import("./features/resize.js")).default;
            await this.resize.enable(this);
        }
    }

    async moveColumns(start, end) {
        await this.move?.moveColumn(this, start, end);
    }

    async getCaption(field) {
        const column = this._columns.find(item => item.field === field);
        return column.title;
    }
}

customElements.define("data-grid", DataGrid);