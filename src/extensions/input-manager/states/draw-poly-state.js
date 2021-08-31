import {BaseState} from "./base-state.js";
import {InputGuideRenderer} from "./draw-poly-state/input-guide-renderer.js";
import {setMouse} from "../helpers/pointer-functions.js";


export class DrawPolyState extends BaseState {
    get guide() {
        return this._context.program.drawing.guide;
    }

    get points() {
        return this.guide._input.points;
    }

    constructor(context) {
        super(context, "draw_polygon");
    }

    dispose() {
        super.dispose();
    }

    async enter() {
        await super.enter();
        this._context.program.drawing.guide = await InputGuideRenderer.new(this._context.program);

        this.element.addEventListener("pointerdown", this._pointerDownHandler);
        document.addEventListener("keyup", this._keyUpHandler);
        document.addEventListener("keydown", this._keyDownHandler);
    }

    async exit() {
        this.element.removeEventListener("pointerdown", this._pointerDownHandler);
        document.removeEventListener("keyup", this._keyUpHandler);
        document.removeEventListener("keydown", this._keyDownHandler);

        this.guide.dispose();
        delete this._context.program.drawing.guide;
        await super.exit();
    }

    async _pointerDown(event) {
        document.addEventListener("pointerup", this._pointerUpHandler);
        document.addEventListener("pointermove", this._pointerMoveHandler);

        await setMouse(this._mouseStart, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouseStart, this.camera);

        this._intersections.length = 0;
        this._raycaster.intersectObjects(this.points, true, this._intersections);

        if (this._intersections.length > 0) {
            return await this._closePath();
        }

        const startPoint = await this.getIntersectionPlanePosition();
        await this.guide.pointerDown(startPoint);

        await this._render();
    }

    async _pointerUp(event) {
        document.removeEventListener("pointerup", this._pointerUpHandler);
        document.removeEventListener("pointermove", this._pointerMoveHandler);

        await setMouse(this._mouse, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouse, this.camera);
        const point = await this.getIntersectionPlanePosition();

        await this.guide.pointerUp(point);

        await this._render();
    }

    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouse, this.camera);
        const point = await this.getIntersectionPlanePosition();
        if (point == null) return;

        await this.guide.pointerMove(point);
        await this._render();
    }

    async _clearMarkers() {

    }

    async closePath() {
        await this.guide.clear();
    }

    async _keyDown(event) {
        if (event.code === "ControlLeft" || event.code === "ControlRight") {
            this._context.program.drawing.segmentType = this._context.program.drawing.segmentTypeOptions.CURVE;
        }
    }

    async _keyUp(event) {
        if (event.code === "Escape" || event.code === "Backspace") {
            await this._clearMarkers();
        }

        if (event.code === "Enter" || event.code === "Space") {
            await this.closePath();
        }

        this._context.program.drawing.segmentType = this._context.program.drawing.segmentTypeOptions.LINE;
        await this._render();
    }

    async drawOperationChanged() {
        this.guide.drawOperation = this._context.program.drawing.pen.drawOperation;
    }
}