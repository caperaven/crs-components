import {UnorderedList} from "./../base-components/unordered-list.js";

class Menu extends UnorderedList {
    async connectedCallback() {
        await super.connectedCallback("menu", "menuitem");
    }

    async reverseSelection(element) {
        element.removeAttribute("aria-current");
    }

    async setSelection(element) {
        element.setAttribute("aria-current", "page");
    }
}

customElements.define("unordered-menu", Menu, { extends: 'ul' });