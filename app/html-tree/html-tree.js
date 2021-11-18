export default class Lists extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.target = document.querySelector(this.getAttribute("for"));
    }

    async disconnectedCallback() {
        delete this.target;
    }
}