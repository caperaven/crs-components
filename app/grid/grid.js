import "./../../components/data-grid/data-grid.js"
import {createData} from "./datafactory.js";

export default class Grid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.grid = document.querySelector("data-grid");

        this.grid.addEventListener("ready", async () => {
            await this.grid.initialize([
                {
                    "field": "code",
                    "type": "string",
                    "width": "200"
                },
                {
                    "field": "isActive",
                    "type": "boolean",
                    "width": "50"
                }
            ])
            this.grid.data = createData(100);
        })
    }
}