/**
 * Draw a rectangle at the given location and size
 */

import {BaseState} from "./base-state.js";

export class DrawRectangleState extends BaseState {
    constructor(context) {
        super(context,"draw_rectangle");
    }

    dispose() {
        this._context = null;
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