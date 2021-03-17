import {orthographicSchema} from "./orthographic-schema.js";
import {perspectiveSchema} from "./perspective-schema.js";
import {GraphicsParser} from "./../../graphics-providers/graphics-parser.js";

export default class GraphicsSchema extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        await this._loadPrograms();
    }

    async disconnectedCallback() {
        this._orthographicProgram = this._orthographicProgram.dispose()
        this._perspectiveProgram = this._perspectiveProgram.dispose()
        await super.disconnectedCallback();
    }

    async _loadPrograms() {
        const orthographicParent = this.element.querySelector("#orthographic");
        const perspectiveParent = this.element.querySelector("#perspective");

        const parser = new GraphicsParser();
        await parser.initialize();
        this._orthographicProgram = await parser.parse(orthographicSchema, orthographicParent);
        this._perspectiveProgram = await parser.parse(perspectiveSchema, perspectiveParent);

        this._orthographicProgram.canvas.render();
    }
}