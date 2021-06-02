import "./../../src/gfx-components/orthographic-canvas/orthographic-canvas.js";
import {InputManager, InputStates} from "./../../src/extensions/input-manager/input-manager.js";

export default class PenTool extends crsbinding.classes.ViewBase {
    get inputManager() {
        return this.canvas._inputManager;
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");
        this.canvas.addEventListener("ready", async () => {
            this.canvas.zeroBottomLeft();
            this.canvas.camera.position.z = 10;

            //await this.addFullScreenPlane();

            await this.addDebugBox(100, 100, 100, 100, "box-100");
            await this.addDebugBox(300, 100, 50, 50, "box-50");
            await this.addDebugBox(400, 400, 150, 150, "box-150", true);

            this.canvas.render();

            await InputManager.enable(this.canvas);
        })
    }

    async addDebugBox(x, y, width, height, name, isFrozen = false) {
        const box = await crs.createThreeObject("BoxGeometry", 1, 1, 1);
        const material = await crs.createThreeObject("MeshBasicMaterial", { color: 0xff0090 });
        const object = await crs.createThreeObject("Mesh", box, material);
        object.scale.set(width, height, 1);
        object.name = name;
        this.canvas.scene.add(object);
        this.canvas.canvasPlace(object, x, y);
        object.isFrozen = isFrozen;
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

    async render() {
        this.canvas.render();
    }

    async select() {
        this.inputManager.gotoState(InputStates.SELECT);
    }

    async drawRectangle() {
        this.inputManager.gotoState(InputStates.DRAW_RECTANGLE);
    }

    async drawCircle() {
        this.inputManager.gotoState(InputStates.DRAW_CIRCLE);
    }

    async drawPolygon() {
        this.inputManager.gotoState(InputStates.DRAW_POLYGON);
    }

    async drawImage() {
        this.inputManager.gotoState(InputStates.DRAW_IMAGE);
    }
}