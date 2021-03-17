import "../../src/components/orthographic-canvas/orthographic-canvas.js";
import {MsdfFont} from "../../src/threejs-helpers/msdf/msdf-font.js";
import {createNormalizedPlane} from "../../src/threejs-helpers/shape-factory.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";

export default class MsdfView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");

        this.font = new MsdfFont("/fonts/opensans/OpenSans-SemiBold.json");
    }

    async preLoad() {
        this.setProperty("text", "Hello World");
    }

    async showTextureChanged(newValue) {
        if (this.fontPlane == null) {
            await this.showFontTexture();
        }

        this.fontPlane.visible = newValue;
        this.canvas.render();
    }

    async showFontTexture() {
        this.fontPlane = createNormalizedPlane(500, 500, new MeshBasicMaterial({map: this.font.texture}));
        this.canvas.scene.add(this.fontPlane);
    }

    async debug() {
        const plane = await this.font.fromText(this.getProperty("text"));
        this.canvas.scene.add(plane);
        this.canvas.render();
    }

    async update() {
        this.canvas.render();
    }
}