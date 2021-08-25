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
import CurveGeometryProvider from "./../../../gfx-providers/providers/geometry/curve-geometry-provider.js";

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

        this._pointerMovePenHandler = this._pointerMovePen.bind(this);
        this._pointerUpPenHandler = this._pointerUpPen.bind(this);

        this._planeMaterial = await this._context.program.materials.get(MaterialType.BASIC, 0xff0000);
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

        this._pointerMovePenHandler = null;
        this._pointerUpPenHandler = null;

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

        this._startPoint = await this.getIntersectionPlanePosition();
        this._endPoint = this._startPoint;

        await this._createPoint(this._startPoint);

        if (this._context.program.drawing.pen.drawOperation == this._context.program.drawing.drawOperationOptions.CONTINUES) {
            this.element.addEventListener("pointerup", this._pointerUpHandler);
            this.element.addEventListener("pointermove", this._pointerMoveHandler);
        }
        else {
            this.element.addEventListener("pointerup", this._pointerUpPenHandler);
            this.element.addEventListener("pointermove", this._pointerMovePenHandler);
            await this._createPoint(this._endPoint);
        }

        await this._render();
    }

    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this._raycaster.setFromCamera(this._mouse, this.camera);
        this._endPoint = await this.getIntersectionPlanePosition();
        this.shape.position.set(this._endPoint.x, this._endPoint.y, 0);
        await this._render();
    }

    async _pointerUp(event) {
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);

        await setMouse(this._mouse, event, this._context.canvasRect);
        await this._setCurvePath();
        delete this.shape;

        await this._render();
    }

    async _pointerMovePen(event) {
        await this._pointerMove(event);
        await this._updatePenCurvePath();
    };

    async _pointerUpPen(event) {
        this.element.removeEventListener("pointerup", this._pointerUpPenHandler);
        this.element.removeEventListener("pointermove", this._pointerMovePenHandler);

        await this._pointerUp(event);
        await this._closePath()
    }


    async _keyUp(event) {
        if (event.code === "Escape" || event.code === "Backspace") {
            await this._clearMarkers();
        }

        if (event.code === "Enter" || event.code === "Space") {
            await this._closePath();
        }

        await this._render();
    }

    async _createPoint(startPoint) {
        this._pointMaterial = this._pointMaterial || await this._context.program.materials.get(MaterialType.BASIC, 0x000000);
        this.shape = await createNormalizedPlane(10, 10, this._pointMaterial, "rect");
        this.shape.name = "path-point";
        this.shape.type = POINT;
        this.shape.position.set(startPoint.x, startPoint.y, 1);
        this._context.canvas.scene.add(this.shape);
        this._points.push(this.shape);
    }

    async _updatePenCurvePath() {
        if (this._curve.curvePath.curves.length == 0) {
            if (this._startPoint.x === this._endPoint.x) return;

            await this._curve.addLine({x: this._startPoint.x, y: this._startPoint.y}, {x: this._endPoint.x, y: this._endPoint.y});
            await this._curve.drawDashes();
            return;
        }

        const curve = this._curve.curvePath.curves[0];
        curve.v2.x = this._endPoint.x;
        curve.v2.y = this._endPoint.y;
        curve.updateArcLengths();
        await this._curve.update();
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

        const drawingSettings = this._context.program.drawing;
        const group = await crs.createThreeObject("Group");
        const isPolygon = drawingSettings.pen.type == drawingSettings.penTypeOptions.POLYGON;

        const points = ["m", parseInt(this._points[0].position.x), parseInt(this._points[0].position.y), 0];
        for (let i = 1; i < this._points.length; i++) {
            points.push("l", parseInt(this._points[i].position.x), parseInt(this._points[i].position.y), 0);
        }

        if (isPolygon === true) {
            points.push("z");
        }

        const pstr = points.join(",");

        if (isPolygon && drawingSettings.fill.enabled == true) {
            const fill_data = fill(pstr);
            await this._createFill(fill_data, group);
        }

        if (isPolygon == false || drawingSettings.stroke.enabled == true) {
            if (drawingSettings.stroke.type == drawingSettings.strokeTypeOptions.SOLID) {
                const options = drawingSettings.stroke.toSoldString();
                const stroke_data = stroke(pstr, drawingSettings.stroke.lineWidth, options);
                await this._createStroke(stroke_data, group, isPolygon);
            }
            else {
                const color = this._context.program.drawing.stroke.color;
                await this._context.program.materials.get(MaterialType.BASIC, color);
                const dotted = drawingSettings.stroke.dotted;
                const provider = new CurveGeometryProvider();
                const mesh = await provider.processItem({
                    material: color,
                    args: {
                        data: pstr,
                        icon: dotted.icon,
                        transform: `s,${dotted.xScale},${dotted.yScale},1`,
                        gap: dotted.gap,
                    }
                }, this._context.program);
                mesh.position.z = 1;
                group.add(mesh);
                provider.dispose();
            }
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
        const material = await this._context.program.materials.get(MaterialType.BASIC, color);
        material.side = await crs.getThreeConstant("DoubleSide");

        const polygon = await rawToGeometry(fill, material);
        polygon.name = "fill-polygon";
        group.add(polygon);
    }

    async _createStroke(stroke, group) {
        const color = this._context.program.drawing.stroke.color;
        const material = await this._context.program.materials.get(MaterialType.BASIC, color);
        material.side = await crs.getThreeConstant("DoubleSide");

        const polygon = await rawToGeometry(stroke, material);
        polygon.name = "stroke-polygon";
        polygon.position.z = 1;

        group.add(polygon);
    }
}