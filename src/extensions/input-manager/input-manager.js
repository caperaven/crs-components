class InputManagerWorker {
    constructor(parent, allowDrag) {
        this.allowDrag = allowDrag;
        this._element = parent.renderer.domElement;
        this._parent = parent;
        this._pointerDownHandler = this._pointerDown.bind(this);
        this._pointerMoveHandler = this._pointerMove.bind(this);
        this._pointerUpHandler = this._pointerUp.bind(this);
        this._element.addEventListener("pointerdown", this._pointerDownHandler);
    }

    async initialize() {
        return new Promise(async resolve => {
            const Plane = await crs.getThreePrototype("Plane");
            const Raycaster = await crs.getThreePrototype("Raycaster");
            const Vector3 = await crs.getThreePrototype("Vector3");
            const Vector2 = await crs.getThreePrototype("Vector2");
            const Matrix4 = await crs.getThreePrototype("Matrix4");

            this._plane = new Plane();
            this._raycaster = new Raycaster();
            this._offset = new Vector3();
            this._intersections = new Vector3();
            this._worldPosition = new Vector3();
            this._inverseMatrix = new Matrix4();
            this._intersections = [];
            this._selected = null;

            this._mouseStart = new Vector2();
            this._mouse = new Vector2();

            requestAnimationFrame(() => {
                this._rect = this._element.getBoundingClientRect();
                resolve();
            })
        })
    }

    async dispose() {
        await this._disableEvents();
        this._element.removeEventListener("pointerdown", this._pointerDownHandler);
        this._element = null;
        this._mouse = null;
        this._mouseStart = null;
        this._pointerDownHandler = null;
        this._pointerMoveHandler = null;
        this._pointerUpHandler = null;

        this._plane = null;
        this._raycaster = null;
        this._offset = null;
        this._intersections = null;
        this._worldPosition = null;
        this._inverseMatrix = null;
        this._intersections = null;
        this._selected = null;
        return null;
    }

    async _setMouse(variable, event) {
        variable.x = ((event.clientX - this._rect.left) / this._rect.width) * 2 - 1;
        variable.y = - ((event.clientY - this._rect.top) / this._rect.height) * 2 + 1;
    }

    async _pointerDown(event) {
        event.preventDefault();
        await this._setMouse(this._mouseStart, event);
        await this.addDebugCube();
        // if (await this._setSelected() === true) {
        //     await this._enableEvents();
        // }
    }

    async _pointerMove(event) {
        event.preventDefault();
        await this._setMouse(this._mouse, event);

        if (await this._canDrag() === true) {
            await this._moveSelected();
        }
    }

    async _pointerUp(event) {
        event.preventDefault();
        await this._setMouse(this._mouse, {clientX: 0, clientY:0});
        await this._setMouse(this._mouseStart, {clientX: 0, clientY: 0});
        await this._disableEvents();
    }

    async _enableEvents() {
        this._element.addEventListener("pointermove", this._pointerMoveHandler);
        this._element.addEventListener("pointerup", this._pointerUpHandler);
    }

    async _disableEvents() {
        this._element.removeEventListener("pointermove", this._pointerMoveHandler);
        this._element.removeEventListener("pointerup", this._pointerUpHandler);
    }

    async _setSelected() {
        this._intersections.length = 0;
        this._selected = null;

        this._raycaster.setFromCamera(this._mouseStart, this._parent.camera);
        this._raycaster.intersectObjects(this._parent.scene.children, true, this._intersections);

        if (this._intersections.length > 0) {
            this._selected = this._intersections[0];

            if (this._selected.parent.constructor.name == "Group") {
                this._selected = this._selected.parent;
            }
        }

        return this._selected != true;
    }

    async _canDrag() {
        if (this.allowDrag !== true || this._selected == null) return false;
        const xOffset = this._mouse.x - this._mouseStart.x;
        const yOffset = this._mouse.y - this._mouseStart.y;
        const offset = 0.1;
        return Math.abs(xOffset) > offset || Math.abs(yOffset) > offset;
    }

    async _moveSelected() {
        // move the selected item according to the pointer coordinates
    }

    async addDebugCube() {
        const box = await crs.createThreeObject("BoxGeometry", 1, 1, 1);
        const material = await crs.createThreeObject("MeshBasicMaterial", { color: 0xff0000 });
        const object = await crs.createThreeObject("Mesh", box, material);
        object.position.set(this._mouseStart.x, this._mouseStart.y, 0);
        this._parent.scene.add(object);
        this._parent.render();
    }
}

export class InputManager {
    static async enable(parent, options) {
        parent._inputManager = new InputManagerWorker(parent,options.allow_drag || false);
        await parent._inputManager.initialize();
    }

    static async disable(parent) {
        parent._inputManager = parent._inputManager.dispose();
    }
}