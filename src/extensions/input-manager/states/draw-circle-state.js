/**
 * Draw a circle mesh at the given location and size.
 * Size widget is locked to equal width and height
 */

import {BaseState} from "./base-state.js";

export class DrawCircleState extends BaseState {
    constructor(context) {
        super(context,"draw_circle");
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