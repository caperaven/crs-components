import {enableContainerFeatures} from "../base-components/container-mixin.js";
import {enableVerticalKeys} from "../lib/vertical-key-navigation.js";

export class OrderedList extends HTMLOListElement {
    async connectedCallback(role, childRole) {
        await enableContainerFeatures(this);
        this.init(role, childRole);
        await enableVerticalKeys(this);
    }

    async disconnectedCallback() {
        this.dispose();
    }
}

customElements.define("ol-list", OrderedList, { extends: 'ol' });