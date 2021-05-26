import "./../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {InputManager} from "./../../src/extensions/input-manager/input-manager.js";

export default class PenTool extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this._renderCallback = this.render.bind(this);
        this.canvas = document.querySelector("perspective-canvas");
        this.canvas.addEventListener("ready", async () => {
            this.canvas.camera.position.set(0, 0, 5);
            const box = await crs.createThreeObject("BoxGeometry", 1, 1, 1);
            const material = await crs.createThreeObject("MeshBasicMaterial", { color: 0xff0090 });
            const object = await crs.createThreeObject("Mesh", box, material);
            this.canvas.scene.add(object);
            this.canvas.render();

            await InputManager.enable(this.canvas, {allow_drag: true});
        })
    }

    async disconnectedCallback() {
        await InputManager.disable(this.canvas);
        this.controls = this.controls.dispose();
        delete this.canvas;
        await super.disconnectedCallback();
    }

    async render() {
        this.canvas.render();
    }
}