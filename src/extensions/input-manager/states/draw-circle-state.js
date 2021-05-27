/**
 * Draw a circle mesh at the given location and size.
 * Size widget is locked to equal width and height
 */
export class DrawCircleState extends crs.state.StateBase {
    constructor(context) {
        super("draw/circle");
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