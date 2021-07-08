import {OrderedList} from "../lists/ordered-list.js";

class MainMenu extends OrderedList {
    async connectedCallback() {
        await super.connectedCallback("menu", "menuitem");
    }

    async reverseSelection(element) {
        element.removeAttribute("aria-current");
        element.setAttribute("tabindex", "-1");
    }

    async setSelection(element) {
        const selected = this.querySelector("[aria-current]");
        selected?.removeAttribute("aria-current");
        element.setAttribute("aria-current", "page");
    }
}

customElements.define("main-menu", MainMenu, { extends: 'ol' });