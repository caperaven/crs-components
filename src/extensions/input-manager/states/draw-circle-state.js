/**
 * Draw a circle mesh at the given location and size.
 * Size widget is locked to equal width and height
 */

import {BaseState} from "./base-state.js";
import {setMouse} from "./../helpers/pointer-functions.js";
import {createRegularMesh} from "../../../threejs-helpers/shape-factory.js";

export class DrawCircleState extends BaseState {
    constructor(context) {
        super(context,"draw_circle");
    }

    dispose() {
        super.dispose();
    }

    async enter() {
        await super.enter();
        this.element.addEventListener("pointerdown", this._pointerDownHandler);
    }

    async exit() {
        this.element.removeEventListener("pointerdown", this._pointerDownHandler);
        await super.exit();
    }

    async _pointerDown(event) {
        await setMouse(this._mouseStart, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouseStart, this.camera);

        this.element.addEventListener("pointerup", this._pointerUpHandler);
        this.element.addEventListener("pointermove", this._pointerMoveHandler);
        this._startPoint = await this.getIntersectionPlanePosition();
        await this._createCircle(this._startPoint);
        await this._render();

    }

    async _pointerUp(event) {
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);
        const scale = this.shape.scale.clone();
        this.shape.scale.set(Math.abs(scale.x), Math.abs(scale.y), 1);
        this.shape = null;
    }

    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouse, this.camera);

        const point = await this.getIntersectionPlanePosition();
        const x = point.x - this._startPoint.x;
        const y = point.y - this._startPoint.y;
        const scale = x > y ? x : y;
        const c = scale / 2;

        this.shape.scale.set(scale, scale, 1);
        this.shape.position.set(this._startPoint.x + c, this._startPoint.y - c, 0);

        return this._render();
    }

    async _createCircle(startPoint) {
        const material = await crs.createThreeObject("MeshBasicMaterial", {color: 0x000000});
        this.shape = await createRegularMesh(1, 10, material, "rect");
        this.shape.position.set(startPoint.x, startPoint.y, 0);
        this._context.canvas.scene.add(this.shape);
    }
}