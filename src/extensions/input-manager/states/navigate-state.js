/**
 * Move the camera around to navigate the scene
 */
export class NavigateState extends crs.state.StateBase {
    constructor(context) {
        super("navigate");
        this._context = context;
    }

    dispose() {
        this._context = null;
    }

    async enter() {
    }

    async exit() {
    }
}