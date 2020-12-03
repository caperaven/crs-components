import {enableContainerFeatures} from "./../base-components/container-mixin.js";
import {enableHorizontalKeys} from "./../lib/horizontal-key-navigation.js";

class OverflowToolbar extends HTMLElement {
    async connectedCallback() {
        await enableContainerFeatures(this);
        await this.init("toolbar")
        await enableHorizontalKeys(this);
    }

    async disconnectedCallback() {
        crsbinding.dom.disableEvents(this);
    }
}

customElements.define("overflow-toolbar", OverflowToolbar);