import {setMouse} from "./../helpers/pointer-functions.js";

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

    constructor(context) {
        super("select");
        this._context = context;
        this._clickHandler = this._click.bind(this);
    }

    dispose() {
        this._context = null;
        this._clickHandler = null;
    }

    async enter() {
        const Raycaster = await crs.getThreePrototype("Raycaster");
        const Vector2 = await crs.getThreePrototype("Vector2");

        this._raycaster = new Raycaster();
        this._mouse = new Vector2();
        this._selected = null;
        this._intersections = [];
        this.element.addEventListener("click", this._clickHandler);
    }

    async exit() {
        this.element.removeEventListener("click", this._clickHandler);

        this._raycaster = null;
        this._mouse = null;
        this._selected = null;
        this._intersections = null;
    }

    async _click(event) {
        await setMouse(this._mouse, event, this._context.canvasRect);
        await this._setSelected();

        crsbinding.events.emitter.emit("transform-gizmo", {
            selected: this._selected?.object || null
        })
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
}