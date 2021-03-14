import "./../../components/monaco-editor/monaco-editor.js";
import "./../../components/perspective-canvas/perspective-canvas.js";

export default class ShaderEditor extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        this._vertexEditor = null;
        this._fragmentEditor = null;
        await super.disconnectedCallback();
    }

    preLoad() {
        this.setProperty("tab", "fragment");
    }

    load() {
        this._fragmentEditor = this.element.querySelector("#edtFragment");
        this._vertexEditor = this.element.querySelector("#edtVertex");

        const tab = this.getProperty("tab");

        const fragmentReady = () => {
            this._fragmentEditor.removeEventListener("ready", fragmentReady);

            fetch(import.meta.url.replace(".js", "-fragment.glsl"))
                .then(result => result.text())
                .then(code => {
                    this._fragmentEditor.value = code;
                    this._fragmentEditor.visible = tab === "fragment";
                });
        }

        const vertexReady = () => {
            this._vertexEditor.removeEventListener("ready", vertexReady);
            fetch(import.meta.url.replace(".js", "-vertex.glsl"))
                .then(result => result.text())
                .then(code => {
                    this._vertexEditor.value = code;
                    this._vertexEditor.visible = tab === "vertex";
                });
        }

        this._fragmentEditor.addEventListener("ready", fragmentReady);
        this._vertexEditor.addEventListener("ready", vertexReady);

        super.load();
    }

    tabChanged(newValue) {
        if (this._fragmentEditor == null) return;

        this._fragmentEditor.visible = newValue == "fragment";
        this._vertexEditor.visible = newValue == "vertex";
    }
}