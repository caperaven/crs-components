import {schema} from "./schema.js";
import {GraphicsParser} from "../../src/graphics-providers/graphics-parser.js";

export default class GraphicsProgram extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        const parent = document.querySelector(".canvas-parent");
        const parser = new GraphicsParser();
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});
        await parser.dispose();
    }

    async disconnectedCallback() {
        this._program = this._program.dispose();
        await super.disconnectedCallback();
    }
}