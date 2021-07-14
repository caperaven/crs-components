/**
 * Draw polygon by clicking on canvas until you click on the first item again to close the loop
 */

import {BaseState} from "./base-state.js";
import {setMouse} from "../helpers/pointer-functions.js";
import {createNormalizedPlane} from "../../../threejs-helpers/shape-factory.js";

const POINT = "point";

export class DrawPolyState extends BaseState {
    constructor(context) {
        super(context,"draw_polygon");
    }

    dispose() {
        super.dispose();
    }

    async enter() {
        await super.enter();
        this._points = [];
    }

    async exit() {
        await super.exit();
        this._points.length = 0;
    }

    async _pointerDown(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
    }

    async _pointerUp(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
    }

    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
    }

    async _createPoint(startPoint) {
        const material = await crs.createThreeObject("MeshBasicMaterial", {color: 0x000000});
        this.shape = await createNormalizedPlane(10, 10, material, "rect");
        this.shape.type = POINT;
        this.shape.position.set(startPoint.x, startPoint.y, 0);
        this._context.canvas.scene.add(this.shape);
    }
}