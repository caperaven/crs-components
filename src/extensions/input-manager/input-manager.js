import {SelectState} from "./states/select-state.js";
import {NavigateState} from "./states/navigate-state.js";
import {DrawRectangleState} from "./states/draw-rectangle-state.js";
import {DrawCircleState} from "./states/draw-circle-state.js";
import {DrawPolyState} from "./states/draw-poly-state.js";
import {DrawImageState} from "./states/draw-image-state.js";
import {TransformGizmo} from "./../transform-gizmo/transform-gizmo.js";

export const InputStates = Object.freeze({
    SELECT: "select",
    NAVIGATE: "navigate",
    DRAW_RECTANGLE: "draw_rectangle",
    DRAW_CIRCLE: "draw_circle",
    DRAW_POLYGON: "draw_polygon",
    DRAW_IMAGE: "draw_image"
});

class InputManagerWorker {
    constructor(canvas) {
        this.canvas = canvas;
        this._states = new crs.state.SimpleStateMachine();
    }

    async initialize() {
        return new Promise(async resolve => {
            await this._states.addState(new SelectState(this));
            await this._states.addState(new NavigateState(this));
            await this._states.addState(new DrawRectangleState(this));
            await this._states.addState(new DrawCircleState(this));
            await this._states.addState(new DrawPolyState(this));
            await this._states.addState(new DrawImageState(this));

            requestAnimationFrame(async () => {
                this.canvasRect = this.canvas.renderer.domElement.getBoundingClientRect();
                await this._addIntersectPlane();
                await this._states.gotoState("select");
                resolve();
            })
        })
    }

    async dispose() {
        await this._removeIntersectPlane();

        this.canvas = null;
        this.canvasRect = null;
        this._states.dispose();
        return null;
    }

    gotoState(state) {
        this._states.gotoState(state);
    }

    async _addIntersectPlane() {
        const geom = await crs.createThreeObject("PlaneGeometry");
        const material = await crs.createThreeObject("MeshBasicMaterial", {color: 0xffffff});
        const mesh = await crs.createThreeObject("Mesh", geom, material);
        this.canvas.scene.add(mesh);

        mesh.name = "intersect_plane";
        mesh.position.set(this.canvas.camera.position.x, this.canvas.camera.position.y, -1);
        mesh.scale.set(this.canvas.width, this.canvas.height, 1);

        this._intersectPlane = mesh;
        this.canvas.render();
    }

    async _removeIntersectPlane() {
        this.canvas.scene.remove(this._intersectPlane);
        this._intersectPlane = null;
    }
}

export class InputManager {
    static async enable(parent) {
        await TransformGizmo.enable(parent);
        parent._inputManager = new InputManagerWorker(parent);
        await parent._inputManager.initialize();
    }

    static async disable(parent) {
        await TransformGizmo.disable(parent);
        parent._inputManager = parent._inputManager.dispose();
    }
}