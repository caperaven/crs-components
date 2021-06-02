import {BaseState} from "./base-state.js";

/**
 * Draw a vector based image at the given location and size
 */
export class DrawImageState extends BaseState {
    constructor(context) {
        super(context,"draw_image");
    }

    dispose() {
        super.dispose();
    }

    async enter() {
        await super.enter();
    }

    async exit() {
        await super.exit();
    }

    async _pointerDown(event) {

    }

    async _pointerUp(event) {

    }

    async _pointerMove(event) {

    }

}