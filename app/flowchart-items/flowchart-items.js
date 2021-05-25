import "./../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {schema} from "./schema.js";

export default class FlowchartItems extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        const parent = document.querySelector(".canvas-parent");
        const parser = await crs.modules.getInstanceOf("GraphicsParser");
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});
        await parser.dispose();

        this._program.render();
    }

    async disconnectedCallback() {
        this.parent = null;
        this._program = await this._program.dispose();
        await super.disconnectedCallback();
    }
}