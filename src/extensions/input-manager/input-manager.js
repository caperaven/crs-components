import {SelectState} from "./states/select-state.js";
import {NavigateState} from "./states/navigate-state.js";
import {DrawRectangleState} from "./states/draw-rectangle-state.js";
import {DrawCircleState} from "./states/draw-circle-state.js";
import {DrawPolyState} from "./states/draw-poly-state.js";
import {DrawImageState} from "./states/draw-image-state.js";

class InputManagerWorker {
    constructor(canvas) {
        this.canvas = canvas;
        this._states = new crs.state.SimpleStateMachine();
    }

    async initialize() {
        return new Promise(async resolve => {
            await this._states.addState(new SelectState(this));
            await this._states.addState(new NavigateState(this));
            await this._states.addState(new DrawRectangleState(this));
            await this._states.addState(new DrawCircleState(this));
            await this._states.addState(new DrawPolyState(this));
            await this._states.addState(new DrawImageState(this));

            requestAnimationFrame(() => {
                this.canvasRect = this.canvas.renderer.domElement.getBoundingClientRect();
                this._states.gotoState("select")
                resolve();
            })
        })
    }

    async dispose() {
        this.canvas = null;
        this.canvasRect = null;
        this._states.dispose();
        return null;
    }
}

export class InputManager {
    static async enable(parent) {
        parent._inputManager = new InputManagerWorker(parent);
        await parent._inputManager.initialize();
    }

    static async disable(parent) {
        parent._inputManager = parent._inputManager.dispose();
    }
}