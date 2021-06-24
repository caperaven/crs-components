import {BaseState} from "./base-state.js";
import {setMouse} from "./../helpers/pointer-functions.js";
import {Transformer2D} from "../../../gfx-helpers/transformer2D.js";

const SelectStates = Object.freeze({
    SELECT       : 0x1,
    GIZMO_HOVER  : 0x2,
    GIZMO_DRAG   : 0x4,
    GIZMO_RESIZE : 0x8
});

/**
 * Select a mesh and show the transform gizmo.
 * Select white space to remove gizmo.
 * Use event aggregation to communicate intent.
 */
export class SelectState extends BaseState {
    get transFormGizmo() {
        return this._context.canvas._transformGizmo;
    }

    get currentShape() {
        return this._currentShape;
    }

    set currentShape(newValue) {
        this._currentShape = newValue;
    }

    constructor(context) {
        super(context, "select");
        this._moveActions = {};
        this._moveActions[SelectStates.GIZMO_HOVER] = this._gizmoHover;
        this._moveActions[SelectStates.GIZMO_DRAG] = this._gizmoDrag;
        this._moveActions[SelectStates.GIZMO_RESIZE] = this._gizmoResize;

        this._downActions = {};
        this._downActions[SelectStates.SELECT] = this._pointerDownSelect;
        this._downActions[SelectStates.GIZMO_HOVER] = this._pointerDownHover;
    }

    dispose() {
        this._moveActions[SelectStates.GIZMO_HOVER] = null;
        this._moveActions[SelectStates.GIZMO_DRAG] = null;
        this._moveActions[SelectStates.GIZMO_RESIZE] = null;

        this._downActions[SelectStates.SELECT] = null;
        this._downActions[SelectStates.GIZMO_HOVER] = null;

        super.dispose();
    }

    async enter() {
        await super.enter();
        this._selected = null;
        this._transformer2D = new Transformer2D();

        this.currentState = SelectStates.SELECT;
        this.element.addEventListener("pointerdown", this._pointerDownHandler);
    }

    async exit() {
        await this.gizmo._hide();
        this._selected = null;
        this._transformer2D = this._transformer2D.dispose();
        await super.exit();
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
        const selected = this._selected;
        await this._setSelected();

        if (this._selected == null) {
            await this.gizmo.performAction({ selected: null });
            return await this._manageCursorEvents(false);
        }

        // 1. Though you are hovering, you did not click on a gizmo item
        //    Go into selection state and check for selections being made
        if (this._selected.object.parent.name !== "transform-gizmo") {
            return this._pointerDownSelect();
        }

        this._hoverName = this._selected.object.name;
        this._transformer2D.startPoint = await this.getIntersectionPlanePosition();
        this._transformer2D.startScale = selected.object.scale.clone();
        this._transformer2D.details = this.transFormGizmo.transformDetails[this._hoverName];
        this._transformer2D.startPosition = selected.object.position.clone();

        this.currentState = this._selected.object === this.gizmo._parts.center ? SelectStates.GIZMO_DRAG : SelectStates.GIZMO_RESIZE;
        this._selected = selected;
    }

    /**
     * Pointer is down, handle selection checks
     * @returns {Promise<void>}
     * @private
     */
    async _pointerDownSelect() {
        await this._setSelected();

        const isFrozen = this._selected?.object.isFrozen == true;
        this.currentShape = isFrozen === true ? null : this._selected?.object;

        await this.gizmo.performAction({
            selected: this.currentShape
        })

        await this._manageCursorEvents(this.currentShape != null);
    }

    /**
     * Update the mouse data and handle the pointer up event based on the current state
     * @param event
     * @returns {Promise<void>}
     * @private
     */
    async _pointerUp(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);

        if (this.currentShape && this.currentState == SelectStates.GIZMO_RESIZE) {
            const scale = this.currentShape.scale.clone();
            this.currentShape.scale.set(Math.abs(scale.x), Math.abs(scale.y), 1);
        }

        this.currentState = this._selected == null ? SelectStates.SELECT : SelectStates.GIZMO_HOVER;
        this._startPoint = null;
        this.currentShape = null;
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
        this._raycaster.setFromCamera(this._mouse, this.camera);

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
            this._selected = this._intersections[0].object === this._intersectPlane ? null : this._intersections[0];

            if (this._selected?.parent?.constructor?.name == "Group") {
                this._selected = this._selected.parent;
            }
        }
    }

    /**
     * A valid selection has been made, enable the other events to check for further activities.
     * @param isGizmoVisible
     * @returns {Promise<void>}
     * @private
     */
    async _manageCursorEvents(isGizmoVisible) {
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
        this._raycaster.intersectObjects(this.transFormGizmo._partsGroup.children, false, this._intersections);

        let cursor = "default";

        if (this._intersections.length > 0) {
            cursor = this.transFormGizmo.transformDetails[this._intersections[0].object.name].cursor;
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
        const point = await this.getIntersectionPlanePosition();
        await this._transformer2D.translate(this._selected.object, this.transFormGizmo, point.x, point.y, this._renderHandler);
    }

    /**
     * You are resizing the gizmo.
     * Request and update on the gizmo according to the resize operation
     * @param event
     * @returns {Promise<void>}
     * @private
     */
    async _gizmoResize(event) {
        const point = await this.getIntersectionPlanePosition();
        await this._transformer2D.scale(this._selected.object, this.transFormGizmo, point);
        this.gizmo.refresh(this._selected.object);
    }
}