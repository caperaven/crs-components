import "./../../components/charts/crs-virtualized-box.js";
import {getData} from "./data-factory.js";

export default class VirtualizedBarChart extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("virtualized-bar-chart");
        this.canvas.addEventListener("ready", () => this.canvas.data = getData(100));
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        this.canvas = null;
    }

    async tpUpdate() {
        const index = this.getProperty("tpIndex") || 0;
        await this.canvas.updateColor(index, "#ff0090");

        this.canvas.render();
    }
}