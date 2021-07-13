export class HeaderElement extends crsbinding.classes.PerspectiveElement {
    async connectedCallback() {
        this.classList.add("crs-header");
        await super.connectedCallback();
    }
}

customElements.define("crs-header", HeaderElement);