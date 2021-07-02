class PieChart extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        if (this.isReady === true) {
            this._update(newValue);
        }
    }

    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
    }

    async disconnectedCallback() {
        delete this._data;
    }

    async _clearItems() {
        const ul = this.querySelector("ul");
        while(ul.children.length > 0) {
            ul.removeChild(ul.firstChild);
        }
        return ul;
    }

    async _update(data) {
        const ul = this._clearItems();
    }
}

customElements.define("pie-chart", PieChart);