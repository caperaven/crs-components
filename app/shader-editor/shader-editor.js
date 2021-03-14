import "./../../components/monaco-editor/monaco-editor.js";
import "./../../components/perspective-canvas/perspective-canvas.js";
import {BoxGeometry} from "/node_modules/three/src/geometries/BoxGeometry.js";
import {RawShaderMaterial} from "/node_modules/three/src/materials/RawShaderMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";

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

    async _buildScene() {
        return new Promise(resolve => {
            const buildScene = (event) => {
                if (event != null) {
                    this._canvas.removeEventListener("ready", buildScene);
                }

                this._buildPlane();
                this._canvas.camera.position.z = 5;
                this._canvas.render();
            }

            if (this._canvas.isReady == true) {
                buildScene();
            }
            else {
                this._canvas.addEventListener("ready", buildScene);
            }
        })
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
        this._canvas.camera.position.z = 5;
    }

    _buildPlane() {
        const geometry = new BoxGeometry();
        const material = new RawShaderMaterial({
            vertexShader: this._vertexShader,
            fragmentShader: this._fragmentShader
        });
        const mesh = new Mesh(geometry, material);

        this._canvas.scene.add(mesh);
    }
}