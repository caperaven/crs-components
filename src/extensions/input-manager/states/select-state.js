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
        this._mouseStart = new Vector2();
        this._selected = null;
        this._intersections = [];

        this.currentState = SelectStates.SELECT;
        this.element.addEventListener("pointerdown", this._pointerDownHandler);
    }

    async exit() {
        this.element.removeEventListener("pointerdown", this._pointerDownHandler);
        this._raycaster = null;
        this._mouse = null;
        this._mouseStart = null;
        this._selected = null;
        this._intersections = null;
    }

    /**
     * Handle pointer down event based on current state.
     * Select : check selection
     * Hover  : check for drag or resize based on hit target
     * @returns {Promise<void>}
     * @private
     */
    async _pointerDown(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this._downActions[this.currentState].call(this, event);
    }

    /**
     * We are in hover mode, check if we are requesting selection or resize operations.
     * If the hit target is not the gizmo but a valid selection object, make that object the selected object and update the gizmo
     * @param event
     * @returns {Promise<void>}
     * @private
     */
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

    /**
     * Pointer is down, handle selection checks
     * @returns {Promise<void>}
     * @private
     */
    async _pointerDownSelect() {
        await this._setSelected();

        const isFrozen = this._selected?.object.isFrozen == true;
        const mesh = isFrozen === true ? null : this._selected?.object;

        await this.gizmo.performAction({
            selected: mesh
        })

        await this._enableCursorEvents(mesh != null);
    }

    /**
     * Update the mouse data and handle the pointer up event based on the current state
     * @param event
     * @returns {Promise<void>}
     * @private
     */
    async _pointerUp(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        this.currentState = this._selected == null ? SelectStates.SELECT : SelectStates.GIZMO_HOVER;
    }

    /**
     * Update the mouse data and handle the move event based on the current state
     * Hover  : update hover data
     * Resize : perform resize operations
     * Drag   : move the selected object accordingly
     * @param event
     * @returns {Promise<void>}
     * @private
     */
    async _pointerMove(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);

        this._intersections.length = 0;
        await setMouse(this._mouse, event, this._context.canvasRect);
        await this._moveActions[this.currentState].call(this, event);
    }

    /**
     * Query the canvas and check for any hit detection.
     * If an valid object is found, set the _selected field to that object
     * @returns {Promise<boolean>}
     * @private
     */
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

    /**
     * A valid selection has been made, enable the other events to check for further activities.
     * @param isGizmoVisible
     * @returns {Promise<void>}
     * @private
     */
    async _enableCursorEvents(isGizmoVisible) {
        if (isGizmoVisible === false) {
            return this._disableCursorEvents();
        }

        this.currentState = SelectStates.GIZMO_HOVER;
        this.element.addEventListener("pointerup", this._pointerUpHandler);
        this.element.addEventListener("pointermove", this._pointerMoveHandler);
    }

    /**
     * Disable the pointer up and move events and set the state back to selection mode
     * @returns {Promise<void>}
     * @private
     */
    async _disableCursorEvents() {
        this.currentState = SelectStates.SELECT;
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);
    }

    /**
     * The gizmo is active so check for hover effects on the gizmo.
     * Update the cursor based on the gizmo modifier you are hovering over
     * @returns {Promise<void>}
     * @private
     */
    async _gizmoHover() {
        this._raycaster.setFromCamera(this._mouse, this.camera);
        this._raycaster.intersectObjects(this.transFormGizmo._partsGroup.children, false, this._intersections);

        let cursor = "default";

        if (this._intersections.length > 0) {
            cursor = this.transFormGizmo.cursors[this._intersections[0].object.name];
        }

        this.element.style.cursor = cursor;
    }

    /**
     * You are dragging the gizmo around and as a result the selected object.
     * Update both the gizmo and the selected object accordingly.
     * @param event
     * @returns {Promise<void>}
     * @private
     */
    async _gizmoDrag(event) {

    }

    /**
     * You are resizing the gizmo.
     * Request and update on the gizmo according to the resize operation
     * @param event
     * @returns {Promise<void>}
     * @private
     */
    async _gizmoResize(event) {
    }
}