import {createData} from "./datafactory.js";
import "./../../src/components/data-grid/data-grid.js";
import {columns} from "./columns.js";
import {headers} from "./headers.js";
import StaticRows from "./../../src/components/data-grid/rows/static-rows.js";

import {getGroupDescriptor} from "./../../src/lib/data-utils/group-descriptor.js";

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
                pageSize: 100,
                scrollSpeed: 10,
                features: {
                    // group       : true,
                    // sort        : true,
                    // move        : true,
                    // resize      : true,
                    // multiSelect : true  // add checkboxes and on selection fire "onSelectionChanged" event
                },
                // events: {
                //     /* actions to perform when a grid requests */
                //     onGrouping:     (event) => { /* group the data */ },
                //     onEdit:         (event) => { /* perform edit cell operations */ },
                //     onSelection:    (event) => { /* selection changed */ }
                // },
                // plugins: [
                //     /* Plugin to add to grid that will execute on either of the events defined, all conditional logic is in the formatter */
                //     /*
                //          1. How do I register a plugin after the fact
                //     */
                //     new Formatter("afterNew,afterEdit,onAttach"),
                //     new CellEditor("onEdit")
                // ],
                // NB Use binding engine translations
                //grouping: ["month", "isActive", "value"]
            })

            // this.grid.addPlugin(...)
            // this.grid.removePlugin(...)
            // this.grid.swapPlugin(...)
            // this.grid.onEvent("onEdit", () => {})
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

    async moveRight() {
        this.grid.moveColumns(2, 10);
    }

    async group() {
        const t0 = performance.now();
        const descriptor = getGroupDescriptor(["month", "isActive", "value"], this.grid._data);
        const t1 = performance.now();

        console.log(t1 - t0);
        console.log(descriptor);
    }
}