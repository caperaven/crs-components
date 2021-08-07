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
            const data = createData(100000);
            this.grid.initialize({
                columns: columns,
                headers: headers,
                data: data,
                type: "static",
                pageSize: 100 ,
                scrollSpeed: 10,
                features: {
                    group: true,
                    sort: true,
                    move: true,
                    resize: true
                },
                translations: {
                    groupText: "drop here to group..."
                }
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