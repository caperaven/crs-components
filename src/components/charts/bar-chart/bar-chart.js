import {schema} from "./bar-chart-program.js";
import {GraphicsParser} from "./../../../graphics-providers/graphics-parser.js";

export class BarChart extends HTMLElement {
    connectedCallback() {
        this.initialize().catch(e => console.error(e));
    }

    async initialize() {
        const parser = new GraphicsParser();
        await parser.initialize();
        this._program = await parser.parse(schema, this);
        this.dispatchEvent(new CustomEvent("ready"));
    }

    disconnectedCallback() {
        this._program = this._program.dispose();
    }
}

customElements.define("crs-bar-chart", BarChart);