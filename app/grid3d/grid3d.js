import {createData} from "./datafactory.js";
import "./../../src/components/data-grid/data-grid.js";
import {columns} from "./columns.js";
import {headers} from "./headers.js";

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
                pageSize: 20
            })
        })
    }

    async disconnectedCallback() {
        this.grid = null;
    }
}