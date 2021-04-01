import "/../../src/components/monaco-editor/monaco-editor.js";

export default class Monaco extends crsbinding.classes.ViewBase {
    async preLoad() {
        this.setProperty("isVisible", true);
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.editor = this.element.querySelector("crs-monaco-editor");
        this.editor.addEventListener("ready", async () => this.showNormal());
    }

    async disconnectedCallback() {
        this.editor = null;
        await super.disconnectedCallback();
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

    async jsonDifference() {
        await this.editor.compare(
            JSON.stringify({
                "test": "value1"
            }, null, 4),
            JSON.stringify({
                "test-1": "value1",
                "name": "Test"
            }, null, 4),
            "json"
        )
    }

    async toggleVisible() {
        const isVisible = this.getProperty("isVisible");
        this.setProperty("isVisible", !isVisible);
    }
}