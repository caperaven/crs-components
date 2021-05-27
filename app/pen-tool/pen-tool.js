import "./../../src/gfx-components/orthographic-canvas/orthographic-canvas.js";
import {InputManager} from "./../../src/extensions/input-manager/input-manager.js";
import {OrbitControls} from "../../third-party/three/external/controls/OrbitControls.js";

export default class PenTool extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");
        this.canvas.addEventListener("ready", async () => {
            this.canvas.zeroBottomLeft();
            this.canvas.camera.position.z = 10;

            //await this.addFullScreenPlane();

            const box = await crs.createThreeObject("BoxGeometry", 1, 1, 1);
            const material = await crs.createThreeObject("MeshBasicMaterial", { color: 0xff0090 });
            const object = await crs.createThreeObject("Mesh", box, material);
            object.scale.set(100, 100, 1);
            this.canvas.scene.add(object);
            this.canvas.canvasPlace(object, 100, 100);
            this.canvas.render();

            await InputManager.enable(this.canvas, {allow_drag: true});
        })
    }

    async disconnectedCallback() {
        await InputManager.disable(this.canvas);
        delete this.canvas;
        await super.disconnectedCallback();
    }

    async addFullScreenPlane() {
        const plane = await crs.createThreeObject("PlaneGeometry", 1000, 1000, 1);
        const material = await crs.createThreeObject("MeshBasicMaterial", {color: 0x0000ff, transparent: true, opacity: 0});
        const obj = await crs.createThreeObject("Mesh", plane, material);
        obj.scale.set(30, 30, 1);
        this.canvas.scene.add(obj);
    }
}