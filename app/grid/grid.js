import "./../../components/data-grid/data-grid.js"
import {createData} from "./datafactory.js";
import {columnsDef} from "./columns-def.js";

export default class Grid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.grid = document.querySelector("data-grid");

        this.grid.addEventListener("ready", async () => {
            await this.grid.initialize(columnsDef);
            this.grid.data = createData(100);
        })
    }
}