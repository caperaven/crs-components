import "../../src/components/orthographic-canvas/orthographic-canvas.js";
import {rawShaderSchema} from "./raw-shader-schema.js";
import {GraphicsParser} from "../../src/graphics-providers/graphics-parser.js";
import GridHelperProvider from "../../src/graphics-providers/providers/helpers/grid-helper-provider.js";
//import {MsdfFont} from "../../src/msdf/msdf-font.js";

export default class Msdf extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        // const msdf = new MsdfFont();
        // await msdf.initialize("/fonts/opensans/OpenSans-Regular.json", 42);

        const shaderParent = document.querySelector(".canvas-parent");
        const parser = new GraphicsParser();
        await parser.initialize();
        this._shaderProgram = await parser.parse(rawShaderSchema, shaderParent);

        await this.animate();
    }

    async animate() {
        requestAnimationFrame(this.animate.bind(this));
        this._shaderProgram.render();
    }
}