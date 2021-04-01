/**
 * Todo
 * set value must work internal
 * set language features must work internal
 * set carret on this and transfer to editor when loaded.
 */

class MonacoEditor extends HTMLElement {
    static get observedAttributes() {
        return ["hidden"];
    }

    get editor() {
        return this._editor;
    }

    set editor(newValue) {
        this._editor = newValue;
    }

    get monaco() {
        return this._monaco;
    }

    get showMiniMap() {
        return this._showMiniMap || this.getAttribute("show-minimap") || true;
    }

    set showMiniMap(newValue) {
        this._showMiniMap = newValue;
    }

    get language() {
        if (this._language == null) {
            this._language = this.getAttribute("language") || "javascript";
        }
        return this._language;
    }

    set language(newValue) {
        this._language = newValue;
    }

    get value() {
        return this.editor.getValue();
    }

    set value(newValue) {
        this._value = newValue;
        this._update();
    }

    get theme() {
        if (this._theme == null) {
            this._theme = this.getAttribute("theme");
        }
        return this._theme;
    }

    set theme(newValue) {
        this._theme = newValue;
    }

    async connectedCallback() {
        this._notifyReadyHandler = this._notifyReady.bind(this);
        this.style.overflow = "hidden";

        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        await this._addRequireJS();
        await this._initEditor();
        await this._notifyReady();
    }

    async disconnectedCallback() {
        if (this._editor != null) this._editor.dispose();
        this._editor = null;
        this._monaco = null;
        this._notifyReadyHandler = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "hidden" && newValue == null && this._editor != null) {
            this._editor.layout();
        }
    }

    async _addRequireJS() {
        if (document.getElementById("requirejs") == null) {
            return new Promise(resolve => {
                const script = document.createElement("script");
                script.onload = resolve;
                script.id = "requirejs";

                const requireFile = crsbinding.utils.relativePathFrom(import.meta.url, "./../../3rd-party/require.js");

                script.setAttribute("src",requireFile);
                document.getElementsByTagName("head")[0].appendChild(script);
            })
        }
    }

    async _initEditor() {
        if (globalThis.require == null) {
            return requestAnimationFrame(() => this._initEditor());
        }

        require.config({paths: {vs: '/node_modules/monaco-editor/min/vs'}});

        const options = {
            language: this.language,
            minimap: {
                enabled: this.showMiniMap
            },
            parameterHints: {
                enabled: true,
                cycle: true
            }
        };

        if (this.theme != null) {
            options.theme = this.theme;
        }

        return new Promise(resolve => {
            require(['vs/editor/editor.main'], () => {
                this._monaco = monaco;
                this._editor = monaco.editor.create(this, options);
                this._editor.__type = "normal";
                resolve();
            });
        })
    }

    async _update() {
        if (this._editor != null && this._editor.__type != "normal") {
            this._editor.dispose();
            this._editor = monaco.editor.create(this);
            this._editor.__type = "normal";
        }

        const model = this.monaco.editor.createModel(this._value);
        model.getLanguageIdentifier();
        this.monaco.editor.setModelLanguage(model, this.language);

        const options = {
            language: this.language,
            minimap: {
                enabled: this.showMiniMap
            },
            parameterHints: {
                enabled: true,
                cycle: true
            }
        };

        if (this.theme != null) {
            options.theme = this.theme;
        }

        this.editor.setModel(model);
        this._editor.updateOptions(options);
    }

    async compare(original, modified, language) {
        if (this.editor != null && this._editor.__type != "difference") {
            this.editor.dispose();
            this.editor = monaco.editor.createDiffEditor(this);
            this._editor.__type = "difference";
        }

        language = language || this.language;

        const originalModel = this.monaco.editor.createModel(original, language);
        const modifiedModel = this.monaco.editor.createModel(modified, language);

        this.editor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
    }

    async _notifyReady() {
        if (this.monaco == null || this.monaco.editor == null) {
            return requestAnimationFrame(this._notifyReadyHandler);
        }

        this.isReady = true;
        this.dispatchEvent(new CustomEvent("ready"));
    }
}

customElements.define("crs-monaco-editor", MonacoEditor);