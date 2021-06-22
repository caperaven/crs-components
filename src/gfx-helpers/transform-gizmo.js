import {createNormalizedPlane} from "../threejs-helpers/shape-factory.js";
import {TransformAnchors} from "./transform-anchors.js";
import {TransformAxis} from "./transform-axis.js";

const GIZMO_Z = 1.5;
const STROKE_Z = 1.6;
const CORNER_Z = 1.7;

class TransformGizmoWorker {
    constructor(parent) {
        this._parent = parent;

        this.transformDetails = {
            "top_left"      : {cursor: "nw-resize", anchor : TransformAnchors.BOTTOM_RIGHT, axis: TransformAxis.XY},
            "top_right"     : {cursor: "ne-resize", anchor : TransformAnchors.BOTTOM_LEFT,  axis: TransformAxis.XY},
            "bottom_left"   : {cursor: "se-resize", anchor : TransformAnchors.TOP_LEFT,     axis: TransformAxis.XY},
            "bottom_right"  : {cursor: "sw-resize", anchor : TransformAnchors.TOP_RIGHT,    axis: TransformAxis.XY},
            "top"           : {cursor: "n-resize",  anchor : TransformAnchors.BOTTOM_LEFT,  axis: TransformAxis.Y},
            "right"         : {cursor: "e-resize",  anchor : TransformAnchors.TOP_LEFT,     axis: TransformAxis.X},
            "bottom"        : {cursor: "s-resize",  anchor : TransformAnchors.TOP_LEFT,     axis: TransformAxis.Y},
            "left"          : {cursor: "w-resize",  anchor : TransformAnchors.TOP_RIGHT,    axis: TransformAxis.X},
            "center"        : {cursor: "move",      anchor : null,                          axis: null}
        }
    }

    async initialize() {
        await this._buildUI();
    }

    dispose() {
        this._partsGroup = null;
        this._parts = null;
        this._parent = null;
    }

    async performAction(args) {
        const action = args.action || args.selected == null ? this._hide : this._show;
        await action.call(this, args);
    }

    async _hide() {
        this._parent.scene.remove(this._partsGroup);
        this._parent.render();
    }

    async _show(obj) {
        await this.refresh(obj.selected, () => {
            this._parent.scene.add(this._partsGroup);
        })
    }

    async refresh(obj, preRenderCallback) {
        // 1. Get bounding box of selected object
        const aabb = await this._getAABB(obj);

        // 2. Set the group position to be the same as the selected object
        this._partsGroup.position.set(obj.position.x, obj.position.y, obj.position.z);

        // 3. Set the position and scale of gizmo parts so that it fits the bounding box.
        await this._applyAABB(aabb);

        // 4. Pre render callback
        preRenderCallback && preRenderCallback();

        // 5. Refresh the scene
        this._parent.render();
    }

    async _getAABB(obj) {
        const aabb = await crs.createThreeObject("Box3");
        obj.geometry.computeBoundingBox();
        aabb.copy(obj.geometry.boundingBox).applyMatrix4(obj.matrixWorld);
        return aabb;
    }

    async _applyAABB(aabb) {
        const px = this._partsGroup.position.x;
        const py = this._partsGroup.position.y;
        const width = aabb.max.x - aabb.min.x;
        const height = aabb.max.y - aabb.min.y;
        const cx = width / 2;
        const cy = height / 2;

        await this._applyAABBCorners(aabb, px, py);
        await this._applyAABBStrokes(aabb, px, py, width, height, cx, cy);
        await this._applyAABBCenter(aabb, px, py, width, height, cx, cy);
    }

    async _applyAABBCorners(aabb, px, py) {
        this._parts.topLeft.position.set(px - aabb.max.x, py - aabb.min.y, CORNER_Z);
        this._parts.topRight.position.set(px - aabb.min.x, py - aabb.min.y, CORNER_Z);
        this._parts.bottomLeft.position.set(px - aabb.min.x, py - aabb.max.y, CORNER_Z);
        this._parts.bottomRight.position.set(px - aabb.max.x, py - aabb.max.y, CORNER_Z);
    }

    async _applyAABBStrokes(aabb, px, py, width, height, cx, cy) {
        const size = 3;
        this._parts.top.position.set(px - aabb.min.x - cx, py - aabb.min.y, STROKE_Z);
        this._parts.top.scale.set(width, size, 1);

        this._parts.right.position.set(px - aabb.min.x, py - aabb.min.y - cy, STROKE_Z);
        this._parts.right.scale.set(size, height, 1);

        this._parts.bottom.position.set(px - aabb.min.x - cx, py - aabb.max.y, STROKE_Z);
        this._parts.bottom.scale.set(width, size, 1);

        this._parts.left.position.set(px - aabb.max.x, py - aabb.min.y - cy, STROKE_Z);
        this._parts.left.scale.set(size, height, 1);
    }

    async _applyAABBCenter(aabb, px, py, width, height, cx, cy) {
        this._parts.center.position.set(px - aabb.min.x - cx, py - aabb.min.y - cy, GIZMO_Z);
        this._parts.center.scale.set(width, height, 1);
    }

    async _buildUI() {
        const cornerMaterial = await crs.createThreeObject("MeshBasicMaterial", {color: 0xababab});
        const clearMaterial = await crs.createThreeObject("MeshBasicMaterial", {color: 0x00ff00, transparent: true, opacity: 0});

        this._parts = {
            // corners
            topLeft: await createNormalizedPlane(10, 10, cornerMaterial, "top_left"),
            topRight: await createNormalizedPlane(10, 10, cornerMaterial, "top_right"),
            bottomLeft: await createNormalizedPlane(10, 10, cornerMaterial, "bottom_left"),
            bottomRight: await createNormalizedPlane(10, 10, cornerMaterial, "bottom_right"),


            // edges
            top: await createNormalizedPlane(10, 10, clearMaterial, "top"),
            right: await createNormalizedPlane(10, 10, clearMaterial, "right"),
            bottom: await createNormalizedPlane(5, 10, clearMaterial, "bottom"),
            left: await createNormalizedPlane(10, 10, clearMaterial, "left"),
            center: await createNormalizedPlane(5, 5, clearMaterial, "center")
        }

        // create a group and add the parts to the group
        const group = await crs.createThreeObject("Group");
        group.name = "transform-gizmo";
        group.add(this._parts.topLeft);
        group.add(this._parts.topRight);
        group.add(this._parts.bottomLeft);
        group.add(this._parts.bottomRight);
        group.add(this._parts.top);
        group.add(this._parts.right);
        group.add(this._parts.bottom);
        group.add(this._parts.left);
        group.add(this._parts.center);
        this._partsGroup = group;

        this._parent.scene.add(group);
    }

    async moveTo(x, y) {
        this._partsGroup.position.x = x;
        this._partsGroup.position.y = y;
    }
}

export class TransformGizmo {
    static async enable(parent) {
        parent._transformGizmo = new TransformGizmoWorker(parent);
        await parent._transformGizmo.initialize();
    }

    static async disable(parent) {
        parent._transformGizmo.dispose();
        delete parent._transformGizmo;
    }
}