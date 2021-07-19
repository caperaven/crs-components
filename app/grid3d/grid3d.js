import {createData} from "./datafactory.js";
import "./../../src/components/data-grid/data-grid.js";
import {columns} from "./columns.js";
import {headers} from "./headers.js";
import StaticRows from "./../../src/components/data-grid/rows/static-rows.js";

export default class Grid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.grid = document.querySelector("data-grid");

        this.grid.addEventListener("isReady", () => {
            const data = createData(1000);
            this.grid.initialize({
                columns: columns,
                headers: headers,
                data: data,
                type: "static",
                pageSize: 4
            })
        })
    }

    async disconnectedCallback() {
        this.grid = null;
    }

    async next() {
        await StaticRows.nextPage(this.grid);
    }

    async previous() {
        await StaticRows.previousPage(this.grid);
    }
}