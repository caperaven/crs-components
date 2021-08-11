import "./../../src/components/dropdown-button/dropdown-button.js";
import "./../../src/components/lists/unordered-list.js";
import {schema} from "./schema.js";

export default class InteractiveGraphics extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        await this.initialize();
    }

    async initialize() {
        const parent = document.querySelector(".canvas-parent");
        const parser = await crs.modules.getInstanceOf("GraphicsParser");
        await parser.initialize([]);
        this._program = await parser.parse(schema, parent, {background: "#ff0050"});
        await parser.dispose();

        console.log(this._program);
    }
}