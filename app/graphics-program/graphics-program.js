import {schema} from "./schema.js";
import {GraphicsParser} from "../../src/gfx-providers/graphics-parser.js";

export default class GraphicsProgram extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        const parent = document.querySelector(".canvas-parent");
        const parser = new GraphicsParser();
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});

        const layers = [];
        for (let layer of this._program._layers) {
            layers.push({
                id: layer.id,

            })
        }

        await parser.dispose();
    }

    async disconnectedCallback() {
        this._program = this._program.dispose();
        await super.disconnectedCallback();
    }
}