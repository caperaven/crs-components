import "./../../components/main-menu/main-menu.js";
import "./../../components/lists/ol-list.js";
import "./../../components/lists/ul-list.js";

export default class Lists extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async menuChanged(event) {
        console.log(event.detail);
    }
}