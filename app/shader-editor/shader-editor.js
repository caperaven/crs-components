import "../../src/components/monaco-editor/monaco-editor.js";
import "../../src/components/orthographic-canvas/orthographic-canvas.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {ShaderMaterial} from "/node_modules/three/src/materials/ShaderMaterial.js";

export default class ShaderEditor extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this._keyDownHandler = this._keyDown.bind(this);
        document.addEventListener("keydown", this._keyDownHandler);
    }

    async disconnectedCallback() {
        this._vertexEditor = null;
        this._fragmentEditor = null;
        this._canvas = null;

        document.removeEventListener("keydown", this._keyDownHandler);
        this._keyDownHandler = null;

        await super.disconnectedCallback();
    }

    preLoad() {
        this.setProperty("tab", "fragment");
    }

    load() {
        this._canvas = this.element.querySelector("perspective-canvas");
        super.load();
    }

    tabChanged(newValue) {
        if (this._fragmentEditor == null) return;

        this._fragmentEditor.visible = newValue == "fragment";
        this._vertexEditor.visible = newValue == "vertex";
    }

    async loadFragmentCode(event) {
        this._fragmentEditor = event.target;

        const code = await fetch(import.meta.url.replace(".js", "-fragment.glsl")).then(result => result.text());
        this._fragmentShader = code;
        this._fragmentEditor.value = code;
        this._fragmentEditor.visible = this.getProperty("tab") === "fragment";
        await this._buildPlane();
    }

    async loadVertexCode(event) {
        this._vertexEditor = event.target;

        const code = await fetch(import.meta.url.replace(".js", "-vertex.glsl")).then(result => result.text());
        this._vertexShader = code;
        this._vertexEditor.value = code;
        this._vertexEditor.visible = this.getProperty("tab") === "vertex";
        await this._buildPlane();
    }

    async loadCanvas(event) {
        this._canvas = event.target;
        await this._buildPlane();
    }

    async _buildPlane() {
        if (this._vertexShader == null || this._fragmentShader == null || this._canvas == null) return;
        const geometry = new PlaneGeometry(this._canvas.width, this._canvas.height);

        const material = new ShaderMaterial({
            uniforms: {},
            vertexShader: this._vertexShader,
            fragmentShader: this._fragmentShader
        });

        this.plane = new Mesh(geometry, material);
        this._canvas.scene.add(this.plane);
        this._canvas.render();
    }

    async _keyDown(event) {
        if (event.altKey == true && event.code == "Enter") {
            this._vertexShader = this._vertexEditor.value;
            this._fragmentShader = this._fragmentEditor.value;

            this.plane.material.fragmentShader = this._fragmentShader;
            this.plane.material.vertexShader = this._vertexShader;
            this.plane.material.needsUpdate = true;
            this._canvas.render();
        }
    }
}