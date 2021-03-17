import {showElementRelativeTo} from "../../src/components/lib/element-utils.js";

export default class RelativePlacement extends crsbinding.classes.ViewBase {
    load() {
        this.setProperty("placement", "bottom");
        this.setProperty("parent", "center");
        super.load();
    }

    placementChanged() {
        this.update();
    }

    parentChanged() {
        this.update();
    }

    update() {
        const parent = document.querySelector(`#parent-${this.getProperty("parent") || "center"}`);
        const target = document.querySelector("#target");
        showElementRelativeTo(parent, target, this.getProperty("placement") || "bottom", 16).catch(error => console.error(error));
    }
}