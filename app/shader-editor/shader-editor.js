import "./../../components/monaco-editor/monaco-editor.js";
import "./../../components/orthographic-canvas/orthographic-canvas.js";
import {RawShaderMaterial} from "/node_modules/three/src/materials/RawShaderMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {Color} from "/node_modules/three/src/math/Color.js";

export default class ShaderEditor extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        this._vertexEditor = null;
        this._fragmentEditor = null;
        this._canvas = null;
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
    }

    async loadVertexCode(event) {
        this._vertexEditor = event.target;

        const code = await fetch(import.meta.url.replace(".js", "-vertex.glsl")).then(result => result.text());
        this._vertexShader = code;
        this._vertexEditor.value = code;
        this._vertexEditor.visible = this.getProperty("tab") === "vertex";
    }

    async loadCanvas(event) {
        this._canvas = event.target;
        await this._buildPlane();
    }

    async _buildPlane() {
        const geometry = new PlaneGeometry(this._canvas.width, this._canvas.height);
        const material = new MeshBasicMaterial({color: new Color(0xff0090)});
        this.plane = new Mesh(geometry, material);
        this._canvas.scene.add(this.plane);
        this._canvas.render();
    }
}