import {enableListFeatures} from "./list-mixin.js";

export class OrderedList extends HTMLOListElement {
    async connectedCallback(role, childRole) {
        await enableListFeatures(this);
        this.init(role, childRole);
    }

    async disconnectedCallback() {
        this.dispose();
    }
}