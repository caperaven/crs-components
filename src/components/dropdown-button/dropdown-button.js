import {showElementRelativeTo} from "./../lib/element-utils.js";

export class DropdownButton extends HTMLButtonElement {
    async connectedCallback() {
        this.classList.add("dropdown");
        this._activeHandler = this.active.bind(this);
        this._closeHandler = this.closePopup.bind(this);
        this.addEventListener("click", this._activeHandler);
    }

    async disconnectedCallback() {
        this.removeEventListener("click", this._activeHandler);
        this._closeHandler = null;
        this._activeHandler = null;
    }

    async active() {
        const template = this.querySelector(this.dataset.items ? `#${this.dataset.items}` : "template");
        const element = template.content.cloneNode(true).children[0];
        element.classList.add("crs-popup");
        document.body.appendChild(element);
        this._popup = element;

        element.addEventListener("changed", this._closeHandler);
        element.addEventListener("cancel", this._closeHandler);

        requestAnimationFrame(() => {
            showElementRelativeTo(this, element, "bottom");
        })
    }

    async closePopup(event) {
        const intent = event.target.dataset.intent;
        this._popup.removeEventListener("changed", this._closeHandler);
        this._popup.removeEventListener("cancel", this._closeHandler);
        this._popup.parentElement.removeChild(this._popup);
        delete this._popup;

        if (intent !== null) {
            this.dispatchEvent(new CustomEvent("action", {detail: intent}));
            this.focus();
        }
    }
}

customElements.define("dropdown-button", DropdownButton, { extends: 'button' });