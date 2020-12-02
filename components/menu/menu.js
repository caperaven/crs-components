import {UnorderedList} from "./../base-components/unordered-list.js";

class Menu extends UnorderedList {
    async connectedCallback() {
        await super.connectedCallback("menu", "menuitem");
    }
}

customElements.define("unordered-menu", Menu, { extends: 'ul' });