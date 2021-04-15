import {rawShaderSchema} from "./raw-shader-schema.js";

import "../../../src/gfx-components/orthographic-canvas/orthographic-canvas.js";
import {GraphicsParser} from "../../../src/gfx-providers/graphics-parser.js";

export default class Msdf extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        const shaderParent = document.querySelector(".canvas-parent");
        const parser = new GraphicsParser();
        await parser.initialize();
        this._shaderProgram = await parser.parse(rawShaderSchema, shaderParent);
    }
}