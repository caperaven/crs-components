const device = Object.freeze({
    MOBILE: "mobile",
    DESKTOP: "desktop",
    get(width, mobileWidth) {
        return width <= mobileWidth ? device.MOBILE : device.DESKTOP
    }
});

class AdaptiveLoader extends HTMLElement {
    static get observedAttributes() { return ["data-folder", "data-schema"]; }

    get width() {
        return this._width;
    }

    set width(newValue) {
        this._width = newValue;
        this.style.width = `${newValue}px`;
    }

    disconnectedCallback() {
        this.cache = null;
        crsbinding.observation.releaseChildBinding(this);
    }

    /**
     * Load content based on if it is a schema or html
     * @returns {Promise<void>}
     * @private
     */
    async _loadContent() {
        if (this._isBusy === true) return;

        const width  = this.width || this.getBoundingClientRect().width;
        const target = device.get(width, Number(this.dataset.mobilewidth || 850));

        if (this.target !== target) {
            this._isBusy = true;
            this.target = target;
            crsbinding.observation.releaseChildBinding(this);

            let html = this.cache?.[this.target];
            if (html == null) {
                html = this.dataset.schema === "true" ? await this._fromSchema() : await this._fromHTML();
                this.cache = this.cache || {};
                this.cache[this.target] = html;
            }

            this.innerHTML = html;
            await crsbinding.parsers.parseElements(this.children, this.dataset.context, {folder: this.dataset.folder});
            this._isBusy = false;
        }
    }

    /**
     * Send a event aggregation to fetch html for a given schema
     * @returns {Promise<string>} HTML generated from the schema
     * @private
     */
    async _fromSchema() {
        return new Promise(resolve => {
            crsbinding.events.emitter.emit("adaptive-schema", {
                context: this.dataset.schema,
                device: this.target,
                callback: html => resolve(html)
            })
        });
    }

    /**
     * Load html from the paths defined as part of the dataset
     * @returns {Promise<string>}
     * @private
     */
    async _fromHTML() {
        const target = this.dataset[this.target];
        const folder = this.dataset.folder;
        const url = crsbinding.utils.relativePathFrom(folder, target);
        return await fetch(url).then(result => result.text());
    }

    /**
     * Used by the binding engine to notify this component of changes it should be aware of
     * @param args
     * @returns {Promise<void>}
     */
    async onMessage(args) {
        this.width = Number(args.width);
        if (args.action === "resize") {
            await this._loadContent();
        }
    }

    attributeChangedCallback() {
        this._loadContent().catch(error => console.error(error));
    }
}

customElements.define("adaptive-loader", AdaptiveLoader);