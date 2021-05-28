import {setMouse} from "./../helpers/pointer-functions.js";

const SelectStates = Object.freeze({
    SELECT       : 0x1,
    GIZMO_HOVER  : 0x2,
    GIZMO_DRAG   : 0x3,
    GIZMO_RESIZE : 0x4
});

/**
 * Select a mesh and show the transform gizmo.
 * Select white space to remove gizmo.
 * Use event aggregation to communicate intent.
 */
export class SelectState extends crs.state.StateBase {
    get camera() {
        return this._context.canvas.camera;
    }

    get element() {
        return this._context.canvas.renderer.domElement;
    }

    get sceneItems() {
        return this._context.canvas.scene.children;
    }

    get gizmo() {
        return this._context.canvas._transformGizmo;
    }

    get transFormGizmo() {
        return this._context.canvas._transformGizmo;
    }

    constructor(context) {
        super("select");
        this._context = context;
        this._pointerDownHandler = this._pointerDown.bind(this);
        this._pointerUpHandler = this._pointerUp.bind(this);
        this._pointerMoveHandler = this._pointerMove.bind(this);

        this._moveActions = {};
        this._moveActions[SelectStates.GIZMO_HOVER] = this._gizmoHover;
        this._moveActions[SelectStates.GIZMO_DRAG] = this._gizmoDrag;
        this._moveActions[SelectStates.GIZMO_RESIZE] = this._gizmoResize;

        this._downActions = {};
        this._downActions[SelectStates.SELECT] = this._pointerDownSelect;
        this._downActions[SelectStates.GIZMO_HOVER] = this._pointerDownHover;
    }

    dispose() {
        this._context = null;

        this._moveActions[SelectStates.GIZMO_HOVER] = null;
        this._moveActions[SelectStates.GIZMO_DRAG] = null;
        this._moveActions[SelectStates.GIZMO_RESIZE] = null;

        this._downActions[SelectStates.SELECT] = null;
        this._downActions[SelectStates.GIZMO_HOVER] = null;

        this._pointerDownHandler = null;
        this._pointerUpHandler = null;
        this._pointerMoveHandler = null;
    }

    async enter() {
        const Raycaster = await crs.getThreePrototype("Raycaster");
        const Vector2 = await crs.getThreePrototype("Vector2");

        this._raycaster = new Raycaster();
        this._mouse = new Vector2();
        this._selected = null;
        this._intersections = [];

        this.currentState = SelectStates.SELECT;
        this.element.addEventListener("pointerdown", this._pointerDownHandler);
    }

    async exit() {
        this.element.removeEventListener("pointerdown", this._pointerDownHandler);
        this._raycaster = null;
        this._mouse = null;
        this._selected = null;
        this._intersections = null;
    }

    async _pointerDown(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this._downActions[this.currentState].call(this, event);
    }

    async _pointerDownHover(event) {
        await this._setSelected();

        if (this._selected == null) {
            await this.gizmo.performAction({ selected: null });
            return await this._enableCursorEvents(false);
        }

        // 1. Though you are hovering, you did not click on a gizmo item
        //    Go into selection state and check for selections being made
        if (this._selected.object.parent.name !== "transform-gizmo") {
            return this._pointerDownSelect();
        }

        this.currentState = this._selected.object === this.gizmo._parts.center ? SelectStates.GIZMO_DRAG : SelectStates.GIZMO_RESIZE;
    }

    async _pointerDownSelect() {
        await this._setSelected();

        const isFrozen = this._selected?.object.isFrozen == true;
        const mesh = isFrozen === true ? null : this._selected?.object;

        await this.gizmo.performAction({
            selected: mesh
        })

        await this._enableCursorEvents(mesh != null);
    }

    async _pointerUp(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);

        this.currentState = this._selected == null ? SelectStates.SELECT : SelectStates.GIZMO_HOVER;
    }

    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);

        this._intersections.length = 0;
        await setMouse(this._mouse, event, this._context.canvasRect);
        await this._moveActions[this.currentState].call(this, event);
    }

    async _setSelected() {
        this._intersections.length = 0;
        this._selected = null;

        this._raycaster.setFromCamera(this._mouse, this.camera);
        this._raycaster.intersectObjects(this.sceneItems, true, this._intersections);

        if (this._intersections.length > 0) {
            this._selected = this._intersections[0];

            if (this._selected.parent?.constructor?.name == "Group") {
                this._selected = this._selected.parent;
            }
        }

        return this._selected != true;
    }

    async _enableCursorEvents(isGizmoVisible) {
        if (isGizmoVisible === false) {
            return this._disableCursorEvents();
        }

        this.currentState = SelectStates.GIZMO_HOVER;
        this.element.addEventListener("pointerup", this._pointerUpHandler);
        this.element.addEventListener("pointermove", this._pointerMoveHandler);
    }

    async _disableCursorEvents() {
        this.currentState = SelectStates.SELECT;
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);
    }

    async _gizmoHover() {
        this._raycaster.setFromCamera(this._mouse, this.camera);
        this._raycaster.intersectObjects(this.transFormGizmo._partsGroup.children, false, this._intersections);

        let cursor = "default";

        if (this._intersections.length > 0) {
            cursor = this.transFormGizmo.cursors[this._intersections[0].object.name];
        }

        this.element.style.cursor = cursor;
    }

    async _gizmoDrag(event) {
    }

    async _gizmoResize(event) {
    }
}