import {createNormalizedPlane} from "./../../../src/threejs-helpers/shape-factory.js";

const GIZMO_Z = 1.5;
const STROKE_Z = 1.6;
const CORNER_Z = 1.7;

class TransformGizmoWorker {
    constructor(parent) {
        this._parent = parent;
        this.cursors = {
            "top_left"     : "ne-resize",
            "top_right"    : "nw-resize",
            "bottom_left"  : "se-resize",
            "bottom_right" : "sw-resize",
            "top"          : "n-resize",
            "right"        : "e-resize",
            "bottom"       : "s-resize",
            "left"         : "w-resize",
            "center"       : "move"
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
        // 1. Get bounding box of selected object
        const aabb = await this._getAABB(obj.selected);

        // 2. Set the group position to be the same as the selected object
        this._partsGroup.position.set(obj.selected.position.x, obj.selected.position.y, obj.selected.position.z);

        // 3. Set the position and scale of gizmo parts so that it fits the bounding box.
        await this._applyAABB(aabb);

        // 4. Add group to scene
        this._parent.scene.add(this._partsGroup);

        // 5. Refresh the scene
        this._parent.render();
    }

    async _getAABB(obj) {
        const aabb = await crs.createThreeObject("Box3");

        if (obj.geometry.boundingBox == null) {
            obj.geometry.computeBoundingBox();
        }

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
        this._parts.topLeft.position.set(px - aabb.min.x, py - aabb.min.y, CORNER_Z);
        this._parts.topRight.position.set(px - aabb.max.x, py - aabb.min.y, CORNER_Z);
        this._parts.bottomLeft.position.set(px - aabb.min.x, py - aabb.max.y, CORNER_Z);
        this._parts.bottomRight.position.set(px - aabb.max.x, py - aabb.max.y, CORNER_Z);
    }

    async _applyAABBStrokes(aabb, px, py, width, height, cx, cy) {
        this._parts.top.position.set(px - aabb.min.x - cx, py - aabb.min.y, STROKE_Z);
        this._parts.top.scale.set(width, 10, 1);

        this._parts.right.position.set(px - aabb.min.x, py - aabb.min.y - cy, STROKE_Z);
        this._parts.right.scale.set(10, height, 1);

        this._parts.bottom.position.set(px - aabb.min.x - cx, py - aabb.max.y, STROKE_Z);
        this._parts.bottom.scale.set(width, 10, 1);

        this._parts.left.position.set(px - aabb.max.x, py - aabb.min.y - cy, STROKE_Z);
        this._parts.left.scale.set(10, height, 1);
    }

    async _applyAABBCenter(aabb, px, py, width, height, cx, cy) {
        this._parts.center.position.set(px - aabb.min.x - cx, py - aabb.min.y - cy, GIZMO_Z);
        this._parts.center.scale.set(width, height, 1);
    }

    async _buildUI() {
        const cornerMaterial = await crs.createThreeObject("MeshBasicMaterial", {color: 0xff0000});
        const edgeMaterial = await crs.createThreeObject("MeshBasicMaterial", {color: 0x0000ff});
        const centerMaterial = await crs.createThreeObject("MeshBasicMaterial", {color: 0x00ff00});

        this._parts = {
            // corners
            topLeft: await createNormalizedPlane(10, 10, cornerMaterial, "top_left"),
            topRight: await createNormalizedPlane(10, 10, cornerMaterial, "top_right"),
            bottomLeft: await createNormalizedPlane(10, 10, cornerMaterial, "bottom_left"),
            bottomRight: await createNormalizedPlane(10, 10, cornerMaterial, "bottom_right"),

            // edges
            top: await createNormalizedPlane(10, 10, edgeMaterial, "top"),
            right: await createNormalizedPlane(10, 10, edgeMaterial, "right"),
            bottom: await createNormalizedPlane(10, 10, edgeMaterial, "bottom"),
            left: await createNormalizedPlane(10, 10, edgeMaterial, "left"),

            // center
            center: await createNormalizedPlane(10, 10, centerMaterial, "center")
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