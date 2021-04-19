import {schema} from "./schema.js";
import {MsdfFont} from "../../src/msdf/msdf-font.js";

export default class Msdf extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        const parent = document.querySelector(".canvas-parent");
        const parser = await crs.modules.getInstanceOf("GraphicsParser");
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});
        await parser.dispose();
    }

    async disconnectedCallback() {
        this._program = this._program.dispose();
        await super.disconnectedCallback();
    }
}