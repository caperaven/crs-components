export class BaseState extends crs.state.StateBase {
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

    constructor(context, state) {
        super(state);
        this._context = context;
        this._renderHandler = this._render.bind(this);
        this._pointerDownHandler = this._pointerDown.bind(this);
        this._pointerUpHandler = this._pointerUp.bind(this);
        this._pointerMoveHandler = this._pointerMove.bind(this);
    }

    dispose() {
        this._context = null;
        this._pointerDownHandler = null;
        this._pointerUpHandler = null;
        this._pointerMoveHandler = null;
        this._renderHandler = null;
    }

    async enter() {
        const Raycaster = await crs.getThreePrototype("Raycaster");
        const Vector2 = await crs.getThreePrototype("Vector2");

        this._raycaster = new Raycaster();
        this._mouse = new Vector2();
        this._mouseStart = new Vector2();

        this._intersections = [];
        this._intersectPlane = this._context.canvas.scene.getObjectByName("intersect_plane");
    }

    async exit() {
        this.element.removeEventListener("pointerup", this._pointerUpHandler);
        this.element.removeEventListener("pointermove", this._pointerMoveHandler);
        this.element.removeEventListener("pointerdown", this._pointerDownHandler);
        this._raycaster = null;
        this._mouse = null;
        this._mouseStart = null;
        this._intersections = null;
        this._intersectPlane = null;
    }

    /**
     * Check the world collision details on the intersection plane and return the collision point.
     * @returns {Promise<*>}
     */
    async getIntersectionPlanePosition() {
        this._intersections.length = 0;
        const intersection = this._raycaster.intersectObjects([this._intersectPlane], false, this._intersections)[0];
        return intersection.point.clone();
    }

    async _render() {
        this._context.canvas.render();
    }
}