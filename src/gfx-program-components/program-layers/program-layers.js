class ProgramLayers extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get program() {
        return this._program;
    }

    set program(newValue) {
        this._program = newValue;
        this._updateLayersData();
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        delete this._program;
        await super.disconnectedCallback();
    }

    async _updateLayersData() {
        const layers = [];
        for (let layer of this._program._layers) {
            layers.push({
                id: layer.id,
                title: layer.title,
                visible: layer.group == null ? false : layer.group.visible
            })
        }
        this.setProperty("layers", layers);
    }

    listClick(event) {
        if (event.target.type == "checkbox") {
            const id = event.target.dataset.id;
            this._program.setLayerVisibility(id, event.target.checked);
        }
    }
}

customElements.define("program-layers", ProgramLayers);