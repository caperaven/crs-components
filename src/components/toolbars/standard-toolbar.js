import {enableContainerFeatures} from "../base-components/container-mixin.js";
import {enableHorizontalKeys} from "../lib/horizontal-key-navigation.js";

class StandardToolbar extends HTMLDivElement {
    async connectedCallback() {
        await enableContainerFeatures(this);
        await this.init("toolbar")
        await enableHorizontalKeys(this);
    }

    async disconnectedCallback() {
        this.dispose();
    }
}

customElements.define("standard-toolbar", StandardToolbar, { extends: 'div' });