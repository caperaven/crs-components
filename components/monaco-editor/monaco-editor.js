class MonacoEditor extends HTMLElement {
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
        this.style.display = "block";
        this.style.overflow = "hidden";

        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        await this._addRequireJS();
        await this._initEditor();

        this.dispatchEvent(new CustomEvent("ready"));
    }

    async disconnectedCallback() {
        if (this._editor != null) this._editor.dispose();
        this._editor = null;
        this._monaco = null;
    }

    async _addRequireJS() {
        if (document.getElementById("requirejs") == null) {
            return new Promise(resolve => {
                const script = document.createElement("script");
                script.onload = resolve;
                script.id = "requirejs";
                script.setAttribute("src","/3rd-party/require.js");
                document.getElementsByTagName("head")[0].appendChild(script);
            })
        }
    }

    async _initEditor() {
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

    async compare(origional, modified, language) {
        if (this.editor != null && this._editor.__type != "difference") {
            this.editor.dispose();
            this.editor = monaco.editor.createDiffEditor(this);
            this._editor.__type = "difference";
        }

        language = language || this.language;

        const originalModel = this.monaco.editor.createModel(origional, language);
        const modifiedModel = this.monaco.editor.createModel(modified, language);

        this.editor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
    }
}

customElements.define("crs-monaco-editor", MonacoEditor);