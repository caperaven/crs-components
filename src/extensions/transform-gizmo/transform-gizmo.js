class TransformGizmoWorker {
    constructor() {
        this._performActionHandler = this._performAction.bind(this);
        crsbinding.events.emitter.on("transform-gizmo", this._performActionHandler);
    }

    dispose() {
        crsbinding.events.emitter.remove("transform-gizmo", this._performActionHandler);
        this._performActionHandler = null;
    }

    _performAction(args) {
        console.log(args);
    }
}

export class TransformGizmo {
    static async enable(parent) {
        parent._transformGizmo = new TransformGizmoWorker();
    }

    static async disable(parent) {
        parent._transformGizmo.dispose();
        delete parent._transformGizmo;
    }
}