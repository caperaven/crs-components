import {AriaElement} from "../base-components/aria-element.js";

class OverflowToolbar extends AriaElement {
    async connectedCallback() {
        await super.connectedCallback("toolbar");
    }
}

customElements.define("overflow-toolbar", OverflowToolbar);