/**
 * Draw polygon by clicking on canvas until you click on the first item again to close the loop
 */
export class DrawPolyState extends crs.state.StateBase {
    constructor(context) {
        super("draw/polygon");
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