import "../../src/components/charts/bar-chart/bar-chart.js";
import {getData} from "./data-factory.js";

export default class SimpleBarChart extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("crs-bar-chart");
        this.canvas.addEventListener("ready", () => this.canvas.draw(getData(100)));
    }

    async disconnectedCallback() {
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async update() {
        this.canvas.render();
    }
}