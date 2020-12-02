import {enableListFeatures} from "./list-mixin.js";

export class UnorderedList extends HTMLUListElement {
    async connectedCallback(role, childRole) {
        await enableListFeatures(this);
        this.init(role, childRole);
    }

    async disconnectedCallback() {
        this.dispose();
    }
}