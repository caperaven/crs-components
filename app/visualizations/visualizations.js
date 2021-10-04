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
                title: "Running",
                value: 150,
                color: "#0276C2",
                icon: "home"
            },
            {
                title: "Complete",
                value: 75,
                color: "#FFBB00",
                icon: "settings"
            },
            {
                title: "Aborted",
                value: 28,
                color: "#F97825",
                icon: "info"
            },
            {
                title: "Cancelled",
                value: 15,
                color: "#E00000"
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

        this.setProperty("summary", {
            count: 268,
            title: "Summary"
        })
    }

    add() {
        const values = this.getProperty("data");
        values.push({
            title: "Item 4",
            value: 60,
            color: "#ff0090"
        })

        this.setProperty("summary", {
            count: 328,
            title: "Hello Summary"
        })

        crsbinding.data.updateUI(this, "data");
    }
}