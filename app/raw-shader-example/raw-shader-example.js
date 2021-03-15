import "./../../components/orthographic-canvas/orthographic-canvas.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {RawShaderMaterial} from "/node_modules/three/src/materials/RawShaderMaterial.js";
import {fragmentShader, vertexShader} from "./shaders.js";

export default class RawShaderExample extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");
    }

    async disconnectedCallback() {
        this.plane = null;
        this.canvas = null;
        await super.disconnectedCallback();
    }

    async loadProgram() {
        const geometry = new PlaneGeometry(512, 512);

        const material = new RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.plane = new Mesh(geometry, material);
        this.canvas.scene.add(this.plane);
    }

    async animate(time) {
        requestAnimationFrame(this._animateHandler);
        this.plane.material.uniform.time = time;
    }
}