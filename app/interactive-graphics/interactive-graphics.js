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
    }

    async disconnectedCallback() {
        this._program = this._program.dispose();
        await super.disconnectedCallback();
    }

    async state_select() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.SELECT);
    }

    async state_rectangle() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.DRAW_RECTANGLE);
    }

    async state_circle() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.DRAW_CIRCLE);
    }

    async state_polygon() {
        this._program.canvas._inputManager.gotoState(this._program.inputStates.DRAW_POLYGON);
    }
}