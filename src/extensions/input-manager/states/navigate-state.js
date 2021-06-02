/**
 * Move the camera around to navigate the scene
 */

import {BaseState} from "./base-state.js";

export class NavigateState extends BaseState {
    constructor(context) {
        super(context,"navigate");
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