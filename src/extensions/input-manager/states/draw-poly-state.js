/**
 * Draw polygon by clicking on canvas until you click on the first item again to close the loop
 */

import {BaseState} from "./base-state.js";

export class DrawPolyState extends BaseState {
    constructor(context) {
        super(context,"draw_polygon");
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