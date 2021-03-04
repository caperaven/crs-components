class ImageCard extends HTMLElement {

    get src() {
        return this._src;
    }

    set src(newValue) {
        this._src = newValue;
        if (this.image != null) {
            this.image.setAttribute("src", newValue);
        }
    }

    static get observedAttributes() { return ["src"]; }

    async connectedCallback() {
        this._mouseDownHandler = this._mouseDown.bind(this);
        this.addEventListener("mousedown", this._mouseDownHandler);
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
        requestAnimationFrame(() => {
            this.image = this.querySelector("img");
            this.image.setAttribute("src", this.src);
        })
    }

    async disconnectedCallback() {
        this.removeEventListener("mousedown", this._mouseDownHandler);
        this._mouseDownHandler = null;
    }

    async _mouseDown(event) {
        event.preventDefault();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}

customElements.define("image-card", ImageCard);