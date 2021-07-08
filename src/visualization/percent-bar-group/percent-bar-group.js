import "./../../components/lists/unordered-list.js";

export class PercentBarGroup extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;

        if (this.isReady == true && newValue != null) {
            this._drawItems(newValue);
        }
    }

    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        requestAnimationFrame(() => {
            this._drawItems(this.data);
            this.isReady = true;
            this.dispatchEvent(new CustomEvent("isReady"));
        })
    }

    async disconnectedCallback() {
        this.data = null;
    }

    async _clearItems() {
        const ul = this.querySelector("ul");
        while(ul.children.length > 0) {
            ul.removeChild(ul.firstChild);
        }
        return ul;
    }

    async _getMaxValue(data, valueField) {
        if (this.dataset.maxaction == "sum") {
            return data.reduce((total, item) => total + item[valueField], 0);
        }

        const values = data.map(item => item[valueField]);
        return Math.max(...values);
    }

    async _drawItems(data) {
        const ul = await this._clearItems();
        if (data == null) return;

        const fragment = document.createDocumentFragment();

        const titleField = this.dataset.titlefield || "title";
        const valueField = this.dataset.valuefield || "value";
        const colorField = this.dataset.colorfield || "color";

        const max = await this._getMaxValue(data, valueField);

        data.forEach(record => {
            const title = record[titleField];
            const value = record[valueField];
            const color = record[colorField];
            this._createItem(title, value, max, color, fragment);
        });

        ul.appendChild(fragment);
    }

    _createItem(title, value, max, color, fragment) {
        const element = document.createElement("percent-bar");
        element.dataset.title = title;
        element.dataset.value = value;
        element.dataset.max = max;

        if (color != null) {
            element.dataset.barcolor = color;
        }

        fragment.appendChild(element);
    }
}

customElements.define("percent-bar-group", PercentBarGroup);