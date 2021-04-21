import {schema} from "./schema.js";

export default class GraphicsProgram extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        // JHR: investigate extending binding engine to use modules.
        await crs.modules.get("program-layers");

        const parent = document.querySelector(".canvas-parent");
        const parser = await crs.modules.getInstanceOf("GraphicsParser");
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});
        await parser.dispose();

        this.setProperty("program", this._program);

        this._program.render();
    }

    async disconnectedCallback() {
        this._program = this._program.dispose();
        await super.disconnectedCallback();
    }

    async update() {
        this._program.render();
    }
}