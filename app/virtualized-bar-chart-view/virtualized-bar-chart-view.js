import "./../../components/charts/crs-virtualized-bar.js";
import {getData} from "./data-factory.js";

export default class VirtualizedBarChartView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("virtualized-bar-chart");
        this.canvas.addEventListener("ready", () => this.canvas.data = getData(100));
    }

    async disconnectedCallback() {
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async test() {
        alert("test");
    }
}