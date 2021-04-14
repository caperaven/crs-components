import "../../../src/components/charts/crs-virtualized-bar.js";
import {getData} from "./data-factory.js";

export default class VirtualizedBarChartView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("virtualized-bar-chart");
        this.canvas.addEventListener("ready", () => this.canvas.data = getData(1000));
    }

    async preLoad() {
        this.setProperty("index", 0);
    }

    async disconnectedCallback() {
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async indexChanged(value) {
        if (this.canvas == null) return;
        await this.canvas.updateGraphics(value);
    }

    async refresh() {
        this.canvas.data = getData(1000);
        this.setProperty("index", 0);
    }
}