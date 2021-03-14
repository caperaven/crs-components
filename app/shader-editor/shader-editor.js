import "./../../components/monaco-editor/monaco-editor.js";
import "./../../components/perspective-canvas/perspective-canvas.js";

export default class ShaderEditor extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("tab", "fragment");
    }

    load() {
        return super.load();
        this._fragmentEditor = this.element.querySelector("#edtFragment");
        this._vertexEditor = this.element.querySelector("#edtVertex");

        fetch(import.meta.url.replace(".js", "-fragment.glsl"))
            .then(result => result.text())
            .then(code => this._fragmentEditor.value = code);

        fetch(import.meta.url.replace(".js", "-vertex.glsl"))
            .then(result => result.text())
            .then(code => this._vertexEditor.value = code);

        super.load();
    }
}