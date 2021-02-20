class DataGrid3d extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        this.refresh().catch(e => console.error(e));
    }

    async initialize(columnsDef) {

    }
}

customElements.define("data-grid-3d", DataGrid3d)