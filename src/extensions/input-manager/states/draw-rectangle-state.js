/**
 * Draw a rectangle at the given location and size
 */
export class DrawRectangleState extends crs.state.StateBase {
    constructor(context) {
        super("draw/rectangle");
        this._context = context;
    }

    dispose() {
        this._context = null;
        super.dispose();
    }

    async enter() {
    }

    async exit() {
    }
}