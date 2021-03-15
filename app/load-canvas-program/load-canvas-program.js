import {program} from "./program.js";
import {loadProgram} from "./../../threejs-helpers/programs/load-program.js";
import "./../../components/orthographic-canvas/orthographic-canvas.js";

export default class LoadCanvasProgram extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        this.plane = null;
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async loadProgram(event) {
        const canvas = event.target;
        await loadProgram(canvas, program);
    }
}