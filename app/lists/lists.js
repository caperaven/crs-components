import "./../../components/main-menu/main-menu.js";
import "./../../components/lists/ordered-list.js";
import "./../../components/lists/unordered-list.js";

import {createVerticalList} from "./../../components/lib/element-utils.js";

export default class Lists extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async menuChanged(event) {
        console.log(event.detail);
    }

    async addList(event) {
        const element = await createVerticalList();
        event.target.parentElement.appendChild(element);
    }
}