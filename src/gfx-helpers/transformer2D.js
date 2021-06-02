/**
 * Transform utilities used on meshes and transform gizmo
 */

import {TransformAxis} from "./transform-axis.js";
import {TransformAnchors} from "./transform-anchors.js";

export class Transformer2D {
    constructor() {
        this.scaleFn = {};
        this.scaleFn[TransformAxis.X] = this.scaleX;
        this.scaleFn[TransformAxis.Y] = this.scaleY;
        this.scaleFn[TransformAxis.XY] = async (mesh, gizmo, x, y) => {
            await this.scaleX.call(this, mesh, gizmo, x, y);
            await this.scaleY.call(this, mesh, gizmo, x, y);
        }
    }

    dispose() {
        this.startPoint = null;
        this.startScale = null;
        this.details = null;
        this.startPosition = null;
        this.scaleFn[TransformAxis.X] = null;
        this.scaleFn[TransformAxis.Y] = null;
        this.scaleFn[TransformAxis.XY] = null;
        return null;
    }

    async translate(mesh, gizmo, x, y, renderCallback) {
        mesh.position.x = x;
        mesh.position.y = y;

        if (gizmo != null) {
            await gizmo.moveTo(mesh.position.x, mesh.position.y);
        }

        await renderCallback();
    }

    async scale(mesh, gizmo, currentPoint) {
        await this.scaleFn[this.details.axis].call(this, mesh, gizmo, currentPoint.x, currentPoint.y);
    }

    async scaleX(mesh, gizmo, x) {
        const anchor = this.details.anchor;

        if (anchor === TransformAnchors.TOP_LEFT || anchor === TransformAnchors.BOTTOM_LEFT) {
            return this._scaleRightSide(mesh, gizmo, x);
        }

        if (anchor === TransformAnchors.TOP_RIGHT || anchor === TransformAnchors.BOTTOM_RIGHT) {
            return this._scaleLeftSide(mesh, gizmo, x);
        }
    }

    async _scaleRightSide(mesh, gizmo, x) {
        const diffX = x - this.startPoint.x;
        const scaleX = this.startScale.x + diffX;
        mesh.scale.x = scaleX;
        return mesh.position.x = this.startPosition.x + (diffX  / 2);
    }

    async _scaleLeftSide(mesh, gizmo, x) {
        const diffX = this.startPoint.x - x;
        const scaleX = this.startScale.x + diffX;
        mesh.scale.x = scaleX;
        return mesh.position.x = this.startPosition.x - (diffX / 2);
    }

    async scaleY(mesh, gizmo, x, y) {
        const anchor = this.details.anchor;

        if (anchor == TransformAnchors.TOP_LEFT || anchor === TransformAnchors.TOP_RIGHT) {
            return this._scaleBottom(mesh, gizmo, y);
        }

        if (anchor == TransformAnchors.BOTTOM_LEFT || anchor === TransformAnchors.BOTTOM_RIGHT) {
            return this._scaleTop(mesh, gizmo, y);
        }
    }

    async _scaleBottom(mesh, gizmo, y) {
        const diffY = y - this.startPoint.y;
        const scaleY = this.startScale.y - diffY;
        mesh.scale.y = scaleY;
        return mesh.position.y = this.startPosition.y + (diffY / 2);
    }

    async _scaleTop(mesh, gizmo, y) {
        const diffY = this.startPoint.y - y;
        const scaleY = this.startScale.y - diffY;
        mesh.scale.y = scaleY;
        return mesh.position.y = this.startPosition.y - (diffY / 2);
    }
}