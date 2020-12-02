import "../../components/main-menu/main-menu.js";

export default class UnorderedMenu extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async menuChanged(event) {
        console.log(event.detail);
    }
}