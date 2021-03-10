import "./../../components/charts/crs-simple-bar.js";
import {getData} from "./data-factory.js";

export default class SimpleBarChart extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("simple-bar-chart");
        this.canvas.addEventListener("ready", () => this.canvas.data = getData(100));
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        this.canvas = null;
    }

    async update() {
        this.canvas.render();
    }
}