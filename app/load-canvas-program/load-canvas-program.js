import {program} from "./program.js";
import {loadProgram} from "./../../threejs-helpers/programs/load-program.js";
import "./../../components/orthographic-canvas/orthographic-canvas.js";

export default class LoadCanvasProgram extends crsbinding.classes.ViewBase {
    async disconnectedCallback() {
        this.program.dispose();
        this.program = null;
        await super.disconnectedCallback();
    }

    async loadProgram(event) {
        this.canvas = event.target;
        this.program = await loadProgram(this.canvas, program);
        this.program._canvas.render();
        //this.program.animate();
    }
}