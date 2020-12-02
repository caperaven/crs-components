import {disableChildTabbing} from "../lib/element-utils.js";

export class AriaElement extends HTMLElement {
    async connectedCallback(role, options) {
        await ariaConnectedCallback.call(this, role, options);
        crsbinding.dom.enableEvents(this);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await ariaDisconnectedCallback();
        crsbinding.dom.disableEvents(this);
    }

    async keyup(event) {
        return true;
    }
}

export class AriaBindableElement extends crsbinding.classes.BindableElement {
    async connectedCallback(role, options) {
        await super.connectedCallback();
        await ariaConnectedCallback.call(this, role, options);
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await ariaDisconnectedCallback();
    }

    async keyup(event) {
        return true;
    }
}

async function ariaConnectedCallback(role, options) {
    options = options || {canFocus: true};
    const focusable = options.canFocus == null ? true : options.canFocus;

    if (role != null) {
        this.setAttribute("role", role);
    }

    if (focusable) {
        this.setAttribute("tabindex", "0");
        await disableChildTabbing(this);
        this.registerEvent("keyup", this.keyup);
    }
}

async function ariaDisconnectedCallback() {

}