import "./../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {rawToGeometry} from "./../../src/gfx-helpers/raw-to-geometry.js";

export default class FlowchartItems extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = document.querySelector("perspective-canvas");
        this.items = ["action", "data", "decision", "delay", "display", "documents", "document", "event", "inputOutput", "loopLimit", "manualOperations", "manualInput", "merge", "offPage", "predefinedProcesses", "preparation", "start"];

        const ready = async () => {
            requestAnimationFrame(async () => {
                this.canvas.removeEventListener("ready", ready);
                this.canvas.camera.position.z = 5;

                await this.addFromData();
                await this.render();
            })
        }

        this.canvas.addEventListener("ready", ready);
    }

    async disconnectedCallback() {
        this.plane = null;
        this.canvas = null;
        this.sceneItems = null;
        this.currentIndex = null;
        this.items = null;
    }

    async render() {
        requestAnimationFrame(this.render.bind(this));
        this.canvas.render();
    }

    async addFromData() {
        this.sceneItems = [];
        const material = await crs.createThreeObject("MeshBasicMaterial", {color: await crs.createColor("#ff0000")});
        for (let item of this.items) {
            const name = `${item}Data`;
            const file = `./../../src/geometry-data/flowchart/${name}.js`;
            const value = (await import(file))[name];

            const result = await rawToGeometry(value, material);
            result.visible = false;

            this.sceneItems.push(result);
            this.canvas.scene.add(result);
        }

        this.setProperty("shape", this.items[0]);
        this.sceneItems[this.currentIndex = 0].visible = true;
    }

    async previous() {
        if (this.currentIndex > 0) {
            this.sceneItems[this.currentIndex].visible = false;
            this.sceneItems[this.currentIndex -= 1].visible = true;
        }
        this.setProperty("shape", this.items[this.currentIndex]);
    }

    async next() {
        if (this.currentIndex < this.sceneItems.length -1) {
            this.sceneItems[this.currentIndex].visible = false;
            this.sceneItems[this.currentIndex += 1].visible = true;
        }
        this.setProperty("shape", this.items[this.currentIndex]);
    }
}