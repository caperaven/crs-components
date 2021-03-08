import "./../../components/monaco-editor/monaco-editor.js";

export default class Monaco extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.editor = this.element.querySelector("crs-monaco-editor");
        this.editor.addEventListener("ready", async () => this.showNormal());
    }

    async showNormal() {
        this.editor.value = await fetch(import.meta.url).then(result => result.text());
    }

    async showDifference() {
        await this.editor.compare("Hello World", "Hello there World", "text/plain");
    }

    async jsDifference() {
        await this.editor.compare("function a() {}", "function b() {\n\tconst result = 2;\n}", "javascript");
    }
}