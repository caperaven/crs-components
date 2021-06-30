import "./../../src/visualization/percent-bar/percent-bar.js";
import "./../../src/visualization/percent-bar-group/percent-bar-group.js";

export default class Visualizations extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("data", [
            {
                title: "Item 1",
                value: 30
            },
            {
                title: "Item 2",
                value: 80,
                color: "#FFBB00"
            },
            {
                title: "Item 3",
                value: 50,
                color: "#FF0090"
            }
        ])
    }
}