/**
 * Draw a vector based image at the given location and size
 */
export class DrawImageState extends crs.state.StateBase {
    constructor(context) {
        super("draw/image");
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