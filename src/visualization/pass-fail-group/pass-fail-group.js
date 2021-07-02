class PassFailGroup extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        if (this.isReady === true) {
            this.update(newValue);
        }
    }

    async connectedCallback() {
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        requestAnimationFrame(async () => {
            await this._drawItems(this.data);
            this.setAttribute("tabindex", 0);
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

    async _drawItems(data) {
        const ul = await this._clearItems();
        if (data == null) return;

        this.querySelector("h2").textContent = this.dataset.title;

        const titleField = this.dataset.titlefield || "title";
        const passField = this.dataset.passfield || "pass";
        const failField = this.dataset.failfield || "fail";

        const lastItem = data[data.length - 1];
        const fragment = document.createDocumentFragment();
        data.forEach(item => {
            const title = item[titleField];
            const pass  = item[passField];
            const fail  = item[failField];
            this._createItem(title, pass, fail, fragment);

            if (item !== lastItem) {
                fragment.appendChild(document.createElement("hr"));
            }
        });
        ul.appendChild(fragment);
    }

    async _createItem(title, pass, fail, fragment) {
        const element = document.createElement("pass-fail-card");
        element.dataset.title = title;
        element.dataset.pass  = pass;
        element.dataset.fail  = fail;
        fragment.appendChild(element);
    }
}

customElements.define("pass-fail-group", PassFailGroup);