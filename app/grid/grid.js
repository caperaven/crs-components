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
                    "width": "100"
                },
                {
                    "field": "description",
                    "type": "string",
                    "width": "300"
                },
                {
                    "field": "isActive",
                    "type": "boolean",
                    "width": "50"
                },
                {
                    "field": "field1",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field2",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field3",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field4",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field5",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field6",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field7",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field8",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field9",
                    "type": "string",
                    "width": "100"
                },
                {
                    "field": "field10",
                    "type": "string",
                    "width": "100"
                },
            ]);
            this.grid.data = createData(100);
        })
    }
}