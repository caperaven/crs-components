import "./../../src/visualization/percent-bar/percent-bar.js";
import "./../../src/visualization/percent-bar-group/percent-bar-group.js";
import "./../../src/visualization/pass-fail-card/pass-fail-card.js";
import "./../../src/visualization/pass-fail-group/pass-fail-group.js";
import "./../../src/visualization/pie-chart/pie-chart.js";

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
        ]);

        this.setProperty("spares", [
            {
                title: "Disk Breakes",
                pass: 6,
                fail: 3
            },
            {
                title: "Rim Breaks",
                pass: 2,
                fail: 8
            },
            {
                title: "Air Breaks",
                pass: 0,
                fail: 15
            }
        ])
    }

    add() {
        const values = this.getProperty("data");
        values.push({
            title: "Item 4",
            value: 60,
            color: "red"
        })

        crsbinding.data.updateUI(this, "data");
    }
}