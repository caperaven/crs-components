import {OrderedList} from "../lists/ordered-list.js";

class MainMenu extends OrderedList {
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

customElements.define("main-menu", MainMenu, { extends: 'ol' });