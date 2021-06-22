import "./../../src/components/radio-group/radio-group.js";

export default class Radio extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    load() {
        this.setProperty("model", {selectedValue: 10});
        super.load();
    }
}