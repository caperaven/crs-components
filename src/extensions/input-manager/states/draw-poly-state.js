/**
 * Draw polygon by clicking on canvas until you click on the first item again to close the loop
 */

import {BaseState} from "./base-state.js";
import {setMouse} from "../helpers/pointer-functions.js";
import {createNormalizedPlane} from "../../../threejs-helpers/shape-factory.js";
import {MaterialType} from "../../../gfx-helpers/materials.js";
import {LineCurveHelper} from "../../../gfx-helpers/line-curve-helper.js";
import init, {fill, stroke} from "./../../../../wasm/geometry/bin/geometry.js";
import {rawToGeometry} from "./../../../gfx-helpers/raw-to-geometry.js";

const POINT = "point";
init();

export class DrawPolyState extends BaseState {
    constructor(context) {
        super(context, "draw_polygon");
    }

    dispose() {
        super.dispose();
    }

    async enter() {
        await super.enter();
        this._points = [];

        this._planeMaterial = await this._context.canvas.materials.get(MaterialType.BASIC, 0xff0000);
        this._curve = await LineCurveHelper.new(2, 5, 2, this._planeMaterial, this._context.canvas.scene, "path-outline");
        this.element.addEventListener("pointerdown", this._pointerDownHandler);
        document.addEventListener("keyup", this._keyUpHandler);
        await this._render();
    }

    async exit() {
        this.element.removeEventListener("pointerdown", this._pointerDownHandler);
        document.removeEventListener("keyup", this._keyUpHandler);

        this._pointMaterial.dispose();
        this._planeMaterial.dispose();

        this._points.length = 0;
        this._curve = this._curve.dispose();

        delete this._points;
        delete this._curve;
        delete this._planeMaterial;
        delete this._pointMaterial;

        await super.exit();
    }

    async _pointerDown(event) {
        await setMouse(this._mouseStart, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouseStart, this.camera);

        this._intersections.length = 0;
        this._raycaster.intersectObjects(this._points, true, this._intersections);

        if (this._intersections.length > 0) {
            return await this._closePath();
        }

        this.element.addEventListener("pointerup", this._pointerUpHandler);
        this.element.addEventListener("pointermove", this._pointerMoveHandler);
        this._startPoint = await this.getIntersectionPlanePosition();

        await this._createPoint(this._startPoint);
        await this._render();
    }

    async _pointerUp(event) {
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);

        await setMouse(this._mouse, event, this._context.canvasRect);
        this._points.push(this.shape);
        await this._setCurvePath();
        delete this.shape;

        await this._render();
    }

    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouse, this.camera);
        const pos = await this.getIntersectionPlanePosition();
        this.shape.position.set(pos.x, pos.y, 0);
        await this._render();
    }

    async _keyUp(event) {
        if (event.code === "Escape") {
            await this._clearMarkers();
        }

        if (event.code === "Enter" || event.code === "Space") {
            await this._closePath();
        }

        await this._render();
    }

    async _createPoint(startPoint) {
        this._pointMaterial = this._pointMaterial || await this._context.canvas.materials.get(MaterialType.BASIC, 0x000000);
        this.shape = await createNormalizedPlane(10, 10, this._pointMaterial, "rect");
        this.shape.name = "path-point";
        this.shape.type = POINT;
        this.shape.position.set(startPoint.x, startPoint.y, 1);
        this._context.canvas.scene.add(this.shape);
    }

    async _setCurvePath() {
        if (this._points.length == 1) return;
        const point = this._points[this._points.length - 2].position;
        const lastPoint = this._points[this._points.length - 1].position;

        await this._curve.addLine({x: point.x, y: point.y}, {x: lastPoint.x, y: lastPoint.y});

        if (this._curve.mesh == null) {
            await this._curve.drawDashes();
        } else {
            await this._curve.update();
        }
    }

    async _closePath() {
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);

        const points = ["m", parseInt(this._points[0].position.x), parseInt(this._points[0].position.y)];
        for (let i = 1; i < this._points.length; i++) {
            points.push("l", parseInt(this._points[i].position.x), parseInt(this._points[i].position.y));
        }
        points.push("z");
        const pstr = points.join(",");

        const drawingSettings = this._context.program.drawing;

        const group = await crs.createThreeObject("Group");

        if (drawingSettings.fill.enabled == true) {
            const fill_data = fill(pstr);
            await this._createFill(fill_data, group);
        }

        if (drawingSettings.stroke.enabled == true) {
            const options = drawingSettings.stroke.toSoldString();
            const stroke_data = stroke(pstr, drawingSettings.stroke.lineWidth, options);
            await this._createStroke(stroke_data, group);
        }

        this._context.canvas.scene.add(group);

        await this._clearMarkers();

        await this._render();
    }

    async _clearMarkers() {
        this._points.forEach(point => this._context.canvas.scene.remove(point));

        this._points.length = 0;
        await this._curve.dispose();
        this._curve = await LineCurveHelper.new(2, 5, 2, this._planeMaterial, this._context.canvas.scene, "path-outline");
    }

    async _createFill(fill, group) {
        const color = this._context.program.drawing.fill.color;
        const material = await this._context.canvas.materials.get(MaterialType.BASIC, color);
        material.side = await crs.getThreeConstant("DoubleSide");

        const polygon = await rawToGeometry(fill, material);
        polygon.name = "fill-polygon";
        group.add(polygon);
    }

    async _createStroke(stroke, group) {
        const color = this._context.program.drawing.stroke.color;
        const material = await this._context.canvas.materials.get(MaterialType.BASIC, color);
        material.side = await crs.getThreeConstant("DoubleSide");

        const polygon = await rawToGeometry(stroke, material);
        polygon.name = "stroke-polygon";
        polygon.position.z = 1;

        group.add(polygon);
    }
}