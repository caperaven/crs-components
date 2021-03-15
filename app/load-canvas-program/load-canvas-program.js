import {program} from "./program.js";
import {loadProgram} from "./../../threejs-helpers/programs/load-program.js";
import "./../../components/orthographic-canvas/orthographic-canvas.js";

export default class LoadCanvasProgram extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        document.addEventListener("keydown", event => {
            if (event.code == "Enter") {
                this.canvas.render();
            }
        })
    }

    async loadProgram(event) {
        this.canvas = event.target;
        await loadProgram(this.canvas, program);
    }
}