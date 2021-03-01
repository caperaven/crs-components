class ImageCard extends HTMLElement {

    static get observedAttributes() { return ["src"]; }

    async connectedCallback() {
        this._mouseDownHandler = this._mouseDown.bind(this);
        this.addEventListener("mousedown", this._mouseDownHandler);
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());
    }

    async disconnectedCallback() {
        this.removeEventListener("mousedown", this._mouseDownHandler);
        this._mouseDownHandler = null;
    }

    async _mouseDown(event) {
        event.preventDefault();
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        console.log(name);
    }
}

customElements.define("image-card", ImageCard);