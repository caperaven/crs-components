class PassFailGroup extends HTMLElement {
    get data() {
        return this._data;
    }

    set data(newValue) {
        this._data = newValue;
        if (this.isReady === true && newValue != null) {
            this._drawItems(newValue);
        }
    }

    async connectedCallback() {
        const path = crsbinding.utils.relativePathFrom(import.meta.url, "./../pass-fail-card/pass-fail-card.html");
        await crsbinding.templates.load("PassFailCard", path);

        const url = import.meta.url.replace(".js", ".html");
        const template = await crsbinding.templates.load("PassFailGroup", url);
        this.appendChild(template.content.cloneNode(true));

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