class MonacoEditor extends HTMLElement {
    get editor() {
        return this._editor;
    }

    set editor(newValue) {
        this._editor = newValue;
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
    }

    async disconnectedCallback() {
        this.editor = null;
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

        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(this, options);
        });
    }
}

customElements.define("crs-monaco-editor", MonacoEditor);