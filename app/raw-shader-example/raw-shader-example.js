import "../../src/components/orthographic-canvas/orthographic-canvas.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {RawShaderMaterial} from "/node_modules/three/src/materials/RawShaderMaterial.js";
import {fragmentShader, vertexShader} from "./shaders.js";
import {Color} from "/node_modules/three/src/math/Color.js";

export default class RawShaderExample extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("orthographic-canvas");
        this._animateHandler = this._animate.bind(this);
    }

    async disconnectedCallback() {
        this.plane = null;
        this.canvas = null;
        this._animateHandler = null;
        await super.disconnectedCallback();
    }

    async loadProgram() {
        const geometry = new PlaneGeometry(512, 512);

        const material = new RawShaderMaterial({
            uniforms: {
                colorA: {value: new Color(0xff0000)},
                colorB: {value: new Color(0x0000ff)},
                time: {value: 0},
                map: {value: null}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        this.plane = new Mesh(geometry, material);
        this.canvas.scene.add(this.plane);
        await this._animate();
    }

    async _animate(time) {
        if (this._animateHandler == null) return;
        requestAnimationFrame(this._animateHandler);
        this.plane.material.uniforms.time.value = time || 0;
    }
}